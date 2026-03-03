import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@availity/element';
import { useState } from 'react';

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Invited' | 'Suspended';
  lastActive: string;
};

type SortKey = 'name' | 'email' | 'role' | 'lastActive';
type SortOrder = 'asc' | 'desc';

const USERS: UserRow[] = [
  {
    id: 'u-001',
    name: 'Avery Cole',
    email: 'avery.cole@example.com',
    role: 'Admin',
    status: 'Active',
    lastActive: '2026-03-01',
  },
  {
    id: 'u-002',
    name: 'Blake Jordan',
    email: 'blake.jordan@example.com',
    role: 'Manager',
    status: 'Invited',
    lastActive: '2026-02-28',
  },
  {
    id: 'u-003',
    name: 'Casey Rivera',
    email: 'casey.rivera@example.com',
    role: 'Support',
    status: 'Active',
    lastActive: '2026-02-27',
  },
  {
    id: 'u-004',
    name: 'Dakota Morgan',
    email: 'dakota.morgan@example.com',
    role: 'Viewer',
    status: 'Suspended',
    lastActive: '2026-02-26',
  },
  {
    id: 'u-005',
    name: 'Elliot Shah',
    email: 'elliot.shah@example.com',
    role: 'Editor',
    status: 'Active',
    lastActive: '2026-02-25',
  },
  {
    id: 'u-006',
    name: 'Finley Brooks',
    email: 'finley.brooks@example.com',
    role: 'Manager',
    status: 'Invited',
    lastActive: '2026-02-24',
  },
  {
    id: 'u-007',
    name: 'Gray Kim',
    email: 'gray.kim@example.com',
    role: 'Support',
    status: 'Active',
    lastActive: '2026-02-23',
  },
  {
    id: 'u-008',
    name: 'Harper Lane',
    email: 'harper.lane@example.com',
    role: 'Editor',
    status: 'Suspended',
    lastActive: '2026-02-22',
  },
  {
    id: 'u-009',
    name: 'Indigo Patel',
    email: 'indigo.patel@example.com',
    role: 'Viewer',
    status: 'Active',
    lastActive: '2026-02-21',
  },
  {
    id: 'u-010',
    name: 'Jules Carter',
    email: 'jules.carter@example.com',
    role: 'Admin',
    status: 'Invited',
    lastActive: '2026-02-20',
  },
  {
    id: 'u-011',
    name: 'Kai Bennett',
    email: 'kai.bennett@example.com',
    role: 'Support',
    status: 'Active',
    lastActive: '2026-02-19',
  },
  {
    id: 'u-012',
    name: 'Logan Reese',
    email: 'logan.reese@example.com',
    role: 'Viewer',
    status: 'Suspended',
    lastActive: '2026-02-18',
  },
];

export default function UserDashboardContent() {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const defaultUsers = [...USERS].sort((a, b) => b.name.localeCompare(a.name));
  const sortedUsers = sortKey
    ? [...USERS].sort((a, b) => a[sortKey].localeCompare(b[sortKey]))
    : defaultUsers;

  const displayUsers = sortKey && sortOrder === 'desc' ? [...sortedUsers].reverse() : sortedUsers;
  const visibleRows = displayUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleRowsPerPageChange = (nextRowsPerPage: number) => {
    setRowsPerPage(nextRowsPerPage);
    setPage(0);
  };

  const handleSortChange = (nextSortKey: SortKey) => {
    if (sortKey === nextSortKey) {
      setSortOrder((currentSortOrder) => (currentSortOrder === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortKey(nextSortKey);
    setSortOrder('asc');
    setPage(0);
  };

  return (
    <main>
      <Container data-testid="users-dashboard" sx={{ py: 6 }}>
        <Typography component="h1" sx={{ color: 'primary.main', mb: 1 }} variant="h2">
          User Dashboard
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 3 }}>
          Hardcoded users dataset with client-side sorting and pagination.
        </Typography>

        <TableContainer sx={{ border: 1, borderColor: 'primary.light', borderRadius: 2 }}>
          <Table aria-label="Users dashboard table" data-testid="users-table">
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'primary.contrastText' }}>
                  <TableSortLabel
                    active={sortKey === 'name'}
                    data-testid="sort-name"
                    direction={sortKey === 'name' ? sortOrder : 'asc'}
                    onClick={() => handleSortChange('name')}
                    sx={{ color: 'inherit', '&.Mui-active': { color: 'inherit' } }}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>
                  <TableSortLabel
                    active={sortKey === 'email'}
                    data-testid="sort-email"
                    direction={sortKey === 'email' ? sortOrder : 'asc'}
                    onClick={() => handleSortChange('email')}
                    sx={{ color: 'inherit', '&.Mui-active': { color: 'inherit' } }}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>
                  <TableSortLabel
                    active={sortKey === 'role'}
                    data-testid="sort-role"
                    direction={sortKey === 'role' ? sortOrder : 'asc'}
                    onClick={() => handleSortChange('role')}
                    sx={{ color: 'inherit', '&.Mui-active': { color: 'inherit' } }}
                  >
                    Role
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>Status</TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>
                  <TableSortLabel
                    active={sortKey === 'lastActive'}
                    data-testid="sort-lastActive"
                    direction={sortKey === 'lastActive' ? sortOrder : 'asc'}
                    onClick={() => handleSortChange('lastActive')}
                    sx={{ color: 'inherit', '&.Mui-active': { color: 'inherit' } }}
                  >
                    Last Active
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((user) => (
                <TableRow data-testid="user-row" key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={5}
                  count={displayUsers.length}
                  data-testid="users-pagination"
                  onPageChange={(_, nextPage) => setPage(nextPage)}
                  onRowsPerPageChange={(event) =>
                    handleRowsPerPageChange(Number(event.target.value))
                  }
                  page={page}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Container>
    </main>
  );
}
