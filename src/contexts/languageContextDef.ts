import { createContext } from 'react';
import { LanguageContextType } from './languageTypes';

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

