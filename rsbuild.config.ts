import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: { index: './src/main.tsx' },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@shared': path.resolve(import.meta.dirname, 'shared'),
      '@server': path.resolve(import.meta.dirname, 'server'),
    },
  },
  html: {
    template: './src/index.html',
  },
  output: {
    distPath: { root: 'dist' },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
