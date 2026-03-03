type Env = Record<string, string | undefined>;

const DEFAULT_API_PORT = '3001';
const DEFAULT_E2E_API_PORT = '3301';

export const getApiPort = (env: Env = process.env): string => env.API_PORT ?? DEFAULT_API_PORT;

export const getApiProxyTarget = (env: Env = process.env): string =>
  `http://localhost:${getApiPort(env)}`;

export const getE2EApiPort = (env: Env = process.env): string =>
  env.E2E_API_PORT ?? DEFAULT_E2E_API_PORT;
