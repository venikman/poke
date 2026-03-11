import { renderWithTheme as render } from '../../support/renderWithTheme';
import Page from '../../../../app/routes/home';

const getRows = () => Array.from(document.querySelectorAll('[data-testid="user-row"]'));

const getFirstRowName = () => {
  const firstCell = getRows()[0]?.querySelector('td');
  return firstCell?.textContent?.trim() ?? '';
};

const waitForValue = <T,>(
  getValue: () => T,
  isReady: (value: T) => boolean,
  getErrorMessage: (value: T) => string,
  timeout = 3000,
): Promise<T> =>
  new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      const value = getValue();

      if (isReady(value)) {
        resolve(value);
      } else if (Date.now() - start > timeout) {
        reject(new Error(getErrorMessage(value)));
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  });

const waitForFirstRowName = (expected: string, timeout = 3000): Promise<void> =>
  waitForValue(
    getFirstRowName,
    (name) => name === expected,
    (name) => `Expected first row name "${expected}", got "${name}"`,
    timeout,
  ).then(() => undefined);

const waitForRowCount = (expected: number, timeout = 3000): Promise<void> =>
  waitForValue(
    () => getRows().length,
    (rowCount) => rowCount === expected,
    (rowCount) => `Expected row count "${expected}", got "${rowCount}"`,
    timeout,
  ).then(() => undefined);

const waitForOption = (label: string, timeout = 3000): Promise<HTMLElement> =>
  waitForValue(
    () =>
      Array.from(document.querySelectorAll<HTMLElement>('[role="option"]')).find(
        (node) => node.textContent?.trim() === label,
      ),
    (option): option is HTMLElement => option !== undefined,
    () => `Expected option "${label}" to be present.`,
    timeout,
  ).then((option) => option as HTMLElement);

const waitForDashboardMount = (timeout = 3000): Promise<void> =>
  waitForValue(
    () => document.querySelector('[data-testid="users-table"]'),
    (table): table is Element => table !== null,
    () => 'Expected dashboard table to mount.',
    timeout,
  ).then(() => undefined);

const getPaginationButton = (testId: string): HTMLButtonElement | null =>
  document.querySelector(`[data-testid="${testId}"]`) as HTMLButtonElement | null;

test('renders dashboard table immediately on first render', async () => {
  await render(<Page />);

  expect(document.querySelector('[data-testid="users-dashboard"]')).not.toBeNull();
  expect(document.querySelector('[data-testid="users-table"]')).not.toBeNull();
});

test('renders dashboard title and subtitle', async () => {
  await render(<Page />);
  const pageText = document.body.textContent ?? '';
  expect(pageText).toContain('User Dashboard');
  expect(pageText).toContain('Hardcoded users dataset with client-side sorting and pagination.');
});

test('applies custom theme primary color to dashboard title', async () => {
  await render(<Page />);
  await waitForDashboardMount();

  const title = document.querySelector('h1');
  expect(title).not.toBeNull();
  expect(getComputedStyle(title as HTMLElement).color).toBe('rgb(94, 169, 8)');
});

test('does not rely on a delayed dashboard module mount', async () => {
  await render(<Page />);

  expect(document.querySelector('[data-testid="users-table"]')).not.toBeNull();
});

test('renders users dashboard table shell', async () => {
  await render(<Page />);
  await waitForDashboardMount();

  expect(document.querySelector('[data-testid="users-dashboard"]')).not.toBeNull();
  expect(document.querySelector('[data-testid="users-table"]')).not.toBeNull();
});

test('renders expected table headers', async () => {
  await render(<Page />);
  await waitForDashboardMount();

  const pageText = document.body.textContent ?? '';
  expect(pageText).toContain('Name');
  expect(pageText).toContain('Email');
  expect(pageText).toContain('Role');
  expect(pageText).toContain('Status');
  expect(pageText).toContain('Last Active');
});

test('renders first page with 5 rows by default', async () => {
  await render(<Page />);
  await waitForDashboardMount();

  const rows = document.querySelectorAll('[data-testid="user-row"]');
  expect(rows.length).toBe(5);
});

test('sorts by name ascending on first click', async () => {
  await render(<Page />);
  await waitForDashboardMount();

  const firstRowBefore = getFirstRowName();
  const sortName = document.querySelector('[data-testid="sort-name"]') as HTMLButtonElement | null;

  expect(sortName).not.toBeNull();
  sortName?.click();

  await waitForFirstRowName('Avery Cole');
  const firstRowAfter = getFirstRowName();

  expect(firstRowAfter).toBe('Avery Cole');
  expect(firstRowAfter).not.toBe(firstRowBefore);
});

test('sorts by name descending on second click', async () => {
  await render(<Page />);
  await waitForDashboardMount();

  const sortName = document.querySelector('[data-testid="sort-name"]') as HTMLButtonElement | null;

  expect(sortName).not.toBeNull();
  sortName?.click();
  await waitForFirstRowName('Avery Cole');

  sortName?.click();
  await waitForFirstRowName('Logan Reese');
  expect(getFirstRowName()).toBe('Logan Reese');
});

test('exposes aria-sort on the active header cell', async () => {
  await render(<Page />);
  await waitForDashboardMount();

  const sortName = document.querySelector('[data-testid="sort-name"]') as HTMLButtonElement | null;
  const nameHeader = sortName?.closest('th');

  expect(sortName).not.toBeNull();
  expect(nameHeader?.getAttribute('aria-sort')).toBe('descending');

  sortName?.click();
  await waitForFirstRowName('Avery Cole');
  expect(nameHeader?.getAttribute('aria-sort')).toBe('ascending');

  sortName?.click();
  await waitForFirstRowName('Logan Reese');
  expect(nameHeader?.getAttribute('aria-sort')).toBe('descending');
});

test('navigates to page 2 and shows next rows', async () => {
  await render(<Page />);
  await waitForDashboardMount();

  const nextPageButton = getPaginationButton('users-pagination-next');

  expect(nextPageButton).not.toBeNull();
  nextPageButton?.click();

  await waitForFirstRowName('Gray Kim');
  expect(getFirstRowName()).toBe('Gray Kim');
});

test('keeps the current page when toggling sort direction on the same column', async () => {
  await render(<Page />);
  await waitForDashboardMount();

  const sortName = document.querySelector('[data-testid="sort-name"]') as HTMLButtonElement | null;

  expect(sortName).not.toBeNull();
  sortName?.click();
  await waitForFirstRowName('Avery Cole');

  const nextPageButton = getPaginationButton('users-pagination-next');
  expect(nextPageButton).not.toBeNull();
  nextPageButton?.click();
  await waitForFirstRowName('Finley Brooks');

  sortName?.click();
  await waitForFirstRowName('Gray Kim');
  expect(getFirstRowName()).toBe('Gray Kim');
});

test('resets to the first page when changing the sort key', async () => {
  await render(<Page />);
  await waitForDashboardMount();

  const sortName = document.querySelector('[data-testid="sort-name"]') as HTMLButtonElement | null;
  const sortEmail = document.querySelector('[data-testid="sort-email"]') as HTMLButtonElement | null;

  expect(sortName).not.toBeNull();
  expect(sortEmail).not.toBeNull();
  sortName?.click();
  await waitForFirstRowName('Avery Cole');

  const nextPageButton = getPaginationButton('users-pagination-next');
  expect(nextPageButton).not.toBeNull();
  nextPageButton?.click();
  await waitForFirstRowName('Finley Brooks');

  sortEmail?.click();
  await waitForFirstRowName('Avery Cole');
  expect(getFirstRowName()).toBe('Avery Cole');
});

test('changes rows per page to 10 and resets to first page', async () => {
  await render(<Page />);
  await waitForDashboardMount();

  const pagination = document.querySelector('[data-testid="users-pagination"]');
  expect(pagination).not.toBeNull();

  const nextPageButton = getPaginationButton('users-pagination-next');
  expect(nextPageButton).not.toBeNull();
  nextPageButton?.click();
  await waitForFirstRowName('Gray Kim');

  const rowsPerPageCombobox = pagination?.querySelector('[role="combobox"]') as HTMLElement | null;
  expect(rowsPerPageCombobox).not.toBeNull();
  rowsPerPageCombobox?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

  const optionTen = await waitForOption('10');
  optionTen.click();

  await waitForRowCount(10);
  await waitForFirstRowName('Logan Reese');
  expect(getFirstRowName()).toBe('Logan Reese');
});
