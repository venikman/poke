import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('CustomThemeProvider does not depend on date picker localization wrappers', () => {
  const source = readFileSync(
    resolve(process.cwd(), 'app/components/CustomThemeProvider.tsx'),
    'utf8',
  );

  expect(source).not.toContain('@mui/x-date-pickers');
  expect(source).not.toContain('LocalizationProvider');
  expect(source).not.toContain('AdapterDayjs');
});
