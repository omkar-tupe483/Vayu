import { useContext } from 'react';
import { ThemeContext } from './themeContextDef';
import { ThemeContextType } from './themeTypes';

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
