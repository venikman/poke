import Container from '@mui/material/Container';
import type { IconButtonProps } from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import {
  getDisplayUsers,
  getInitialSortState,
  getNextSortState,
  USERS,
  type UserSortKey,
  type UserSortState,
} from '../domain/userDashboard';

const paginationActionSlotProps = {
  nextButton: { 'data-testid': 'users-pagination-next' } as Partial<IconButtonProps>,
  previousButton: { 'data-testid': 'users-pagination-previous' } as Partial<IconButtonProps>,
};

export default function UserDashboardContent() {
  const [sortState, setSortState] = useState<UserSortState>(getInitialSortState);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const displayUsers = getDisplayUsers(USERS, sortState);
  const visibleRows = displayUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleRowsPerPageChange = (nextRowsPerPage: number) => {
    setRowsPerPage(nextRowsPerPage);
    setPage(0);
  };

  const handleSortChange = (nextSortKey: UserSortKey) => {
    const shouldResetPage = sortState.kind !== 'sorted' || sortState.key !== nextSortKey;

    setSortState((currentSortState) => getNextSortState(currentSortState, nextSortKey));
    if (shouldResetPage) {
      setPage(0);
    }
  };

  const isSortedBy = (key: UserSortKey): boolean =>
    sortState.kind === 'sorted' && sortState.key === key;

  const getSortDirection = (key: UserSortKey): 'asc' | 'desc' => {
    if (sortState.kind !== 'sorted' || sortState.key !== key) {
      return 'asc';
    }

    return sortState.order;
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

        <TableContainer
          component={Paper}
          sx={{ border: 1, borderColor: 'primary.light', borderRadius: 2 }}
        >
          <Table aria-label="Users dashboard table" data-testid="users-table">
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell
                  sortDirection={isSortedBy('name') ? getSortDirection('name') : false}
                  sx={{ color: 'primary.contrastText' }}
                >
                  <TableSortLabel
                    active={isSortedBy('name')}
                    data-testid="sort-name"
                    direction={getSortDirection('name')}
                    onClick={() => handleSortChange('name')}
                    sx={{ color: 'inherit', '&.Mui-active': { color: 'inherit' } }}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sortDirection={isSortedBy('email') ? getSortDirection('email') : false}
                  sx={{ color: 'primary.contrastText' }}
                >
                  <TableSortLabel
                    active={isSortedBy('email')}
                    data-testid="sort-email"
                    direction={getSortDirection('email')}
                    onClick={() => handleSortChange('email')}
                    sx={{ color: 'inherit', '&.Mui-active': { color: 'inherit' } }}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sortDirection={isSortedBy('role') ? getSortDirection('role') : false}
                  sx={{ color: 'primary.contrastText' }}
                >
                  <TableSortLabel
                    active={isSortedBy('role')}
                    data-testid="sort-role"
                    direction={getSortDirection('role')}
                    onClick={() => handleSortChange('role')}
                    sx={{ color: 'inherit', '&.Mui-active': { color: 'inherit' } }}
                  >
                    Role
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>Status</TableCell>
                <TableCell
                  sortDirection={isSortedBy('lastActive') ? getSortDirection('lastActive') : false}
                  sx={{ color: 'primary.contrastText' }}
                >
                  <TableSortLabel
                    active={isSortedBy('lastActive')}
                    data-testid="sort-lastActive"
                    direction={getSortDirection('lastActive')}
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
                  slotProps={{ actions: paginationActionSlotProps }}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Container>
    </main>
  );
}
