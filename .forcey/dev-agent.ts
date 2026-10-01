// Dev-only browser agent for the Forcey Magic editor. Loaded by .forcey/forcey-dev.ts in a
// sandbox only; no project file imports it and it never ships in a production build.
//
// Captures console output, uncaught errors, unhandled rejections and failed requests, redacts
// credentials, and sends them to the dev server (same origin) so the code agent can read what
// the user saw. It also tells the editor frame about HMR state over postMessage. Console calls
// always reach the original methods: nothing the app logs is swallowed.

type AgentEvent = {
  kind: 'console' | 'error' | 'network';
  level: string;
  message: string;
  stack?: string;
  detail?: Record<string, unknown>;
  at: number;
};

declare global {
  interface Window {
    __forceyDevAgent?: true;
  }
}

const ENDPOINT = '/__forcey/events';
const PROTOCOL_VERSION = 1;
const FLUSH_MS = 500;
const MAX_QUEUE = 100;
const MAX_EXCERPT = 500;

const SECRET_PATTERNS: [RegExp, string][] = [
  [/\b(bearer|basic)\s+[A-Za-z0-9._~+/=-]{8,}/gi, '$1 [redacted]'],
  [/\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g, '[redacted-jwt]'],
  [
    /([?&](?:token|key|secret|password|auth|code|signature|access_token)=)[^&\s"']+/gi,
    '$1[redacted]'
  ]
];
const redact = (text: string) =>
  SECRET_PATTERNS.reduce((out, [pattern, replacement]) => out.replace(pattern, replacement), text);

const describe = (value: unknown): string => {
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

// The editor's origin, from the browser itself. Messages are only ever posted to it, never '*'.
const parentOrigin = (): string | null => {
  if (window.parent === window) return null;
  const ancestors = window.location.ancestorOrigins;
  if (ancestors && ancestors.length > 0) return ancestors[0] ?? null;
  try {
    return document.referrer ? new URL(document.referrer).origin : null;
  } catch {
    return null;
  }
};

const start = () => {
  if (window.__forceyDevAgent) return;
  window.__forceyDevAgent = true;

  const nativeFetch = window.fetch.bind(window);
  const editorOrigin = parentOrigin();
  const queue: AgentEvent[] = [];

  const toEditor = (type: string, payload: Record<string, unknown>) => {
    if (editorOrigin)
      window.parent.postMessage({ v: PROTOCOL_VERSION, type, ...payload }, editorOrigin);
  };

  const flush = () => {
    if (queue.length === 0) return;
    const events = queue.splice(0, queue.length);
    void nativeFetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events }),
      keepalive: true
    }).catch(() => {});
  };
  setInterval(flush, FLUSH_MS);
  window.addEventListener('pagehide', flush);

  const record = (event: Omit<AgentEvent, 'at'>) => {
    const clean: AgentEvent = {
      ...event,
      message: redact(event.message),
      stack: event.stack ? redact(event.stack) : undefined,
      at: Date.now()
    };
    if (queue.length < MAX_QUEUE) queue.push(clean);
    toEditor(
      event.kind === 'network'
        ? 'forcey:network'
        : event.kind === 'error'
          ? 'forcey:error'
          : 'forcey:console',
      { entry: clean }
    );
  };

  for (const level of ['error', 'warn', 'info', 'log'] as const) {
    const original = console[level].bind(console);
    console[level] = (...args: unknown[]) => {
      original(...args);
      const error = args.find((a): a is Error => a instanceof Error);
      record({
        kind: 'console',
        level,
        message: args.map(describe).join(' '),
        stack: error?.stack
      });
    };
  }

  window.addEventListener('error', (event) => {
    record({
      kind: 'error',
      level: 'error',
      message: event.error instanceof Error ? describe(event.error) : event.message,
      stack:
        event.error instanceof Error
          ? event.error.stack
          : `at ${event.filename}:${event.lineno}:${event.colno}`
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason: unknown = event.reason;
    record({
      kind: 'error',
      level: 'error',
      message: `Unhandled rejection: ${describe(reason)}`,
      stack: reason instanceof Error ? reason.stack : undefined
    });
  });

  // Requests: method, URL, status and timing for all; a response excerpt only for failures.
  // Request and response headers are never read, so no credential can be captured from them.
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const method = (
      init?.method ?? (input instanceof Request ? input.method : 'GET')
    ).toUpperCase();
    if (url.includes(ENDPOINT)) return nativeFetch(input, init);
    const startedAt = performance.now();
    try {
      const response = await nativeFetch(input, init);
      const ms = Math.round(performance.now() - startedAt);
      if (!response.ok) {
        const excerpt = await response
          .clone()
          .text()
          .then((t) => t.slice(0, MAX_EXCERPT))
          .catch(() => '');
        record({
          kind: 'network',
          level: 'error',
          message: `${method} ${url} → ${response.status}`,
          detail: { method, url, status: response.status, ms, excerpt: redact(excerpt) }
        });
      } else {
        record({
          kind: 'network',
          level: 'info',
          message: `${method} ${url} → ${response.status}`,
          detail: { method, url, status: response.status, ms }
        });
      }
      return response;
    } catch (error) {
      record({
        kind: 'network',
        level: 'error',
        message: `${method} ${url} → failed: ${describe(error)}`,
        detail: { method, url, status: 0, ms: Math.round(performance.now() - startedAt) }
      });
      throw error;
    }
  };

  const NativeXhr = window.XMLHttpRequest;
  window.XMLHttpRequest = class extends NativeXhr {
    private forceyMethod = 'GET';
    private forceyUrl = '';
    private forceyStartedAt = 0;
    open(
      method: string,
      url: string | URL,
      async = true,
      username?: string | null,
      password?: string | null
    ) {
      this.forceyMethod = method.toUpperCase();
      this.forceyUrl = String(url);
      super.open(method, url, async, username, password);
    }
    send(body?: Document | XMLHttpRequestBodyInit | null) {
      this.forceyStartedAt = performance.now();
      this.addEventListener('loadend', () => {
        const status = this.status;
        const ms = Math.round(performance.now() - this.forceyStartedAt);
        record({
          kind: 'network',
          level: status === 0 || status >= 400 ? 'error' : 'info',
          message: `${this.forceyMethod} ${this.forceyUrl} → ${status || 'failed'}`,
          detail: { method: this.forceyMethod, url: this.forceyUrl, status, ms }
        });
      });
      super.send(body);
    }
  };

  // HMR state for the editor's "applying / failed / ready" indicator.
  if (import.meta.hot) {
    import.meta.hot.on('vite:beforeUpdate', () => toEditor('forcey:hmr', { state: 'pending' }));
    import.meta.hot.on('vite:afterUpdate', () => toEditor('forcey:hmr', { state: 'applied' }));
    import.meta.hot.on('vite:error', (payload: { err?: { message?: string } }) =>
      toEditor('forcey:hmr', {
        state: 'error',
        message: redact(payload.err?.message ?? 'Compile error')
      })
    );
  }

  window.addEventListener('message', (event) => {
    if (!editorOrigin || event.origin !== editorOrigin) return;
    const data = event.data as { v?: number; type?: string } | null;
    if (data?.v !== PROTOCOL_VERSION) return;
    if (data.type === 'forcey:ping') toEditor('forcey:ready', { url: window.location.href });
    if (data.type === 'forcey:reload') window.location.reload();
  });

  toEditor('forcey:ready', { url: window.location.href });
};

if (typeof window !== 'undefined' && import.meta.env.DEV) start();

export {};
