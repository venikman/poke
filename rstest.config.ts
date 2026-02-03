import path from 'node:path';
import { defineConfig } from '@rstest/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  globals: true,
  coverage: { provider: 'istanbul', reporters: ['text', 'html'] },
  projects: [
    {
      name: 'browser',
      globals: true,
      include: ['src/**/*.browser.test.tsx'],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
          '@shared': path.resolve(__dirname, 'shared'),
          '@api': path.resolve(__dirname, 'api'),
        },
      },
      plugins: [pluginReact()],
      browser: {
        enabled: true,
        provider: 'playwright',
        browser: 'chromium',
        headless: process.env.CI === 'true',
      },
    },
    {
      name: 'node',
      globals: true,
      testEnvironment: 'node',
      include: ['api/lambda/*.test.ts'],
    },
  ],
});
