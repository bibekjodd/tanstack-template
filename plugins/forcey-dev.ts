// Dev-only runtime capture for the Forcey Magic editor (plans/07 in the platform monorepo).
//
// The in-browser agent (src/lib/__forcey/dev-agent.ts) posts console output, uncaught errors,
// rejections and failed requests to this dev server, same-origin. This plugin also records what
// only the server sees: compile errors (Vite's error payloads) and server-side console errors
// (SSR). Everything is source-mapped, deduplicated and kept in bounded ring buffers, and
// GET /__forcey/events returns the current snapshot. It is inert in production builds
// (`apply: 'serve'`) and never writes to disk.
import { posix } from 'node:path';
import { SourceMapConsumer, type RawSourceMap } from 'source-map-js';
import type { Connect, Plugin, ViteDevServer } from 'vite';

type Kind = 'console' | 'error' | 'network' | 'server';

export type RuntimeEvent = {
  kind: Kind;
  level: string;
  message: string;
  stack?: string;
  detail?: Record<string, unknown>;
  count: number;
  firstAt: number;
  lastAt: number;
};

type CompileState = { state: 'ok' | 'error'; message?: string; file?: string; at: number };

const RING_SIZE = 200;
const MAX_BODY_BYTES = 256 * 1024;
const MAX_MESSAGE_CHARS = 2000;
const MAX_STACK_CHARS = 4000;
const ENDPOINT = '/__forcey/events';
const AGENT_MODULE = '/src/lib/__forcey/dev-agent.ts';

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max)}…` : text);

// Tokens and credentials never leave the sandbox in a log line.
const SECRET_PATTERNS: [RegExp, string][] = [
  [/\b(bearer|basic)\s+[A-Za-z0-9._~+/=-]{8,}/gi, '$1 [redacted]'],
  [/\b(sk|pk|rk)[-_](live|test)?[-_]?[A-Za-z0-9]{12,}\b/g, '[redacted-key]'],
  [/\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g, '[redacted-jwt]'],
  [
    /([?&](?:token|key|secret|password|auth|code|signature|access_token)=)[^&\s"']+/gi,
    '$1[redacted]'
  ]
];
// Terminal colour codes mean nothing to a reader of the snapshot.
// eslint-disable-next-line no-control-regex
const stripAnsi = (text: string) => text.replace(/\u001b\[[0-9;]*m/g, '');

export const redact = (text: string): string =>
  SECRET_PATTERNS.reduce((out, [pattern, replacement]) => out.replace(pattern, replacement), text);

class RingBuffers {
  private readonly buffers = new Map<Kind, RuntimeEvent[]>();

  add(event: Omit<RuntimeEvent, 'count' | 'firstAt' | 'lastAt'> & { at?: number }) {
    const at = event.at ?? Date.now();
    const list = this.buffers.get(event.kind) ?? [];
    const key = `${event.level}\u0000${event.message}\u0000${event.stack?.split('\n')[1] ?? ''}`;
    const existing = list.find(
      (e) => `${e.level}\u0000${e.message}\u0000${e.stack?.split('\n')[1] ?? ''}` === key
    );
    if (existing) {
      existing.count++;
      existing.lastAt = at;
      return;
    }
    list.push({
      kind: event.kind,
      level: event.level,
      message: event.message,
      stack: event.stack,
      detail: event.detail,
      count: 1,
      firstAt: at,
      lastAt: at
    });
    if (list.length > RING_SIZE) list.shift();
    this.buffers.set(event.kind, list);
  }

  // Newest first, so a capped reader sees the most recent events.
  list(kind: Kind): RuntimeEvent[] {
    return [...(this.buffers.get(kind) ?? [])].sort((a, b) => b.lastAt - a.lastAt);
  }
}

// Maps browser stack frames (http://host/src/x.tsx?t=1:12:34) back to source positions using the
// transform result Vite already holds for that module.
const createStackMapper = (server: ViteDevServer) => {
  const consumers = new Map<string, { map: object; consumer: SourceMapConsumer }>();

  const consumerFor = async (url: string) => {
    const module = await server.environments.client.moduleGraph.getModuleByUrl(url);
    const map = module?.transformResult?.map;
    if (!map || !('mappings' in map)) return null;
    const cached = consumers.get(url);
    if (cached?.map === map) return cached.consumer;
    const consumer = new SourceMapConsumer(map as unknown as RawSourceMap);
    consumers.set(url, { map, consumer });
    return consumer;
  };

  return async (stack: string): Promise<string> => {
    const lines = await Promise.all(
      stack.split('\n').map(async (line) => {
        const match = /(https?:\/\/[^/\s]+)?(\/[^\s:)?]+)(\?[^\s:)]*)?:(\d+):(\d+)/.exec(line);
        const path = match?.[2];
        if (!match || !path?.startsWith('/src/')) return line;
        // Keep the module's own query (TanStack Router serves route components as
        // ?tsr-split=component, a separate module with its own map); drop HMR's ?t= timestamp.
        const query = (match[3] ?? '')
          .slice(1)
          .split('&')
          .filter((part) => part && !part.startsWith('t='))
          .join('&');
        const consumer = await consumerFor(query ? `${path}?${query}` : path).catch(() => null);
        if (!consumer) return line.replace(match[0], `${path.slice(1)}:${match[4]}:${match[5]}`);
        const original = consumer.originalPositionFor({
          line: Number(match[4]),
          column: Number(match[5]) - 1
        });
        if (original.line == null) return line;
        // Map sources are often relative to the module ("index.tsx"); resolve against its path.
        const originalSource = original.source?.replace(/\?.*$/, '');
        const sourcePath = originalSource
          ? originalSource.includes('/src/')
            ? originalSource.replace(/^.*?\/src\//, 'src/')
            : posix.join(posix.dirname(path.slice(1)), posix.basename(originalSource))
          : path.slice(1);
        return line.replace(
          match[0],
          `${sourcePath}:${original.line}:${(original.column ?? 0) + 1}`
        );
      })
    );
    return lines.join('\n');
  };
};

type IncomingEvent = {
  kind?: unknown;
  level?: unknown;
  message?: unknown;
  stack?: unknown;
  detail?: unknown;
  at?: unknown;
};

const readBody = (req: Connect.IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    let size = 0;
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) reject(new Error('body too large'));
      else chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });

export function forceyDev(): Plugin {
  const buffers = new RingBuffers();
  let compile: CompileState = { state: 'ok', at: Date.now() };

  return {
    name: 'forcey-dev',
    apply: 'serve',

    configureServer(server) {
      const mapStack = createStackMapper(server);
      // Absolute sandbox paths become project-relative, which is what every tool expects.
      const root = `${server.config.root.replace(/\/$/, '')}/`;
      const tidy = (text: string) => stripAnsi(text).split(root).join('');

      // Compile errors: Vite reports them to the browser as `error` payloads, and a later
      // `update` / `full-reload` means the module compiled again.
      const hot = server.ws;
      const send = hot.send.bind(hot) as (...args: unknown[]) => void;
      hot.send = ((...args: unknown[]) => {
        const payload = args[0] as
          | { type?: string; err?: { message?: string; id?: string; loc?: { file?: string } } }
          | undefined;
        if (payload?.type === 'error') {
          compile = {
            state: 'error',
            message: redact(tidy(clip(payload.err?.message ?? 'Compile error', MAX_MESSAGE_CHARS))),
            file:
              (payload.err?.loc?.file ?? payload.err?.id ?? '').replace(/^.*?\/src\//, 'src/') ||
              undefined,
            at: Date.now()
          };
        } else if (payload?.type === 'update' || payload?.type === 'full-reload') {
          if (compile.state === 'error') compile = { state: 'ok', at: Date.now() };
        }
        return send(...args);
      }) as typeof hot.send;

      // Server-side errors (SSR render failures, loader exceptions) only reach the dev server's
      // own console. Call through, always.
      for (const level of ['error', 'warn'] as const) {
        const original = console[level].bind(console);
        console[level] = (...args: unknown[]) => {
          original(...args);
          const text = args
            .map((a) =>
              a instanceof Error
                ? `${a.message}\n${a.stack ?? ''}`
                : typeof a === 'string'
                  ? a
                  : JSON.stringify(a)
            )
            .join(' ');
          const clean = tidy(text);
          buffers.add({
            kind: 'server',
            level,
            message: redact(clip(clean.split('\n')[0] ?? clean, MAX_MESSAGE_CHARS)),
            stack: redact(clip(clean, MAX_STACK_CHARS))
          });
        };
      }

      server.middlewares.use(ENDPOINT, async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        try {
          if (req.method === 'POST') {
            const body = JSON.parse(await readBody(req)) as { events?: IncomingEvent[] };
            for (const raw of (body.events ?? []).slice(0, 100)) {
              const kind =
                raw.kind === 'console' || raw.kind === 'error' || raw.kind === 'network'
                  ? raw.kind
                  : null;
              if (!kind || typeof raw.message !== 'string') continue;
              const stack =
                typeof raw.stack === 'string'
                  ? await mapStack(clip(raw.stack, MAX_STACK_CHARS))
                  : undefined;
              buffers.add({
                kind,
                level: typeof raw.level === 'string' ? raw.level : 'error',
                message: redact(clip(raw.message, MAX_MESSAGE_CHARS)),
                stack: stack ? redact(stack) : undefined,
                detail:
                  raw.detail && typeof raw.detail === 'object'
                    ? JSON.parse(redact(JSON.stringify(raw.detail)))
                    : undefined,
                at: typeof raw.at === 'number' ? raw.at : undefined
              });
            }
            res.end('{"ok":true}');
            return;
          }
          res.end(
            JSON.stringify({
              v: 1,
              generatedAt: Date.now(),
              compile,
              console: buffers.list('console'),
              errors: buffers.list('error'),
              network: buffers.list('network'),
              server: buffers.list('server')
            })
          );
        } catch {
          res.statusCode = 400;
          res.end('{"ok":false}');
        }
      });
    },

    // Loads the browser agent without touching any file the code agent edits. Appended, so no
    // existing line moves and the module's source map stays exact.
    transform(code, id, options) {
      if (options?.ssr || !id.endsWith('/src/router.tsx')) return null;
      return { code: `${code}\nimport '${AGENT_MODULE}';\n`, map: null };
    }
  };
}
