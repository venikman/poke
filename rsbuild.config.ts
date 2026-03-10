import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginReactRouter } from 'rsbuild-plugin-react-router';

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
    host: '127.0.0.1',
    historyApiFallback: {
      index: '/entry.client.html',
    },
    proxy: {
      '/api': 'http://127.0.0.1:3001',
    },
  },
});
