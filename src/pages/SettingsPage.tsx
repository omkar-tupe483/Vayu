import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/useTheme';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LanguageSelector } from '../components/layout/LanguageSelector';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { Settings, Moon, Globe, Eye, Trash2, CheckCircle } from 'lucide-react';
import { useToast } from '../components/ui/toastContext';

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { addToast } = useToast();

  const [reduceMotion, setReduceMotion] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vayu_reduce_motion') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleReduceMotion = () => {
    const nextVal = !reduceMotion;
    setReduceMotion(nextVal);
    try {
      localStorage.setItem('vayu_reduce_motion', String(nextVal));
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [reduceMotion]);

  const handleClearData = () => {
    try {
      localStorage.clear();
      addToast({
        title: 'Storage Cleared',
        message: t('settings.clearDataSuccess'),
        type: 'success',
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch {
      // Ignored
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="pb-2 border-b border-vayu-border-subtle">
        <h1 className="text-2xl sm:text-3xl font-black text-vayu-text flex items-center gap-2">
          <Settings className="w-6 h-6 text-vayu-primary" aria-hidden="true" />
          <span>{t('settings.title')}</span>
        </h1>
        <p className="text-xs sm:text-sm text-vayu-text-secondary">
          {t('settings.subtitle')}
        </p>
      </div>

      <div className="space-y-4">
        {/* Appearance Setting */}
        <Card variant="elevated">
          <CardContent className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-vayu-surface-tint border border-vayu-border text-vayu-text shrink-0">
                <Moon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-vayu-text">{t('settings.appearance')}</h4>
                <p className="text-xs text-vayu-text-secondary">{t('settings.appearanceDesc')} (Active: {theme})</p>
              </div>
            </div>
            <ThemeToggle />
          </CardContent>
        </Card>

        {/* Language Setting */}
        <Card variant="elevated">
          <CardContent className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-vayu-surface-tint border border-vayu-border text-vayu-text shrink-0">
                <Globe className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-vayu-text">{t('settings.language')}</h4>
                <p className="text-xs text-vayu-text-secondary">{t('settings.languageDesc')}</p>
              </div>
            </div>
            <LanguageSelector />
          </CardContent>
        </Card>

        {/* Accessibility & Reduce Motion Setting */}
        <Card variant="elevated">
          <CardContent className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-vayu-surface-tint border border-vayu-border text-vayu-text shrink-0">
                <Eye className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-vayu-text">{t('settings.accessibility')}</h4>
                <p className="text-xs text-vayu-text-secondary">{t('settings.reduceMotionDesc')}</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={reduceMotion}
              onClick={handleToggleReduceMotion}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring ${
                reduceMotion ? 'bg-vayu-accent justify-end' : 'bg-vayu-border justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-vayu-surface shadow-md" aria-hidden="true" />
            </button>
          </CardContent>
        </Card>

        {/* Clear Data Setting */}
        <Card variant="elevated">
          <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 shrink-0">
                <Trash2 className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-vayu-text">{t('settings.dataPrivacy')}</h4>
                <p className="text-xs text-vayu-text-secondary">Reset all local preferences and offline caches</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleClearData} leftIcon={<CheckCircle className="w-4 h-4" />}>
              {t('settings.clearData')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
