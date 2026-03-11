import {
  getDisplayUsers,
  getInitialSortState,
  getNextSortState,
  USERS,
  UserId,
  type UserRow,
  type UserSortState,
} from '../../../../app/domain/userDashboard';

const getFirstName = (
  state: UserSortState,
  users: ReadonlyArray<UserRow> = USERS,
): string => getDisplayUsers(users, state)[0]?.name ?? '';

const SORT_FIXTURE: ReadonlyArray<UserRow> = [
  {
    id: UserId('fixture-1'),
    name: 'Mira Hart',
    email: 'zeta@example.com',
    role: 'Viewer',
    status: 'Active',
    lastActive: '2026-03-02',
  },
  {
    id: UserId('fixture-2'),
    name: 'Asha Bell',
    email: 'beta@example.com',
    role: 'Support',
    status: 'Invited',
    lastActive: '2026-03-04',
  },
  {
    id: UserId('fixture-3'),
    name: 'Zane Cole',
    email: 'alpha@example.com',
    role: 'Admin',
    status: 'Suspended',
    lastActive: '2026-03-01',
  },
  {
    id: UserId('fixture-4'),
    name: 'Bryn Dale',
    email: 'gamma@example.com',
    role: 'Editor',
    status: 'Active',
    lastActive: '2026-03-03',
  },
];

test('initial sort state is name descending and toggles on repeated clicks', () => {
  const initial = getInitialSortState();
  expect(initial).toEqual({ kind: 'sorted', key: 'name', order: 'desc' });

  const next = getNextSortState(initial, 'name');
  expect(next).toEqual({ kind: 'sorted', key: 'name', order: 'asc' });

  const toggled = getNextSortState(next, 'name');
  expect(toggled).toEqual({ kind: 'sorted', key: 'name', order: 'desc' });
});

test('default display preserves the provided order while sorted states remain deterministic', () => {
  const defaultState: UserSortState = { kind: 'default' };
  expect(getDisplayUsers(SORT_FIXTURE, defaultState).map((user) => user.name)).toEqual([
    'Mira Hart',
    'Asha Bell',
    'Zane Cole',
    'Bryn Dale',
  ]);

  const initialState = getInitialSortState();
  expect(getFirstName(initialState)).toBe('Logan Reese');

  const nameAscState: UserSortState = { kind: 'sorted', key: 'name', order: 'asc' };
  expect(getFirstName(nameAscState)).toBe('Avery Cole');

  const nameDescState: UserSortState = { kind: 'sorted', key: 'name', order: 'desc' };
  expect(getFirstName(nameDescState)).toBe('Logan Reese');
});

test('switching sort keys resets the order to ascending', () => {
  const initial = getInitialSortState();
  const nameAsc = getNextSortState(initial, 'name');
  const nameDesc = getNextSortState(nameAsc, 'name');
  const emailAsc = getNextSortState(nameDesc, 'email');

  expect(nameDesc).toEqual({ kind: 'sorted', key: 'name', order: 'desc' });
  expect(emailAsc).toEqual({ kind: 'sorted', key: 'email', order: 'asc' });
});

test('display sorting covers non-name keys', () => {
  const emailAscState: UserSortState = { kind: 'sorted', key: 'email', order: 'asc' };
  expect(getDisplayUsers(SORT_FIXTURE, emailAscState).map((user) => user.email)).toEqual([
    'alpha@example.com',
    'beta@example.com',
    'gamma@example.com',
    'zeta@example.com',
  ]);

  const roleAscState: UserSortState = { kind: 'sorted', key: 'role', order: 'asc' };
  expect(getDisplayUsers(SORT_FIXTURE, roleAscState).map((user) => user.role)).toEqual([
    'Admin',
    'Editor',
    'Support',
    'Viewer',
  ]);

  const lastActiveDescState: UserSortState = {
    kind: 'sorted',
    key: 'lastActive',
    order: 'desc',
  };
  expect(getDisplayUsers(SORT_FIXTURE, lastActiveDescState).map((user) => user.lastActive)).toEqual(
    ['2026-03-04', '2026-03-03', '2026-03-02', '2026-03-01'],
  );
});
