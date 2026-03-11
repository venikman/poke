import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('root exports a shared Layout shell for Root and HydrateFallback', () => {
  const source = readFileSync(resolve(process.cwd(), 'app/root.tsx'), 'utf8');
  const normalized = source.replace(/\s+/g, ' ');

  expect(source).toMatch(/export function Layout/);
  expect(source).toMatch(/export default function Root/);
  expect(source).toMatch(/export function HydrateFallback/);
  expect(normalized).toMatch(/export function HydrateFallback\(\) \{ return <UserDashboardContent \/>; \}/);
});

test('prod smoke script rejects early exits and uses a resilient root-shell match', () => {
  const source = readFileSync(resolve(process.cwd(), 'tests/e2e/prod-smoke.mjs'), 'utf8');

  expect(source).toContain(
    "reject(new Error(`npm run start exited early with code ${code ?? 'unknown'}.`));",
  );
  expect(source).toContain('if (!/<div\\b[^>]*\\bid=[\'"]root[\'"]/.test(rootHtml)) {');
});
