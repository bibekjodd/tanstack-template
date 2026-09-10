import { ModalClient } from 'modal';
import { readFileSync } from 'node:fs';

const PORT = 3000;
const WORKDIR = '/app';
const READY_TIMEOUT_MS = 60_000;
const READY_POLL_INTERVAL_MS = 1_000;
const SANDBOX_TIMEOUT_MS = 15 * 60_000; // hard ceiling — this is a manual demo, not a pooled sandbox
const SANDBOX_IDLE_TIMEOUT_MS = 10 * 60_000;

const manifest = JSON.parse(readFileSync('image.json', 'utf-8')) as {
  imageId: string | null;
  tag: string | null;
};

if (!manifest.imageId) {
  throw new Error(
    'image.json has no imageId yet — tag a release to build one first (see README "The Modal image").'
  );
}

console.log(`Using image ${manifest.imageId} (tag ${manifest.tag})`);

const modal = new ModalClient();
const app = await modal.apps.fromName('tanstack-start-template', { createIfMissing: true });
const image = await modal.images.fromId(manifest.imageId);

console.log('Creating sandbox...');
const sb = await modal.sandboxes.create(app, image, {
  cpu: 0.5,
  memoryMiB: 2048,
  workdir: WORKDIR,
  encryptedPorts: [PORT],
  timeoutMs: SANDBOX_TIMEOUT_MS,
  idleTimeoutMs: SANDBOX_IDLE_TIMEOUT_MS
});
await sb.setTags({ purpose: 'demo' });
console.log('Sandbox created:', sb.sandboxId);

let terminated = false;
const cleanup = async () => {
  if (terminated) return;
  terminated = true;
  console.log('\nTerminating sandbox...');
  await sb.terminate();
  console.log('Terminated.');
};
process.on('SIGINT', () => void cleanup().then(() => process.exit(0)));
process.on('SIGTERM', () => void cleanup().then(() => process.exit(0)));

try {
  console.log('Starting dev server...');
  await sb.exec(['bash', '-lc', 'npm run dev']);

  const tunnel = (await sb.tunnels())[PORT];
  if (!tunnel) throw new Error(`No tunnel for port ${PORT}`);
  console.log('Tunnel URL:', tunnel.url);

  console.log('Waiting for the dev server to respond...');
  const deadline = Date.now() + READY_TIMEOUT_MS;
  let ready = false;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(tunnel.url);
      if (res.ok) {
        ready = true;
        break;
      }
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, READY_POLL_INTERVAL_MS));
  }

  if (!ready) {
    console.log(`Still not responding after ${READY_TIMEOUT_MS}ms — try opening it manually:`);
  } else {
    console.log('Ready!');
  }
  console.log(`\n${tunnel.url}\n`);
  console.log(`Sandbox will auto-terminate after ${SANDBOX_TIMEOUT_MS / 60_000} minutes,`);
  console.log('or press Ctrl+C to terminate it now.');

  await new Promise(() => {}); // keep the script alive until Ctrl+C or the sandbox's own timeout
} catch (error) {
  await cleanup();
  throw error;
}
