import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    port: 3000,
    allowedHosts: true
  },
  ssr: {
    // react-tweet imports its own .css files, which Node's loader cannot read on the server: Vite
    // has to process the package so the tweet card server-renders instead of falling back to the
    // client.
    noExternal: ['react-tweet']
  },
  plugins: [tsconfigPaths(), tailwindcss(), tanstackStart(), viteReact(), nitro()]
});
