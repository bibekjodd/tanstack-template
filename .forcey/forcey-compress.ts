// Dev-only response compression for the sandbox preview. Vite's dev server sends every module
// uncompressed, and the preview reaches the browser through a tunnel that speaks HTTP/1.1 at
// about 1.4 MB/s, so a cold load of ~6 MB of modules is what keeps the page from being
// interactive for seconds. Compressing JS, CSS and JSON cuts that to roughly a quarter.
// Platform code like the rest of .forcey/: `apply: 'serve'`, so it never reaches a build.
//
// HTML is left alone on purpose: TanStack Start streams the server-rendered page, and a
// compressor would hold chunks back until it fills a block.
import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  constants,
  createBrotliCompress,
  createGzip,
  type BrotliCompress,
  type Gzip
} from 'node:zlib';
import type { Connect, Plugin } from 'vite';

const COMPRESSIBLE =
  /^(text\/(javascript|css|plain)|application\/(javascript|json|manifest\+json)|image\/svg\+xml)\b/i;
// A response this small costs more in headers and CPU than it saves.
const MIN_BYTES = 1024;
// Brotli at its default quality is slow enough to be felt on a 1 MB dependency; 4 is close to
// gzip's speed and still smaller.
const BROTLI_QUALITY = 4;

type Encoding = 'br' | 'gzip';

const pickEncoding = (req: IncomingMessage): Encoding | null => {
  const accepted = String(req.headers['accept-encoding'] ?? '');
  if (/\bbr\b/.test(accepted)) return 'br';
  if (/\bgzip\b/.test(accepted)) return 'gzip';
  return null;
};

const addVary = (res: ServerResponse) => {
  const current = String(res.getHeader('vary') ?? '');
  if (/accept-encoding/i.test(current)) return;
  res.setHeader('Vary', current ? `${current}, Accept-Encoding` : 'Accept-Encoding');
};

const compress: Connect.NextHandleFunction = (req, res, next) => {
  const encoding = pickEncoding(req);
  if (!encoding || req.method !== 'GET' || req.headers.range) return next();

  const rawWrite = res.write.bind(res);
  const rawEnd = res.end.bind(res);
  let decided = false;
  let sink: BrotliCompress | Gzip | undefined;

  // Decided on the first write or end, when Vite has set every header it is going to set.
  const decide = () => {
    decided = true;
    // Streamed static files (public/) call writeHead before their first write: too late to add
    // Content-Encoding, and setHeader would throw and take the dev server down with it.
    if (res.headersSent) return;
    const type = String(res.getHeader('content-type') ?? '');
    if (!COMPRESSIBLE.test(type) || res.getHeader('content-encoding')) return;
    addVary(res);
    const status = res.statusCode;
    if (status < 200 || status === 204 || status === 304) return;
    const length = Number(res.getHeader('content-length') ?? Infinity);
    if (length < MIN_BYTES) return;

    sink =
      encoding === 'br'
        ? createBrotliCompress({ params: { [constants.BROTLI_PARAM_QUALITY]: BROTLI_QUALITY } })
        : createGzip({ level: 6 });
    res.removeHeader('Content-Length');
    res.setHeader('Content-Encoding', encoding);
    sink.on('data', (chunk: Buffer) => {
      rawWrite(chunk);
    });
    sink.on('error', () => {
      res.destroy();
    });
    sink.on('end', () => {
      rawEnd();
    });
    res.on('close', () => sink?.destroy());
  };

  res.write = function (...args: unknown[]) {
    if (!decided) decide();
    if (!sink) return Reflect.apply(rawWrite, res, args) as boolean;
    const [chunk] = args;
    return sink.write(chunk as string | Uint8Array);
  } as typeof res.write;

  res.end = function (...args: unknown[]) {
    if (!decided) decide();
    if (!sink) return Reflect.apply(rawEnd, res, args) as ServerResponse;
    const [chunk] = args;
    if (typeof chunk === 'string' || chunk instanceof Uint8Array) sink.end(chunk);
    else sink.end();
    return res;
  } as typeof res.end;

  next();
};

export function forceyCompress(): Plugin {
  return {
    name: 'forcey-compress',
    apply: 'serve',
    configureServer(server) {
      // Registered directly, not from a returned function, so it wraps the response before
      // Vite's own middlewares write to it.
      server.middlewares.use(compress);
    }
  };
}
