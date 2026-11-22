import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n';
import { useTheme } from '../contexts/ThemeContext';
import { AQI_CATEGORIES } from '../constants/aqi';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Wind, ArrowRight, ShieldCheck, Sparkles, Layers } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-5 max-w-3xl mx-auto pt-4" aria-labelledby="landing-hero-title">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-vayu-surface-tint text-vayu-text border border-vayu-border text-xs font-bold shadow-sm">
          <Wind className="w-4 h-4 text-vayu-primary" aria-hidden="true" />
          <span>{t('brand.name')} • {t('brand.subtitle')}</span>
        </div>

        <h1 id="landing-hero-title" className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-vayu-text">
          {t('brand.tagline')}
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-vayu-text-secondary max-w-2xl mx-auto leading-relaxed">
          {t('about.description')}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/app">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" aria-hidden="true" />}
            >
              {t('landing.openDashboard') || 'Explore Live AQI Dashboard'}
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="secondary" size="lg">
              {t('nav.settings')}
            </Button>
          </Link>
        </div>
      </section>

      {/* AQI Categories & Color Palette Showcase (Demonstrates both themes) */}
      <section aria-labelledby="aqi-showcase-title" className="space-y-6">
        <div className="text-center space-y-1.5">
          <h2 id="aqi-showcase-title" className="text-xl sm:text-2xl font-black text-vayu-text flex items-center justify-center gap-2">
            <Layers className="w-5 h-5 text-vayu-primary" aria-hidden="true" />
            <span>{t('landing.aqiTiersTitle') || 'US AQI Health Categories & Color Palette'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-vayu-text-secondary">
            {t('landing.aqiTiersSubtitle') || 'Strictly single-source-of-truth palette with WCAG AA compliant contrast in both light and dark themes.'}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AQI_CATEGORIES.map((category) => {
            const variant = isDark ? category.dark : category.light;
            return (
              <div
                key={category.level}
                style={{
                  backgroundColor: variant.bg,
                  borderColor: variant.border,
                }}
                className="rounded-3xl border p-5 shadow-md flex flex-col justify-between space-y-3 transition-transform hover:scale-[1.01] motion-reduce:transform-none"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: variant.dot }}
                      className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                      aria-hidden="true"
                    />
                    <span
                      style={{ color: variant.text }}
                      className="font-bold text-sm tracking-tight"
                    >
                      {t(category.translationKey)}
                    </span>
                  </div>
                  <span
                    style={{
                      color: variant.text,
                      borderColor: variant.border,
                    }}
                    className="text-[11px] font-mono font-black px-2.5 py-0.5 rounded-full border bg-white/40 dark:bg-black/20"
                  >
                    {category.min} – {category.max === 500 ? '301+' : category.max}
                  </span>
                </div>

                <p
                  style={{ color: variant.text }}
                  className="text-xs leading-relaxed opacity-95 font-medium"
                >
                  {t(category.adviceTranslationKey)}
                </p>

                <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[10px] font-mono opacity-80" style={{ color: variant.text }}>
                  <span>Color: {category.colorName}</span>
                  <span>WCAG AA Passed (&gt;5.5:1)</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section aria-label="Key Architecture Features" className="grid md:grid-cols-3 gap-5">
        <Card variant="default">
          <CardHeader>
            <div className="w-10 h-10 rounded-2xl bg-vayu-surface-tint border border-vayu-border flex items-center justify-center text-vayu-primary mb-2">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </div>
            <CardTitle>{t('about.feature1Title')}</CardTitle>
            <CardDescription>{t('about.feature1Desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-xs font-semibold text-vayu-accent-link">
              Open-Meteo • 100% Free Data
            </span>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardHeader>
            <div className="w-10 h-10 rounded-2xl bg-vayu-surface-tint border border-vayu-border flex items-center justify-center text-vayu-primary mb-2">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <CardTitle>{t('about.feature2Title')}</CardTitle>
            <CardDescription>{t('about.feature2Desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-xs font-semibold text-vayu-accent-link">
              English • हिंदी • मराठी
            </span>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardHeader>
            <div className="w-10 h-10 rounded-2xl bg-vayu-surface-tint border border-vayu-border flex items-center justify-center text-vayu-primary mb-2">
              <Wind className="w-5 h-5" aria-hidden="true" />
            </div>
            <CardTitle>{t('about.feature3Title')}</CardTitle>
            <CardDescription>{t('about.feature3Desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-xs font-semibold text-vayu-accent-link">
              Zero Tracking • Zero Keys
            </span>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
