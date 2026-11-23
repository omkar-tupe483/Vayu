import React, { useState, useEffect, useMemo } from 'react';
import { Language, SUPPORTED_LANGUAGES } from './languageTypes';
import { LanguageContext } from './languageContextDef';
import enLocale from '../locales/en.json';
import hiLocale from '../locales/hi.json';
import mrLocale from '../locales/mr.json';

const STORAGE_KEY = 'vayu_language';

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return typeof current === 'string' ? current : undefined;
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'hi' || stored === 'mr') {
        return stored;
      }
      if (typeof navigator !== 'undefined' && navigator.language) {
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('mr')) return 'mr';
        if (browserLang.startsWith('hi')) return 'hi';
      }
    } catch {
      // Fallback
    }
    return 'en';
  });

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const translations = useMemo(() => {
    switch (language) {
      case 'hi':
        return hiLocale;
      case 'mr':
        return mrLocale;
      case 'en':
      default:
        return enLocale;
    }
  }, [language]);

  const t = useMemo(() => {
    return (key: string, params?: Record<string, string | number>): string => {
      let val = getNestedValue(translations as Record<string, unknown>, key);
      if (!val) {
        val = getNestedValue(enLocale as Record<string, unknown>, key);
      }
      if (!val) {
        return key;
      }

      if (params) {
        for (const [pKey, pVal] of Object.entries(params)) {
          val = val.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
        }
      }

      return val;
    };
  }, [translations]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages: SUPPORTED_LANGUAGES, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
