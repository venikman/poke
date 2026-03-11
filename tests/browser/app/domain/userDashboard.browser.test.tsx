import {
  getDisplayUsers,
  getInitialSortState,
  getNextSortState,
  USERS,
  type UserSortState,
} from '../../../../app/domain/userDashboard';

const getFirstName = (state: UserSortState): string => getDisplayUsers(USERS, state)[0]?.name ?? '';

test('sort state cycles default -> name asc -> name desc', () => {
  const initial = getInitialSortState();
  expect(initial.kind).toBe('default');

  const next = getNextSortState(initial, 'name');
  expect(next).toEqual({ kind: 'sorted', key: 'name', order: 'asc' });

  const toggled = getNextSortState(next, 'name');
  expect(toggled).toEqual({ kind: 'sorted', key: 'name', order: 'desc' });
});

test('default display is descending by name and sorted states are deterministic', () => {
  const defaultState = getInitialSortState();
  expect(getFirstName(defaultState)).toBe('Logan Reese');

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
  expect(getFirstName(emailAscState)).toBe('Avery Cole');

  const roleAscState: UserSortState = { kind: 'sorted', key: 'role', order: 'asc' };
  expect(getFirstName(roleAscState)).toBe('Avery Cole');

  const lastActiveDescState: UserSortState = {
    kind: 'sorted',
    key: 'lastActive',
    order: 'desc',
  };
  expect(getFirstName(lastActiveDescState)).toBe('Avery Cole');
});
