import { expect, type Locator, type Page } from '@playwright/test';

type ExpectedRow = {
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly status: string;
  readonly lastActive: string;
};

const FIRST_PAGE_ROWS: ReadonlyArray<ExpectedRow> = [
  {
    name: 'Logan Reese',
    email: 'logan.reese@example.com',
    role: 'Viewer',
    status: 'Suspended',
    lastActive: '2026-02-18',
  },
  {
    name: 'Kai Bennett',
    email: 'kai.bennett@example.com',
    role: 'Support',
    status: 'Active',
    lastActive: '2026-02-19',
  },
  {
    name: 'Jules Carter',
    email: 'jules.carter@example.com',
    role: 'Admin',
    status: 'Invited',
    lastActive: '2026-02-20',
  },
  {
    name: 'Indigo Patel',
    email: 'indigo.patel@example.com',
    role: 'Viewer',
    status: 'Active',
    lastActive: '2026-02-21',
  },
  {
    name: 'Harper Lane',
    email: 'harper.lane@example.com',
    role: 'Editor',
    status: 'Suspended',
    lastActive: '2026-02-22',
  },
];

const expectRowValues = async (row: Locator, expected: ExpectedRow): Promise<void> => {
  await expect(row.locator('td')).toHaveText([
    expected.name,
    expected.email,
    expected.role,
    expected.status,
    expected.lastActive,
  ]);
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

  const rows = page.getByTestId('user-row');
  await expect(rows).toHaveCount(FIRST_PAGE_ROWS.length);

  for (const [index, expectedRow] of FIRST_PAGE_ROWS.entries()) {
    await expectRowValues(rows.nth(index), expectedRow);
  }
};
