import { render as baseRender } from '@rstest/browser-react';
import type { ReactElement } from 'react';
import CustomThemeProvider from '../../../app/components/CustomThemeProvider';

export const renderWithTheme = (ui: ReactElement) =>
  baseRender(<CustomThemeProvider>{ui}</CustomThemeProvider>);
