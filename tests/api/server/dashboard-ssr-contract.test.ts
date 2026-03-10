import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('dashboard content avoids the Availity wrapper imports that break static builds', () => {
  const source = readFileSync(
    resolve(process.cwd(), 'app/components/UserDashboardContent.tsx'),
    'utf8',
  );

  expect(source).not.toContain("@availity/element");
  expect(source).toContain("@mui/material/");
});
