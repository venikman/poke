import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 120_000,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
  webServer: [
    {
      command: 'npx rsbuild dev',
      url: 'http://localhost:5173',
      reuseExistingServer: process.env.CI !== 'true',
      timeout: 120_000,
    },
    {
      command: 'PORT=3001 npx tsx --watch server/main.ts',
      url: 'http://localhost:3001/api/v1/hello',
      reuseExistingServer: process.env.CI !== 'true',
      timeout: 120_000,
    },
  ],
});
