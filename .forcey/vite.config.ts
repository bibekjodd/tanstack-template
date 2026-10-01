// The sandbox's dev-server config: the project's own vite.config.ts plus the editor's
// runtime capture. The platform starts Vite with `--config .forcey/vite.config.ts`, so the
// project's config never has to mention the platform and an exported project is exactly the
// project. Works whether the project exports a config object or a config function.
import { defineConfig, mergeConfig, type ConfigEnv, type UserConfig } from 'vite';
import projectConfig from '../vite.config';
import { forceyDev } from './forcey-dev';

type ProjectConfig = UserConfig | ((env: ConfigEnv) => UserConfig | Promise<UserConfig>);

export default defineConfig(async (env) => {
  const config = projectConfig as ProjectConfig;
  const base = typeof config === 'function' ? await config(env) : config;
  return mergeConfig(base, { plugins: [forceyDev()] });
});
