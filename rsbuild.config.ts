/**
 * Rsbuild is used in this repo by Rstest for bundling browser tests.
 *
 * Test-time Rsbuild config lives in `rstest.config.ts` (per-project plugins,
 * e.g. pluginReact(), resolve.alias). Edit that file to customize test bundling.
 *
 * This file is a reference. If you add a standalone Rsbuild app later, use:
 *
 *   import { defineConfig } from '@rsbuild/core';
 *   export default defineConfig({ ... });
 */
const config = {
  // Reserved for future standalone Rsbuild usage. Test bundling: see rstest.config.ts
};

export default config;
