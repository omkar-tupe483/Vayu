import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { useCity } from '../contexts/CityContext';
import { useAirQuality } from '../hooks/useAirQuality';
import { useAirQualityForecast } from '../hooks/useAirQualityForecast';
import {
  CitySearch,
  CurrentAQIHeroCard,
  AQIScaleLegend,
  PollutantGrid,
  DataFreshnessIndicator,
} from '../components/aqi';
import {
  ForecastChart,
  ForecastTimeline,
  BestTimeWindowCard,
} from '../components/forecast';
import { HealthProfileId, findBestTimeWindow } from '../utils/bestWindow';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { Activity } from 'lucide-react';
import { useToast } from '../components/ui/toastContext';

const AirQualityMap = lazy(() => import('../components/map/AirQualityMap'));

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentCity } = useCity();
  const { data, isLoading, isError, error, refetch, isFetching } = useAirQuality(currentCity);
  const { data: forecastData, isLoading: isForecastLoading } = useAirQualityForecast(currentCity);
  const { addToast } = useToast();

  const [selectedProfile, setSelectedProfile] = useState<HealthProfileId>('general');
  const [customThreshold, setCustomThreshold] = useState<number | undefined>(undefined);

  const bestWindow = useMemo(() => {
    if (!forecastData || !forecastData.hourly.length) return null;
    return findBestTimeWindow(forecastData.hourly, selectedProfile, customThreshold, 3);
  }, [forecastData, selectedProfile, customThreshold]);

  const handleSetAlert = () => {
    addToast({
      title: 'Alert Configured',
      message: `AQI monitoring enabled for ${currentCity.name}. You will be alerted when air quality drops.`,
      type: 'info',
    });
  };

  const handleViewHealthAdvice = () => {
    const healthSection = document.getElementById('health-section');
    if (healthSection) {
      healthSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      addToast({
        title: 'Health Advisor',
        message: 'Personalized rule-based guidance is available in the Health Advisor tab.',
        type: 'info',
      });
    }
  };

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="space-y-4">
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
        </div>

        {/* Global City Search Combobox */}
        <CitySearch />
      </div>

      {/* Main Status Display: Loading, Error, or Live Data */}
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-72 w-full rounded-3xl" />
          <Skeleton className="h-24 w-full rounded-3xl" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-36 w-full rounded-2xl" />
            <Skeleton className="h-36 w-full rounded-2xl" />
            <Skeleton className="h-36 w-full rounded-2xl" />
            <Skeleton className="h-36 w-full rounded-2xl" />
            <Skeleton className="h-36 w-full rounded-2xl" />
            <Skeleton className="h-36 w-full rounded-2xl" />
          </div>
        </div>
      ) : isError ? (
        <ErrorState
          title={t('state.errorTitle')}
          message={error instanceof Error ? error.message : 'Unable to connect to Open-Meteo'}
          onRetry={() => refetch()}
          retryLabel={t('state.retry')}
        />
      ) : data ? (
        <div className="space-y-7">
          {/* Freshness Timestamp */}
          <DataFreshnessIndicator timestamp={data.time} isFetching={isFetching} />

          {/* Hero Card */}
          <CurrentAQIHeroCard
            data={data}
            onRefresh={() => refetch()}
            isRefreshing={isFetching}
            onViewHealthAdvice={handleViewHealthAdvice}
            onSetAlert={handleSetAlert}
          />

          {/* Lazy-loaded Interactive Leaflet Air Quality Map */}
          <Suspense fallback={<Skeleton className="h-[360px] sm:h-[440px] w-full rounded-3xl" />}>
            <AirQualityMap data={data} />
          </Suspense>

          {/* 24-Hour Forecast Suite (SVG Chart, Timeline, Best Window) */}
          {isForecastLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-72 w-full rounded-3xl" />
              <Skeleton className="h-32 w-full rounded-3xl" />
              <Skeleton className="h-44 w-full rounded-3xl" />
            </div>
          ) : forecastData ? (
            <div className="space-y-6">
              {/* Hand-written SVG Forecast Chart */}
              <ForecastChart forecast={forecastData} />

              {/* Horizontally Scrollable 24-hour Timeline Strip */}
              <ForecastTimeline
                forecast={forecastData}
                bestWindowRange={
                  bestWindow && bestWindow.isSafe
                    ? { startIndex: bestWindow.startIndex, endIndex: bestWindow.endIndex }
                    : null
                }
              />

              {/* Best Outdoor Time Window Card */}
              <BestTimeWindowCard
                bestWindow={bestWindow}
                selectedProfile={selectedProfile}
                onSelectProfile={(profile) => {
                  setSelectedProfile(profile);
                  setCustomThreshold(undefined);
                }}
                customThreshold={customThreshold}
                onThresholdChange={(thresh) => setCustomThreshold(thresh)}
              />
            </div>
          ) : null}

          {/* Categorical Scale Legend */}
          <AQIScaleLegend currentAqi={data.us_aqi} />

          {/* Detailed Pollutants Breakdown */}
          <PollutantGrid data={data} />
        </div>
      ) : null}
    </div>
  );
};
