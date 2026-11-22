import React from 'react';
import { useTranslation } from '../i18n';
import { useTheme } from '../contexts/ThemeContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Sliders, Sun, Moon, Laptop, Globe, Eye } from 'lucide-react';
import { Language } from '../i18n/types';

export const SettingsPage: React.FC = () => {
  const { t, language, setLanguage, languages } = useTranslation();
  const { theme, setTheme, isDark } = useTheme();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-vayu-text flex items-center gap-2">
          <Sliders className="w-6 h-6 text-vayu-primary" aria-hidden="true" />
          <span>{t('nav.settings') || 'Settings'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-vayu-text-secondary">
          {t('settings.subtitle') || 'Customize your language, appearance, and accessibility preferences.'}
        </p>
      </div>

      {/* Theme Preference */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isDark ? <Moon className="w-5 h-5 text-vayu-accent" /> : <Sun className="w-5 h-5 text-vayu-primary" />}
            <span>{t('settings.themeTitle') || 'Appearance Theme'}</span>
          </CardTitle>
          <CardDescription>
            {t('settings.themeDescription') || 'Choose Light, Dark, or automatically match your system preference.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-3.5 rounded-2xl border text-center space-y-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-vayu-focus-ring ${
                theme === 'light'
                  ? 'bg-vayu-accent text-vayu-accent-text font-bold border-vayu-accent shadow-md'
                  : 'bg-vayu-surface-tint text-vayu-text border-vayu-border hover:bg-vayu-surface'
              }`}
            >
              <Sun className="w-5 h-5 mx-auto" aria-hidden="true" />
              <div className="text-xs">Light</div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-3.5 rounded-2xl border text-center space-y-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-vayu-focus-ring ${
                theme === 'dark'
                  ? 'bg-vayu-accent text-vayu-accent-text font-bold border-vayu-accent shadow-md'
                  : 'bg-vayu-surface-tint text-vayu-text border-vayu-border hover:bg-vayu-surface'
              }`}
            >
              <Moon className="w-5 h-5 mx-auto" aria-hidden="true" />
              <div className="text-xs">Dark</div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`p-3.5 rounded-2xl border text-center space-y-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-vayu-focus-ring ${
                theme === 'system'
                  ? 'bg-vayu-accent text-vayu-accent-text font-bold border-vayu-accent shadow-md'
                  : 'bg-vayu-surface-tint text-vayu-text border-vayu-border hover:bg-vayu-surface'
              }`}
            >
              <Laptop className="w-5 h-5 mx-auto" aria-hidden="true" />
              <div className="text-xs">System</div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Language Preference */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-vayu-primary" aria-hidden="true" />
            <span>{t('nav.language') || 'Language'}</span>
          </CardTitle>
          <CardDescription>
            {t('settings.languageDescription') || 'Select interface language (English, हिंदी, मराठी).'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            label={t('nav.selectLanguage')}
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            options={languages.map((l) => ({ value: l.code, label: `${l.nativeLabel} (${l.label})` }))}
          />
        </CardContent>
      </Card>

      {/* Accessibility Status */}
      <Card variant="tinted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-vayu-primary" aria-hidden="true" />
            <span>{t('settings.accessibilityTitle') || 'Accessibility & Design Tokens'}</span>
          </CardTitle>
          <CardDescription>
            {t('settings.accessibilityDescription') || 'WCAG AA verified contrast ratios and visible focus indicators.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-vayu-text-secondary">
          <div className="flex items-center justify-between">
            <span>Focus rings:</span>
            <Badge variant="accent">High Contrast Visible</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Color contrast:</span>
            <Badge variant="primary">WCAG AA &gt; 4.5:1</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Reduced motion:</span>
            <Badge variant="default">Respected</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
