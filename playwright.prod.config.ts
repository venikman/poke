import { defineConfig } from '@playwright/test';

const PROD_PORT = 3101;

export default defineConfig({
  testDir: './e2e',
  timeout: 120_000,
  use: {
    baseURL: `http://localhost:${PROD_PORT}`,
    headless: true,
  },
  webServer: {
    command: 'npm run build && npm run start',
    url: `http://localhost:${PROD_PORT}`,
    reuseExistingServer: false,
    timeout: 180_000,
    env: {
      NODE_ENV: 'production',
      PORT: String(PROD_PORT),
      FORCE_COLOR: '0',
      NO_COLOR: '1',
    },
  },
});
