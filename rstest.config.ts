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
          '@': path.resolve(import.meta.dirname, 'src'),
          '@shared': path.resolve(import.meta.dirname, 'shared'),
          '@server': path.resolve(import.meta.dirname, 'server'),
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
      include: ['server/**/*.test.ts'],
    },
  ],
});
