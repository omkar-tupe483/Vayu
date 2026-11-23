import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { AQI_CATEGORIES } from '../constants/aqi';
import { useTheme } from '../contexts/useTheme';
import { Activity, Compass, HeartPulse, ArrowRight, ShieldCheck, Wind } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-8 sm:p-14 border border-vayu-border bg-gradient-to-br from-vayu-surface via-vayu-surface-tint to-vayu-primary/10 shadow-lg text-center md:text-left">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-vayu-accent/30 border border-vayu-accent text-xs font-bold text-vayu-text">
            <Wind className="w-3.5 h-3.5 text-vayu-text" aria-hidden="true" />
            <span>{t('brand.subtitle')}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-vayu-text tracking-tight leading-none">
            {t('landing.heroTitle')}{' '}
            <span className="text-vayu-accent-link underline decoration-vayu-accent decoration-wavy decoration-2">
              {t('landing.heroAccent')}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-vayu-text-secondary leading-relaxed max-w-2xl">
            {t('landing.heroSubtitle')}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <NavLink to="/app">
              <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                {t('landing.ctaExplore')}
              </Button>
            </NavLink>
            <NavLink to="/settings">
              <Button size="lg" variant="outline">
                {t('landing.ctaSettings')}
              </Button>
            </NavLink>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid sm:grid-cols-3 gap-5">
        <Card variant="elevated">
          <CardHeader>
            <div className="p-3 rounded-2xl bg-vayu-primary/25 text-vayu-text w-fit mb-2">
              <Activity className="w-6 h-6" aria-hidden="true" />
            </div>
            <CardTitle>{t('nav.dashboard')}</CardTitle>
            <CardDescription>
              Real-time Open-Meteo atmospheric estimates and 24-hour predictive forecast window.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <div className="p-3 rounded-2xl bg-vayu-accent/30 text-vayu-text w-fit mb-2">
              <Compass className="w-6 h-6" aria-hidden="true" />
            </div>
            <CardTitle>{t('nav.routes')}</CardTitle>
            <CardDescription>
              Smart route comparison with public OSRM mapping and distance-weighted exposure score.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <div className="p-3 rounded-2xl bg-vayu-secondary/50 text-vayu-text w-fit mb-2">
              <HeartPulse className="w-6 h-6" aria-hidden="true" />
            </div>
            <CardTitle>{t('nav.health')}</CardTitle>
            <CardDescription>
              Rule-based medical guidance tailored to children, seniors, runners, and asthma sensitivities.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Standard AQI Scale Tiers Reference */}
      <section>
        <Card variant="tinted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-vayu-primary" aria-hidden="true" />
              <span>{t('landing.aqiTiersTitle')}</span>
            </CardTitle>
            <CardDescription>{t('landing.aqiTiersSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {AQI_CATEGORIES.map((cat) => {
                const style = isDark ? cat.dark : cat.light;
                return (
                  <div
                    key={cat.level}
                    style={{
                      backgroundColor: style.bg,
                      borderColor: style.border,
                      color: style.text,
                    }}
                    className="p-3.5 rounded-2xl border flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        style={{ backgroundColor: style.dot }}
                        className="w-3 h-3 rounded-full shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-xs sm:text-sm font-bold">
                        {t(cat.translationKey)}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-black opacity-80">
                      {cat.min} - {cat.max}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
