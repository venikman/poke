import { defineConfig } from '@playwright/test';
import { getE2EApiPort } from './config/devPorts.js';

const e2eApiPort = getE2EApiPort();

export default defineConfig({
  testDir: './e2e',
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
