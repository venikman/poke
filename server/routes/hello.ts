import { Hono } from 'hono';

export interface HelloResponse {
  message: string;
}

export const helloRoutes = new Hono();

helloRoutes.get('/hello', (c) => {
  const payload: HelloResponse = { message: 'Hello World from RS Stack' };
  return c.json(payload);
});
