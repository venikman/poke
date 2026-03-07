declare const brandSymbol: unique symbol;

type Brand<TValue, TTag extends string> = TValue & { readonly [brandSymbol]: TTag };

export type UserId = Brand<string, 'UserId'>;
export type UserRole = 'Admin' | 'Manager' | 'Support' | 'Viewer' | 'Editor';
export type UserStatus = 'Active' | 'Invited' | 'Suspended';

export type UserRow = {
  readonly id: UserId;
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
  readonly status: UserStatus;
  readonly lastActive: string;
};

export type UserSortKey = 'name' | 'email' | 'role' | 'lastActive';
export type SortOrder = 'asc' | 'desc';

export type UserSortState =
  | { readonly kind: 'default' }
  | {
      readonly kind: 'sorted';
      readonly key: UserSortKey;
      readonly order: SortOrder;
    };

export const UserId = (value: string): UserId => value as UserId;

const userRow = (
  id: string,
  name: string,
  email: string,
  role: UserRole,
  status: UserStatus,
  lastActive: string,
): UserRow => ({
  id: UserId(id),
  name,
  email,
  role,
  status,
  lastActive,
});

export const USERS: ReadonlyArray<UserRow> = [
  userRow('u-001', 'Avery Cole', 'avery.cole@example.com', 'Admin', 'Active', '2026-03-01'),
  userRow('u-002', 'Blake Jordan', 'blake.jordan@example.com', 'Manager', 'Invited', '2026-02-28'),
  userRow('u-003', 'Casey Rivera', 'casey.rivera@example.com', 'Support', 'Active', '2026-02-27'),
  userRow(
    'u-004',
    'Dakota Morgan',
    'dakota.morgan@example.com',
    'Viewer',
    'Suspended',
    '2026-02-26',
  ),
  userRow('u-005', 'Elliot Shah', 'elliot.shah@example.com', 'Editor', 'Active', '2026-02-25'),
  userRow(
    'u-006',
    'Finley Brooks',
    'finley.brooks@example.com',
    'Manager',
    'Invited',
    '2026-02-24',
  ),
  userRow('u-007', 'Gray Kim', 'gray.kim@example.com', 'Support', 'Active', '2026-02-23'),
  userRow('u-008', 'Harper Lane', 'harper.lane@example.com', 'Editor', 'Suspended', '2026-02-22'),
  userRow('u-009', 'Indigo Patel', 'indigo.patel@example.com', 'Viewer', 'Active', '2026-02-21'),
  userRow('u-010', 'Jules Carter', 'jules.carter@example.com', 'Admin', 'Invited', '2026-02-20'),
  userRow('u-011', 'Kai Bennett', 'kai.bennett@example.com', 'Support', 'Active', '2026-02-19'),
  userRow('u-012', 'Logan Reese', 'logan.reese@example.com', 'Viewer', 'Suspended', '2026-02-18'),
];

export const getInitialSortState = (): UserSortState => ({ kind: 'default' });

export const getNextSortState = (
  current: UserSortState,
  nextSortKey: UserSortKey,
): UserSortState => {
  if (current.kind === 'sorted' && current.key === nextSortKey) {
    return { kind: 'sorted', key: current.key, order: current.order === 'asc' ? 'desc' : 'asc' };
  }

  return { kind: 'sorted', key: nextSortKey, order: 'asc' };
};

const sortByNameDesc = (users: ReadonlyArray<UserRow>): ReadonlyArray<UserRow> =>
  [...users].sort((left, right) => right.name.localeCompare(left.name));

const sortByKeyAsc = (users: ReadonlyArray<UserRow>, key: UserSortKey): ReadonlyArray<UserRow> =>
  [...users].sort((left, right) => left[key].localeCompare(right[key]));

export const getDisplayUsers = (
  users: ReadonlyArray<UserRow>,
  state: UserSortState,
): ReadonlyArray<UserRow> => {
  switch (state.kind) {
    case 'default':
      return sortByNameDesc(users);
    case 'sorted': {
      const sorted = sortByKeyAsc(users, state.key);
      return state.order === 'desc' ? [...sorted].reverse() : sorted;
    }
    default:
      throw new Error(`Unhandled sort state: ${state satisfies never}`);
  }
};
