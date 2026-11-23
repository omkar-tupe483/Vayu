import { useContext } from 'react';
import { LanguageContext } from './languageContextDef';
import { LanguageContextType } from './languageTypes';

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }
  return context;
};

