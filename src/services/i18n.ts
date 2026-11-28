import en from '../locales/en.json';
import hi from '../locales/hi.json';
import mr from '../locales/mr.json';

export type Language = 'en' | 'hi' | 'mr';

const locales: Record<Language, Record<string, unknown>> = {
  en,
  hi,
  mr,
};

export function getTranslation(lang: Language, path: string): string {
  const dict = locales[lang] || locales.en;
  const parts = path.split('.');
  let current: unknown = dict;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      // Fallback to English
      let fallback: unknown = locales.en;
      for (const p of parts) {
        if (fallback && typeof fallback === 'object' && p in (fallback as Record<string, unknown>)) {
          fallback = (fallback as Record<string, unknown>)[p];
        }
      }
      return typeof fallback === 'string' ? fallback : path;
    }
  }

  return typeof current === 'string' ? current : path;
}
