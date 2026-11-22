import React from 'react';
import { useTranslation } from '../../i18n';
import { CleanAirQualityModel } from '../../schemas/airQualitySchema';
import { getAQICategory } from '../../constants/aqi';
import { ShieldAlert, RefreshCw, Activity, MapPin, Sparkles, Wind } from 'lucide-react';

interface AQIOverviewCardProps {
  data: CleanAirQualityModel;
  isLoading: boolean;
  onRefresh: () => void;
}

export const AQIOverviewCard: React.FC<AQIOverviewCardProps> = ({
  data,
  isLoading,
  onRefresh,
}) => {
  const { t } = useTranslation();

  // Single source of truth for AQI categories and styling
  const category = getAQICategory(data.us_aqi);

  // Format time safely
  let formattedTime = data.time;
  try {
    const d = new Date(data.time);
    if (!isNaN(d.getTime())) {
      formattedTime = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  } catch {
    // Keep raw
  }

  return (
    <div className={`relative overflow-hidden bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl bg-gradient-to-br ${category.gradientBg}`}>
      {/* Top Bar: Location & Refresh */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 text-slate-300">
          <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-teal-400">
            <MapPin className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{data.city}</h2>
              {data.country && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                  {data.country}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {data.admin1 ? `${data.admin1} • ` : ''}Lat: {data.latitude.toFixed(2)}°, Lon: {data.longitude.toFixed(2)}° • {t('aqi.measuredAt')} {formattedTime}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          aria-label={t('aqi.refresh')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all disabled:opacity-50 text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <RefreshCw className={`w-4 h-4 text-teal-400 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
          <span className="hidden sm:inline">{isLoading ? t('aqi.refreshing') : t('aqi.refresh')}</span>
        </button>
      </div>

      {/* Main AQI Section */}
      <div className="grid md:grid-cols-12 gap-8 items-center pt-2">
        <div className="md:col-span-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Wind className="w-4 h-4 text-teal-400" aria-hidden="true" />
            <span>{t('aqi.title')} ({t('aqi.scale')})</span>
          </div>

          <div className="flex items-baseline gap-4">
            <span className={`text-6xl md:text-7xl font-black tracking-tight ${category.textColor}`}>
              {data.us_aqi}
            </span>
            <div className="space-y-1">
              {/* Single source of truth color-coded AQI badge */}
              <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs md:text-sm font-bold shadow-sm ${category.badgeBg} ${category.badgeBorder}`}>
                <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${category.dotColor}`} aria-hidden="true" />
                <span className={category.textColor}>{t(category.translationKey)}</span>
              </div>
              <div className="text-[11px] text-slate-400">{t('disclaimer.modelled')}</div>
            </div>
          </div>

          {/* Health Advice from Single Source of Truth */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {t(category.adviceTranslationKey)}
            </p>
          </div>
        </div>

        {/* Snapshot Panel */}
        <div className="md:col-span-6 bg-slate-950/80 rounded-2xl p-5 border border-slate-800/90 shadow-inner">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-800">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-400" aria-hidden="true" />
              <span>{t('aqi.liveSnapshot')}</span>
            </span>
            <span className="text-[11px] text-teal-400 flex items-center gap-1 font-mono">
              <Sparkles className="w-3 h-3" aria-hidden="true" /> Open-Meteo
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="font-semibold text-slate-300">{t('pollutants.pm2_5.name')}</span>
                <span className="text-[10px] text-teal-400">{data.units.pm2_5}</span>
              </div>
              <div className="text-xl font-bold text-white mt-1">{data.pollutants.pm2_5}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="font-semibold text-slate-300">{t('pollutants.pm10.name')}</span>
                <span className="text-[10px] text-teal-400">{data.units.pm10}</span>
              </div>
              <div className="text-xl font-bold text-white mt-1">{data.pollutants.pm10}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="font-semibold text-slate-300">{t('pollutants.nitrogen_dioxide.name')}</span>
                <span className="text-[10px] text-teal-400">{data.units.nitrogen_dioxide}</span>
              </div>
              <div className="text-xl font-bold text-white mt-1">{data.pollutants.nitrogen_dioxide}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="font-semibold text-slate-300">{t('pollutants.ozone.name')}</span>
                <span className="text-[10px] text-teal-400">{data.units.ozone}</span>
              </div>
              <div className="text-xl font-bold text-white mt-1">{data.pollutants.ozone}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

