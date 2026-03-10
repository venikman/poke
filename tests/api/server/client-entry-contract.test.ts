import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('client entry bootstraps the browser app from the rsbuild root shell', () => {
  const sourcePath = resolve(process.cwd(), 'app/entry.client.tsx');
  const source = readFileSync(sourcePath, 'utf8');

  expect(source).toContain('createBrowserRouter');
  expect(source).toContain('RouterProvider');
  expect(source).toContain("getElementById('root')");
});
