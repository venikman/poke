import { expect, test } from '@playwright/test';
import { expectDashboardBehavior } from './dashboard.assertions';

test('dev mode starts frontend and api, then dashboard view is reachable', async ({ page }) => {
  const response = await page.goto('/');

  expect(response?.status()).toBe(200);
  await expectDashboardBehavior(page);
  await expect(page.getByText('This page could not be found')).toHaveCount(0);

  await expect
    .poll(async () => {
      const response = await page.request.get('/api/v1/hello');
      return response.status();
    })
    .toBe(200);

  const apiResponse = await page.request.get('/api/v1/hello');
  const payload = (await apiResponse.json()) as { message: string };
  expect(payload).toEqual({
    message: 'Hello World from RS Stack',
  });
});
