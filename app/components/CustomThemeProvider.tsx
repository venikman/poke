import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { customTheme } from '../theme/customTheme';

type CustomThemeProviderProps = {
  children: ReactNode;
};

export default function CustomThemeProvider({ children }: CustomThemeProviderProps) {
  return (
    <MuiThemeProvider theme={customTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
