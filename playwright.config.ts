import { defineConfig } from '@playwright/test';

const e2eApiPort = process.env.E2E_API_PORT ?? '3301';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 120_000,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      NODE_ENV: 'development',
      API_PORT: e2eApiPort,
      PORT: e2eApiPort,
    },
  },
});
