import { customTheme } from '../../../../app/theme/customTheme';

test('uses custom brand palette', () => {
  expect(customTheme.palette.primary.main).toBe('#5EA908');
  expect(customTheme.palette.primary.dark).toBe('#4A8506');
  expect(customTheme.palette.secondary.main).toBe('#00A3E0');
});
