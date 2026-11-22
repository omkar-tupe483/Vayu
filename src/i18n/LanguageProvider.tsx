import React, { useState, useEffect, ReactNode, useMemo } from 'react';
import { Language, SUPPORTED_LANGUAGES } from './types';
import { LanguageContext } from './context';
import { enTranslations } from './translations/en';
import { hiTranslations } from './translations/hi';
import { mrTranslations } from './translations/mr';

const STORAGE_KEY = 'vayu_lang';

const translationsMap: Record<Language, Record<string, string>> = {
  en: enTranslations,
  hi: hiTranslations,
  mr: mrTranslations,
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'hi' || stored === 'mr') {
        return stored;
      }
    } catch {
      // LocalStorage might be disabled
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useMemo(() => {
    return (key: string, params?: Record<string, string | number>): string => {
      const currentDict = translationsMap[language];
      const enDict = translationsMap.en;

      let value = currentDict[key] ?? enDict[key] ?? key;

      if (params) {
        for (const [paramKey, paramVal] of Object.entries(params)) {
          value = value.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
        }
      }

      return value;
    };
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        languages: SUPPORTED_LANGUAGES,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

