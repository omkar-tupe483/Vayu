import React from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { Language } from '../../contexts/languageTypes';

export const LanguageSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage, languages, t } = useTranslation();

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <label htmlFor="language-selector" className="sr-only">
        {t('nav.selectLanguage')}
      </label>
      <Globe className="w-4 h-4 text-vayu-text-secondary absolute left-2.5 pointer-events-none" aria-hidden="true" />
      <select
        id="language-selector"
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="pl-8 pr-3 py-1.5 rounded-2xl bg-vayu-surface border border-vayu-border text-xs font-bold text-vayu-text focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring cursor-pointer hover:border-vayu-primary transition-all"
        aria-label={t('nav.selectLanguage')}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-vayu-surface text-vayu-text">
            {lang.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
};

