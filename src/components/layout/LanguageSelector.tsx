import React from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { Language } from '../../contexts/LanguageContext';
import { Globe } from 'lucide-react';

export interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { language, setLanguage, languages, t } = useTranslation();

  return (
    <div className={`relative inline-flex items-center gap-1.5 ${className}`}>
      <Globe className="w-4 h-4 text-vayu-primary shrink-0" aria-hidden="true" />
      <label htmlFor="language-selector" className="sr-only">
        {t('nav.selectLanguage')}
      </label>
      <select
        id="language-selector"
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-vayu-surface border border-vayu-border text-vayu-text text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-vayu-focus-ring cursor-pointer shadow-sm"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-vayu-surface text-vayu-text">
            {lang.nativeLabel} ({lang.label})
          </option>
        ))}
      </select>
    </div>
  );
};

