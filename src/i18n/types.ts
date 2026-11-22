export type Language = 'en' | 'hi' | 'mr';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: readonly LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
] as const;

export type TranslationDictionary = Record<string, string>;
