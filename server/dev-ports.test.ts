import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getApiPort, getApiProxyTarget, getE2EApiPort } from '../config/devPorts';

test('getApiProxyTarget uses API_PORT when provided', () => {
  expect(getApiProxyTarget({ API_PORT: '3301' })).toBe('http://localhost:3301');
});

test('getE2EApiPort defaults to dedicated port 3301', () => {
  expect(getE2EApiPort({})).toBe('3301');
});

test('playwright dev server config wires dedicated E2E API port into API_PORT and PORT env vars', () => {
  const configSource = readFileSync(resolve(process.cwd(), 'playwright.config.ts'), 'utf8');

  expect(configSource).toContain('const e2eApiPort = getE2EApiPort()');
  expect(configSource).toContain('API_PORT: e2eApiPort');
  expect(configSource).toContain('PORT: e2eApiPort');
  expect(getApiPort({ API_PORT: getE2EApiPort({ E2E_API_PORT: '3321' }) })).toBe('3321');
});

test('npm dev script sets default API_PORT/PORT to avoid 3001 collisions', () => {
  const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')) as {
    scripts?: Record<string, string>;
  };
  const devScript = packageJson.scripts?.dev ?? '';

  expect(devScript).toContain('API_PORT=$' + '{API_PORT:-3301}');
  expect(devScript).toContain('PORT=$' + '{API_PORT:-3301}');
});
