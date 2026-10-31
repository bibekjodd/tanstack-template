// Dev-only: lists every script a page asked for on its last load as <link rel="modulepreload">
// at the top of the next load's HTML (plans/07 in the platform monorepo).
//
// In dev, Vite serves each module as its own file and the browser only finds a module's imports
// after it has that module, so a page loads in waves, one round trip per level of imports. The
// sandbox preview reaches the browser through a tunnel that speaks HTTP/1.1 with a round trip of
// 50-300 ms, so a page with ~150 modules (TanStack Router alone serves ~100 unbundled) took 5-9 s
// to become interactive on every reload. Listing them up front lets the browser fetch them all at
// once (measured 2026-10-28 on one sandbox: warm reloads 4.2-4.8 s -> 1.9-2.3 s; the first reload
// after an edit is unchanged, about 6.5 s). A module preloaded but no longer imported costs one
// wasted fetch.
//
// Platform code, like the rest of .forcey/: never synced into a project, exported or deployed, and
// inert in production builds (`apply: 'serve'`).
import type { ServerResponse } from 'node:http';
import type { Connect, Plugin, ViteDevServer } from 'vite';

const MAX_LINKS = 300;
const MAX_PAGES = 50;
// Scripts requested this long after a page's document are counted as that page's.
const RECORD_WINDOW_MS = 30_000;

type PageScripts = Map<string, string>;

// One entry per module: the same file under a newer ?t= (HMR) or ?v= (dependency hash) replaces
// the older URL instead of adding a second preload.
const moduleKey = (url: string): string => {
  const [path, query = ''] = url.split('?');
  const kept = query
    .split('&')
    .filter((part) => part && !part.startsWith('t=') && !part.startsWith('v='))
    .join('&');
  return kept ? `${path}?${kept}` : path!;
};

const pathOf = (url: string): string => url.split('?')[0] || '/';

const escapeAttribute = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const isDocument = (req: Connect.IncomingMessage) =>
  req.method === 'GET' &&
  (req.headers['sec-fetch-dest'] === 'document' || req.headers['sec-fetch-dest'] === 'iframe');

const isScript = (req: Connect.IncomingMessage) =>
  req.method === 'GET' && req.headers['sec-fetch-dest'] === 'script';

export function forceyPreload(): Plugin {
  const pages = new Map<string, PageScripts>();
  let current: { page: string; at: number } | null = null;

  // Kept only once it was served: a script that failed is dropped instead, so a stale URL is
  // preloaded at most once. A dependency chunk from before Vite's last re-optimization has its
  // own hashed name (react-BwMsB7H7.js), so a newer one never replaces it; the dev server answers
  // it 504 "Outdated Optimize Dep" and it would otherwise be asked for on every load.
  const record = (url: string, status: number, page: { page: string; at: number } | null) => {
    if (!page || Date.now() - page.at > RECORD_WINDOW_MS) return;
    let scripts = pages.get(page.page);
    if (status >= 400) {
      scripts?.delete(moduleKey(url));
      return;
    }
    if (!scripts) {
      scripts = new Map();
      pages.set(page.page, scripts);
      if (pages.size > MAX_PAGES) pages.delete(pages.keys().next().value!);
    }
    if (scripts.size < MAX_LINKS || scripts.has(moduleKey(url))) scripts.set(moduleKey(url), url);
  };

  // The URL the page will ask for now: an edit since the last load gives a file (and so its
  // importers' imports of it) a newer ?t=, which Vite takes from the module graph.
  const currentUrl = (url: string, server: ViteDevServer): string => {
    if (url.includes('/node_modules/')) return url;
    const [path, query = ''] = url.split('?');
    const rest = query.split('&').filter((part) => part && !part.startsWith('t='));
    const key = rest.length > 0 ? `${path}?${rest.join('&')}` : path!;
    const stamp = server.environments.client.moduleGraph.urlToModuleMap.get(key)?.lastHMRTimestamp;
    if (!stamp) return key;
    return `${path}?${[`t=${stamp}`, ...rest].join('&')}`;
  };

  const linksFor = (page: string, server: ViteDevServer): string => {
    const scripts = pages.get(page);
    if (!scripts || scripts.size === 0) return '';
    return [...scripts.values()]
      .map((url) => `<link rel="modulepreload" href="${escapeAttribute(currentUrl(url, server))}">`)
      .join('');
  };

  // Puts the links straight after <head> in the first chunk that has it, and only into an
  // uncompressed HTML response whose Content-Length it could drop (Node closes a response whose
  // body outgrows its declared length). Anything else passes through untouched.
  const injectInto = (res: ServerResponse, links: string) => {
    let state: 'undecided' | 'inject' | 'pass' = 'undecided';
    const write = res.write.bind(res) as (...args: unknown[]) => boolean;
    const end = res.end.bind(res) as (...args: unknown[]) => unknown;
    const writeHead = res.writeHead.bind(res) as (...args: unknown[]) => unknown;

    const decide = (headers: [string, string][]) => {
      const value = (name: string) =>
        headers.find(([key]) => key.toLowerCase() === name)?.[1] ??
        String(res.getHeader(name) ?? '');
      state =
        value('content-type').includes('text/html') && !value('content-encoding')
          ? 'inject'
          : 'pass';
      if (state === 'inject') res.removeHeader('content-length');
    };

    // writeHead takes headers as an object, a flat [name, value, ...] list (srvx, which serves
    // the SSR page) or a list of pairs; drop Content-Length from whichever it got.
    res.writeHead = ((...args: unknown[]) => {
      const index = args.findIndex((a) => a !== null && typeof a === 'object');
      const raw = index === -1 ? undefined : args[index];
      let pairs: [string, string][] = [];
      if (Array.isArray(raw)) {
        pairs = Array.isArray(raw[0])
          ? (raw as [string, string][]).map(([k, v]) => [String(k), String(v)])
          : Array.from({ length: Math.floor(raw.length / 2) }, (_, i) => [
              String(raw[i * 2]),
              String(raw[i * 2 + 1])
            ]);
      } else if (raw) {
        pairs = Object.entries(raw as Record<string, unknown>).map(([k, v]) => [k, String(v)]);
      }
      if (state === 'undecided') decide(pairs);
      if (state === 'inject' && raw) {
        const kept = pairs.filter(([key]) => key.toLowerCase() !== 'content-length');
        args[index] = Array.isArray(raw)
          ? Array.isArray(raw[0])
            ? kept
            : kept.flat()
          : Object.fromEntries(kept);
      }
      return writeHead(...args);
    }) as typeof res.writeHead;

    const rewrite = (chunk: unknown): unknown => {
      if (state === 'undecided') {
        if (res.headersSent) state = 'pass';
        else decide([]);
      }
      if (state !== 'inject') return chunk;
      // Bytes, not text: a chunk can end inside a multi-byte character.
      const bytes =
        typeof chunk === 'string'
          ? Buffer.from(chunk)
          : chunk instanceof Uint8Array
            ? Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength)
            : null;
      if (bytes === null) return chunk;
      // `<head>` or `<head ...>`, never `<header`.
      let open = bytes.indexOf('<head');
      while (open !== -1 && !/[\s>]/.test(String.fromCharCode(bytes[open + 5] ?? 0)))
        open = bytes.indexOf('<head', open + 5);
      const close = open === -1 ? -1 : bytes.indexOf('>', open);
      if (close === -1) return chunk;
      state = 'pass';
      return Buffer.concat([
        bytes.subarray(0, close + 1),
        Buffer.from(links),
        bytes.subarray(close + 1)
      ]);
    };

    res.write = ((chunk: unknown, ...rest: unknown[]) =>
      write(rewrite(chunk), ...rest)) as typeof res.write;
    res.end = ((chunk?: unknown, ...rest: unknown[]) =>
      typeof chunk === 'function' || chunk === undefined
        ? end(chunk, ...rest)
        : end(rewrite(chunk), ...rest)) as typeof res.end;
  };

  return {
    name: 'forcey-preload',
    apply: 'serve',

    configureServer(server) {
      const handle: Connect.NextHandleFunction = (req, res, next) => {
        const url = req.url ?? '/';
        if (isScript(req)) {
          const page = current;
          res.on('finish', () => record(url, res.statusCode, page));
        } else if (isDocument(req)) {
          const page = pathOf(url);
          current = { page, at: Date.now() };
          const links = linksFor(page, server);
          if (links) injectInto(res as ServerResponse, links);
        }
        next();
      };
      // First in the stack: the document is answered by the SSR middleware, which ends the
      // response before anything registered after it runs.
      server.middlewares.stack.unshift({ route: '', handle });
    }
  };
}
