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
