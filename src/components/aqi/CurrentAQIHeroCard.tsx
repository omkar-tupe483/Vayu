import React from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/useTheme';
import { CleanAirQualityModel } from '../../schemas/airQualitySchema';
import { getAqiCategory } from '../../constants/aqi';
import { Button } from '../ui/Button';
import {
  MapPin,
  Clock,
  RefreshCw,
  Sparkles,
  HeartPulse,
  BellRing,
  Info,
} from 'lucide-react';

export interface CurrentAQIHeroCardProps {
  data: CleanAirQualityModel;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onViewHealthAdvice?: () => void;
  onSetAlert?: () => void;
  className?: string;
}

export const CurrentAQIHeroCard: React.FC<CurrentAQIHeroCardProps> = ({
  data,
  onRefresh,
  isRefreshing = false,
  onViewHealthAdvice,
  onSetAlert,
  className = '',
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const category = getAqiCategory(data.us_aqi);
  const aqiStyle = isDark ? category.dark : category.light;

  // Format time
  const formattedTime = new Date(data.time).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      style={{
        backgroundColor: aqiStyle.bg,
        borderColor: aqiStyle.border,
      }}
      className={`relative rounded-3xl border p-6 sm:p-8 shadow-xl transition-all overflow-hidden ${className}`}
    >
      {/* Ambient background glow */}
      <div
        style={{ backgroundColor: aqiStyle.dot }}
        className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Bar: City location and categorical status badge */}
      <div className="relative flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <MapPin className="w-5 h-5 shrink-0" style={{ color: aqiStyle.text }} aria-hidden="true" />
          <h2 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: aqiStyle.text }}>
            {data.city}
            {data.admin1 ? `, ${data.admin1}` : ''}
            {data.country ? ` • ${data.country}` : ''}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Animated Category Badge */}
          <span
            style={{
              color: aqiStyle.text,
              borderColor: aqiStyle.border,
            }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-black px-4 py-1.5 rounded-full border bg-white/40 dark:bg-black/30 shadow-sm"
          >
            <span
              style={{ backgroundColor: aqiStyle.dot }}
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              aria-hidden="true"
            />
            <span>{t(category.translationKey)}</span>
          </span>

          {/* Refresh Button */}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label={t('aqi.refresh')}
              title={t('aqi.refresh')}
              style={{ color: aqiStyle.text, borderColor: aqiStyle.border }}
              className="p-2 rounded-full border bg-white/40 dark:bg-black/30 hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Main Stats: Large AQI display + Plain Language Meaning */}
      <div className="relative grid md:grid-cols-12 gap-6 items-center">
        {/* Left: Huge AQI number */}
        <div className="md:col-span-5 space-y-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold opacity-80" style={{ color: aqiStyle.text }}>
            <span>{t('aqi.title')}</span>
            <span>•</span>
            <span>{t('aqi.scale')}</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-7xl sm:text-8xl font-black tracking-tighter" style={{ color: aqiStyle.text }}>
              {data.us_aqi}
            </span>
            <span className="text-sm font-bold opacity-75" style={{ color: aqiStyle.text }}>
              / 500
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs opacity-80" style={{ color: aqiStyle.text }}>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t('aqi.measuredAt')}: {formattedTime}</span>
            </span>
            <span>•</span>
            <span className="font-mono text-[11px]">
              {data.latitude.toFixed(2)}°N, {data.longitude.toFixed(2)}°E
            </span>
          </div>
        </div>

        {/* Right: Recommendation Card & Actions */}
        <div
          className="md:col-span-7 bg-white/60 dark:bg-black/35 backdrop-blur-md rounded-2xl p-5 sm:p-6 border shadow-inner flex flex-col justify-between space-y-4"
          style={{ borderColor: aqiStyle.border }}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: aqiStyle.text }}>
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Dominant Trigger: {data.dominantPollutant}</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold leading-relaxed" style={{ color: aqiStyle.text }}>
              {t(category.healthSummaryKey)}
            </p>
            <p className="text-xs opacity-90 leading-relaxed" style={{ color: aqiStyle.text }}>
              {t(category.adviceTranslationKey)}
            </p>
          </div>

          {/* Action Buttons: View Health Advice and Set Alert */}
          <div className="pt-2 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={onViewHealthAdvice}
                leftIcon={<HeartPulse className="w-4 h-4" />}
              >
                View health advice
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onSetAlert}
                leftIcon={<BellRing className="w-4 h-4" />}
              >
                Set alert
              </Button>
            </div>

            {/* Honest modelled notice */}
            <span className="inline-flex items-center gap-1 text-[11px] opacity-75" style={{ color: aqiStyle.text }}>
              <Info className="w-3 h-3" aria-hidden="true" />
              <span>Modelled estimate</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
