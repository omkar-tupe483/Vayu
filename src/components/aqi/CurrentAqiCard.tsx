import React from 'react';
import { MapPin, Clock, ShieldAlert, Sparkles, Info } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../contexts/ThemeContext';
import { CleanAirQualityModel } from '../../schemas/airQualitySchema';
import { getAqiCategory } from '../../constants/aqi';

export interface CurrentAqiCardProps {
  data: CleanAirQualityModel;
}

export const CurrentAqiCard: React.FC<CurrentAqiCardProps> = ({ data }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const category = getAqiCategory(data.us_aqi);
  const aqiStyle = isDark ? category.dark : category.light;

  // Format calculation timestamp
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
      className="relative rounded-3xl border p-6 sm:p-8 shadow-xl transition-all overflow-hidden"
    >
      {/* Decorative ambient background accent */}
      <div
        style={{ backgroundColor: aqiStyle.dot }}
        className="absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
        aria-hidden="true"
      />

      {/* Header Info: Location & Badges */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 shrink-0" style={{ color: aqiStyle.text }} aria-hidden="true" />
          <h2 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: aqiStyle.text }}>
            {data.city}
            {data.admin1 ? `, ${data.admin1}` : ''}
            {data.country ? ` • ${data.country}` : ''}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Categorical Color-Coded AQI Badge */}
          <span
            style={{
              color: aqiStyle.text,
              borderColor: aqiStyle.border,
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-full border bg-white/40 dark:bg-black/30 shadow-sm"
          >
            <span
              style={{ backgroundColor: aqiStyle.dot }}
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              aria-hidden="true"
            />
            <span>{t(category.translationKey)}</span>
          </span>
        </div>
      </div>

      {/* Main AQI Value & Primary Advice */}
      <div className="relative grid md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-5 space-y-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold opacity-80" style={{ color: aqiStyle.text }}>
            <span>{t('aqi.title')}</span>
            <span>•</span>
            <span>{t('aqi.scale')}</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span
              className="text-7xl sm:text-8xl font-black tracking-tighter"
              style={{ color: aqiStyle.text }}
            >
              {data.us_aqi}
            </span>
            <span className="text-sm font-bold opacity-75" style={{ color: aqiStyle.text }}>
              / 500
            </span>
          </div>

          {/* Timestamp & Open-Meteo model marker */}
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

        {/* Health Advisory Banner */}
        <div
          className="md:col-span-7 bg-white/50 dark:bg-black/30 backdrop-blur-sm rounded-2xl p-5 border shadow-inner flex flex-col justify-between space-y-3"
          style={{ borderColor: aqiStyle.border }}
        >
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" style={{ color: aqiStyle.text }} aria-hidden="true" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: aqiStyle.text }}>
                {t('brand.name')} Health Recommendation
              </div>
              <p className="text-xs sm:text-sm font-medium leading-relaxed" style={{ color: aqiStyle.text }}>
                {t(category.adviceTranslationKey)}
              </p>
            </div>
          </div>

          {/* Modelled estimate transparency badge */}
          <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] opacity-80" style={{ color: aqiStyle.text }}>
            <span className="inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Open-Meteo Modelled Estimate</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10px]">
              <Info className="w-3 h-3" aria-hidden="true" />
              <span>General Guidance</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
