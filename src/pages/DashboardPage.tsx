import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Activity, Sparkles, MapPin } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-vayu-border-subtle">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-vayu-text flex items-center gap-2">
            <Activity className="w-6 h-6 text-vayu-primary" aria-hidden="true" />
            <span>{t('dashboard.title')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-vayu-text-secondary">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-vayu-surface border border-vayu-border text-xs font-bold text-vayu-text">
          <MapPin className="w-3.5 h-3.5 text-vayu-accent" aria-hidden="true" />
          <span>Default: Pune, Maharashtra • India</span>
        </div>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-vayu-accent" aria-hidden="true" />
            <span>Phase 1 Foundation Ready</span>
          </CardTitle>
          <CardDescription>
            The clean, accessible UI shell, design tokens, Devanagari typography, and i18n are fully initialized. Live Open-Meteo city search & AQI data hooks will connect in Phase 2.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-2xl bg-vayu-surface-tint border border-vayu-border space-y-2">
            <p className="text-xs sm:text-sm text-vayu-text font-medium">
              Ready for Phase 2: Open-Meteo autocomplete geocoding, live US AQI hero card, pollutant breakdown grid, and freshness indicators.
            </p>
            <Button size="sm" variant="primary">
              Scaffold Verified
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
