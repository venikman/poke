import { helloRoutes } from './hello.js';

test('GET /hello returns Hello World payload', async () => {
  const response = await helloRoutes.request('http://localhost/hello');

  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toContain('application/json');

  const body = (await response.json()) as { message: string };
  expect(body).toEqual({ message: 'Hello World from RS Stack' });
});
