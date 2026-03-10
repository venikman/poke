import { defineConfig } from '@rstest/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  globals: true,
  coverage: { provider: 'istanbul', reporters: ['text', 'html'] },
  projects: [
    {
      name: 'browser',
      globals: true,
      include: ['tests/browser/**/*.browser.test.tsx'],
      plugins: [pluginReact()],
      browser: {
        enabled: true,
        provider: 'playwright',
        browser: 'chromium',
        headless: process.env.CI === 'true',
      },
    },
    {
      name: 'api',
      globals: true,
      testEnvironment: 'node',
      include: ['tests/api/**/*.test.ts'],
    },
  ],
});
