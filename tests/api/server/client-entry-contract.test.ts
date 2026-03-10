import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('client entry hydrates the React Router document shell', () => {
  const sourcePath = resolve(process.cwd(), 'app/entry.client.tsx');
  const source = readFileSync(sourcePath, 'utf8');

  expect(source).toContain('HydratedRouter');
  expect(source).toContain("react-router/dom");
  expect(source).not.toContain("getElementById('root')");
});
