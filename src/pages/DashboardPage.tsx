import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '../i18n';
import { GeoCityItem } from '../schemas/geocodingSchema';
import { openMeteoService } from '../services/openMeteo';
import { CitySearch } from '../components/dashboard/CitySearch';
import { AQIOverviewCard } from '../components/dashboard/AQIOverviewCard';
import { PollutantGrid } from '../components/dashboard/PollutantGrid';
import { AQIMap } from '../components/map/AQIMap';
import { Wind, AlertTriangle, RefreshCw, Loader2, WifiOff } from 'lucide-react';

const DEFAULT_CITY: GeoCityItem = {
  id: 1273294,
  name: 'Delhi',
  latitude: 28.65195,
  longitude: 77.23149,
  country: 'India',
  admin1: 'Delhi',
};

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCity, setSelectedCity] = useState<GeoCityItem>(DEFAULT_CITY);

  // TanStack Query for Air Quality Data
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['airQuality', selectedCity.latitude, selectedCity.longitude],
    queryFn: () => openMeteoService.fetchAirQuality(selectedCity),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

  return (
    <div className="space-y-8">
      {/* Offline Alert if detected */}
      {isOffline && (
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{t('state.offlineNotice')}</span>
        </div>
      )}

      {/* Hero & City Search Section */}
      <section className="text-center space-y-4 max-w-3xl mx-auto" aria-labelledby="hero-title">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-semibold">
          <Wind className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t('brand.name')} • {t('brand.subtitle')}</span>
        </div>

        <h1 id="hero-title" className="text-3xl md:text-5xl font-black tracking-tight text-white">
          {t('brand.tagline')}
        </h1>

        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          {t('about.description')}
        </p>

        {/* City Search Bar */}
        <div className="pt-2">
          <CitySearch
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            isLoading={isLoading || isFetching}
          />
        </div>
      </section>

      {/* Live Data Display, Loading, or Error */}
      <section aria-label={t('aqi.title')} className="space-y-8">
        {isLoading && !data ? (
          <div className="space-y-6 animate-pulse" role="status" aria-live="polite">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 h-72 flex items-center justify-center">
              <div className="flex items-center gap-2 text-teal-400 text-sm">
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span>{t('state.loading')}</span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 h-44" />
              ))}
            </div>
          </div>
        ) : isError && !data ? (
          <div className="bg-rose-950/30 border border-rose-900/60 rounded-3xl p-8 text-center space-y-4 max-w-xl mx-auto shadow-2xl" role="alert">
            <div className="w-12 h-12 rounded-2xl bg-rose-900/50 border border-rose-800/60 text-rose-300 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t('state.errorTitle')}</h3>
              <p className="text-xs md:text-sm text-rose-200/80 mt-1.5">
                {error instanceof Error ? error.message : t('search.error')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-rose-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span>{t('state.retry')}</span>
            </button>
          </div>
        ) : data ? (
          <div className="space-y-8">
            <AQIOverviewCard
              data={data}
              isLoading={isFetching}
              onRefresh={() => refetch()}
            />

            <PollutantGrid data={data} />

            <AQIMap data={data} />
          </div>
        ) : (
          <div className="text-center p-8 text-slate-400 text-sm">
            {t('state.empty')}
          </div>
        )}
      </section>
    </div>
  );
};

