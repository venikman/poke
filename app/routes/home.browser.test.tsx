import { renderWithTheme as render } from '../test/renderWithTheme';
import Page from './home';

const getRows = () => Array.from(document.querySelectorAll('[data-testid="user-row"]'));

const getFirstRowName = () => {
  const firstCell = getRows()[0]?.querySelector('td');
  return firstCell?.textContent?.trim() ?? '';
};

const waitForFirstRowName = (expected: string, timeout = 3000): Promise<void> =>
  new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (getFirstRowName() === expected) {
        resolve();
      } else if (Date.now() - start > timeout) {
        reject(new Error(`Expected first row name "${expected}", got "${getFirstRowName()}"`));
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  });

const waitForRowCount = (expected: number, timeout = 3000): Promise<void> =>
  new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (getRows().length === expected) {
        resolve();
      } else if (Date.now() - start > timeout) {
        reject(new Error(`Expected row count "${expected}", got "${getRows().length}"`));
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  });

const waitForOption = (label: string, timeout = 3000): Promise<HTMLElement> =>
  new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      const option = Array.from(document.querySelectorAll('[role="option"]')).find(
        (node) => node.textContent?.trim() === label,
      ) as HTMLElement | undefined;

      if (option) {
        resolve(option);
      } else if (Date.now() - start > timeout) {
        reject(new Error(`Expected option "${label}" to be present.`));
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  });

const waitForDashboardMount = (timeout = 3000): Promise<void> =>
  new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (document.querySelector('[data-testid="users-table"]')) {
        resolve();
      } else if (Date.now() - start > timeout) {
        reject(new Error('Expected dashboard table to mount.'));
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
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

test('loads dashboard table after dashboard module resolves', async () => {
  await render(<Page />);
  const pageText = document.body.textContent ?? '';
  expect(pageText).toContain('User Dashboard');
  await waitForDashboardMount();
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

test('navigates to page 2 and shows next rows', async () => {
  await render(<Page />);
  await waitForDashboardMount();

  const pagination = document.querySelector('[data-testid="users-pagination"]');
  expect(pagination).not.toBeNull();

  const pageTwoButton = Array.from(pagination?.querySelectorAll('button') ?? []).find(
    (button) => button.textContent?.trim() === '2',
  ) as HTMLButtonElement | undefined;

  expect(pageTwoButton).not.toBeUndefined();
  pageTwoButton?.click();

  await waitForFirstRowName('Gray Kim');
  expect(getFirstRowName()).toBe('Gray Kim');
});

test('changes rows per page to 10 and resets to first page', async () => {
  await render(<Page />);
  await waitForDashboardMount();

  const pagination = document.querySelector('[data-testid="users-pagination"]');
  expect(pagination).not.toBeNull();

  const pageTwoButton = Array.from(pagination?.querySelectorAll('button') ?? []).find(
    (button) => button.textContent?.trim() === '2',
  ) as HTMLButtonElement | undefined;
  expect(pageTwoButton).not.toBeUndefined();
  pageTwoButton?.click();
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
