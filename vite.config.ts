import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { forceyDev } from './plugins/forcey-dev';

export default defineConfig({
  server: {
    port: 3000,
    allowedHosts: true
  },
  // forceyDev is dev-only runtime capture for the editor (see plugins/forcey-dev.ts).
  plugins: [forceyDev(), tsconfigPaths(), tailwindcss(), tanstackStart(), viteReact(), nitro()]
});
