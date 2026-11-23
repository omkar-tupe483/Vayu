import { createContext } from 'react';
import { ThemeContextType } from './themeTypes';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
