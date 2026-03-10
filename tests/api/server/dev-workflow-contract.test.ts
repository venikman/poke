import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('dev workflow uses direct frontend and api startup', () => {
  const packageJson = readFileSync(resolve(process.cwd(), 'package.json'), 'utf8');
  const playwrightConfig = readFileSync(resolve(process.cwd(), 'playwright.config.ts'), 'utf8');
  const rsbuildConfig = readFileSync(resolve(process.cwd(), 'rsbuild.config.ts'), 'utf8');

  expect(packageJson).toContain('"dev": "PORT=3001 tsx --watch server/main.ts &');
  expect(packageJson).toContain("trap 'kill $api 2>/dev/null' EXIT INT TERM; rsbuild dev");
  expect(packageJson).not.toContain('dotnet run --project');
  expect(packageJson).not.toContain('AppHost');
  expect(playwrightConfig).toContain('command: \'npx rsbuild dev\'');
  expect(playwrightConfig).toContain('command: \'PORT=3001 npx tsx --watch server/main.ts\'');
  expect(playwrightConfig).not.toContain("command: 'npm run dev'");
  expect(rsbuildConfig).toContain('strictPort: true');
});
