import { expect, test } from '@playwright/test';
import { expectDashboardBehavior } from './dashboard.assertions';

test('production mode serves dashboard view and hello api', async ({ page }) => {
  const response = await page.goto('/');

  expect(response?.status()).toBe(200);
  await expectDashboardBehavior(page);
  await expect(page.getByText('This page could not be found')).toHaveCount(0);

  const apiResponse = await page.request.get('/api/v1/hello');
  expect(apiResponse.status()).toBe(200);
  const payload = (await apiResponse.json()) as { message: string };
  expect(payload).toEqual({
    message: 'Hello World from RS Stack',
  });
});
