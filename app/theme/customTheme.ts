import { lightTheme as lightThemeOptions } from '@availity/theme';
import { createTheme, type ThemeOptions } from '@mui/material/styles';

const customThemeOverrides: ThemeOptions = {
  palette: {
    primary: {
      main: '#5EA908',
      light: '#7EC536',
      dark: '#4A8506',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00A3E0',
      light: '#5AC4EA',
      dark: '#007AA8',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F4F9EE',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1C2A12',
      secondary: '#3F5A2B',
    },
  },
  typography: {
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
  },
};

export const customTheme = createTheme(
  lightThemeOptions as ThemeOptions,
  customThemeOverrides as ThemeOptions,
);
