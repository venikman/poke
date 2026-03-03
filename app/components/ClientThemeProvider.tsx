import type { ReactNode } from 'react';
import CustomThemeProvider from './CustomThemeProvider';

type ClientThemeProviderProps = {
  children: ReactNode;
};

export default function ClientThemeProvider({ children }: ClientThemeProviderProps) {
  return <CustomThemeProvider>{children}</CustomThemeProvider>;
}
