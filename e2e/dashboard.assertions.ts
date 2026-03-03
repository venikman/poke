import { expect, type Page } from '@playwright/test';

const getFirstRowName = async (page: Page): Promise<string> => {
  const firstCell = page.getByTestId('user-row').first().locator('td').first();
  return (await firstCell.innerText()).trim();
};

export const expectDashboardBehavior = async (page: Page): Promise<void> => {
  await expect(page.getByRole('heading', { name: 'User Dashboard' })).toBeVisible();
  await expect(page.getByTestId('users-dashboard')).toBeVisible();
  await expect(page.getByTestId('users-table')).toBeVisible();

  const table = page.getByTestId('users-table');
  await expect(table.getByRole('columnheader', { name: 'Name' })).toBeVisible();
  await expect(table.getByRole('columnheader', { name: 'Email' })).toBeVisible();
  await expect(table.getByRole('columnheader', { name: 'Role' })).toBeVisible();
  await expect(table.getByRole('columnheader', { name: 'Status' })).toBeVisible();
  await expect(table.getByRole('columnheader', { name: 'Last Active' })).toBeVisible();

  await expect(page.getByTestId('user-row')).toHaveCount(5);
  await expect
    .poll(async () => getFirstRowName(page), {
      message: 'Expected default first row on page 1 before sorting.',
    })
    .toBe('Logan Reese');

  const sortByName = page.getByTestId('sort-name');
  await sortByName.click();
  await expect
    .poll(async () => getFirstRowName(page), {
      message: 'Expected first row to become ascending after first Name sort click.',
    })
    .toBe('Avery Cole');

  await sortByName.click();
  await expect
    .poll(async () => getFirstRowName(page), {
      message: 'Expected first row to become descending after second Name sort click.',
    })
    .toBe('Logan Reese');

  const pagination = page.getByTestId('users-pagination');
  await expect(pagination).toBeVisible();

  await pagination.getByRole('button', { name: '2' }).click();
  await expect
    .poll(async () => getFirstRowName(page), {
      message: 'Expected page 2 to render next chunk of rows.',
    })
    .toBe('Gray Kim');

  await pagination.getByRole('combobox').click();
  await page.getByRole('option', { name: '10' }).click();
  await expect(page.getByTestId('user-row')).toHaveCount(10);
  await expect
    .poll(async () => getFirstRowName(page), {
      message: 'Expected rows-per-page change to reset back to page 1.',
    })
    .toBe('Logan Reese');
};
