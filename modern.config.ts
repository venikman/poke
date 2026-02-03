import { defineConfig, appTools } from '@modern-js/app-tools';
import { bffPlugin } from '@modern-js/plugin-bff';

export default defineConfig({
  server: {
    ssr: true,
  },
  output: {
    distPath: { root: 'dist' },
  },
  source: {
    alias: {
      '@': './src',
      '@shared': './shared',
      '@api': './api',
    },
  },
  bff: { prefix: '/api/v1/chat' },
  plugins: [appTools(), bffPlugin()],
});
