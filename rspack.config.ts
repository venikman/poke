/**
 * Rspack is driven by Modern.js in this repo, not by this file.
 *
 * To customize Rspack for the app build, use `tools.rspack` in `modern.config.ts`:
 *
 *   export default defineConfig<'rspack'>({
 *     plugins: [appTools({ bundler: 'rspack' }), ...],
 *     tools: {
 *       rspack(config, { rspack }) {
 *         // e.g. config.plugins.push(new rspack.YourPlugin());
 *         return config;
 *       },
 *     },
 *   });
 *
 * This file exists as a reference and for tooling that expects an rspack config.
 */
const config: Record<string, unknown> = {};

export default config;
