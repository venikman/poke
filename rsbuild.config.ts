import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginReactRouter } from 'rsbuild-plugin-react-router';

const apiPort = process.env.API_PORT ?? '3001';

export default defineConfig({
  plugins: [pluginReactRouter(), pluginReact()],
  html: {
    scriptLoading: 'module',
  },
  tools: {
    rspack: {
      resolve: {
        alias: {
          'supports-color': false,
        },
      },
    },
  },
  server: {
    port: 5173,
    historyApiFallback: {
      index: '/entry.client.html',
    },
    proxy: {
      '/api': {
        target: `http://localhost:${apiPort}`,
        changeOrigin: true,
      },
    },
  },
});
