import { createContext } from 'react';
import { Language, LanguageOption } from './types';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  languages: readonly LanguageOption[];
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

