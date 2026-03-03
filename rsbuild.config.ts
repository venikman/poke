import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginReactRouter } from 'rsbuild-plugin-react-router';
import { getApiProxyTarget } from './config/devPorts.js';

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
        target: getApiProxyTarget(),
        changeOrigin: true,
      },
    },
  },
});
