import { ModalClient } from 'modal';
import { writeFileSync } from 'node:fs';

const releaseTag = process.env.RELEASE_TAG;
if (!releaseTag) throw new Error('RELEASE_TAG env var is required (e.g. v1.0.0)');

const repoUrl = process.env.TEMPLATE_REPO_URL;
if (!repoUrl) throw new Error('TEMPLATE_REPO_URL env var is required');

const modal = new ModalClient();
const app = await modal.apps.fromName('tanstack-start-template', { createIfMissing: true });

const image = modal.images
  .fromRegistry('node:22-slim')
  .dockerfileCommands([
    'RUN apt-get update && apt-get install -y --no-install-recommends git ' +
      '&& rm -rf /var/lib/apt/lists/*'
  ])
  .dockerfileCommands([
    'WORKDIR /app',
    `RUN git clone --depth 1 --branch ${releaseTag} ${repoUrl} .`,
    'RUN npm ci',
    // Warms Vite's dep-optimizer cache (node_modules/.vite) so a sandbox's first
    // `npm run dev` compile isn't cold. Discards the production build output itself
    // — the sandbox always runs the dev server, never this build.
    'RUN npm run build && rm -rf .output .nitro .wrangler'
  ]);

console.log(`Building image for ${releaseTag}...`);
const built = await image.build(app);

const manifest = {
  imageId: built.imageId,
  tag: releaseTag,
  builtAt: new Date().toISOString()
};

writeFileSync('image.json', `${JSON.stringify(manifest, null, 2)}\n`);
console.log('Built and recorded image:', manifest);
