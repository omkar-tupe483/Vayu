import { useState, useEffect, lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '../i18n';
import { useTheme } from '../contexts/ThemeContext';
import { openMeteoService } from '../services/openMeteo';
import { GeoCityItem } from '../schemas/geocodingSchema';
import { AQI_CATEGORIES } from '../constants/aqi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { CitySearch } from '../components/aqi/CitySearch';
import { DEFAULT_CITY } from '../constants/cities';
import { CurrentAqiCard } from '../components/aqi/CurrentAqiCard';
import { PollutantGrid } from '../components/aqi/PollutantGrid';
import { RefreshCw, Activity, Layers, WifiOff } from 'lucide-react';

const AirQualityMap = lazy(() => import('../components/map/AirQualityMap'));

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [selectedCity, setSelectedCity] = useState<GeoCityItem>(DEFAULT_CITY);
  const [isOffline, setIsOffline] = useState<boolean>(() => (typeof navigator !== 'undefined' ? !navigator.onLine : false));

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return (
    <div className="space-y-8">
      {/* Offline Alert Banner */}
      {isOffline && (
        <div
          role="alert"
          className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-sm font-medium"
        >
          <WifiOff className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>{t('state.offlineNotice')}</span>
        </div>
      )}

      {/* Dashboard Top Header & City Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-vayu-border-subtle">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-vayu-text flex items-center gap-2">
              <Activity className="w-6 h-6 text-vayu-primary" aria-hidden="true" />
              <span>{t('nav.dashboard')}</span>
            </h1>
            <p className="text-xs sm:text-sm text-vayu-text-secondary">
              {t('dashboard.subtitle')}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            isLoading={isFetching}
            leftIcon={<RefreshCw className="w-4 h-4" aria-hidden="true" />}
          >
            {isFetching ? t('aqi.refreshing') : t('aqi.refresh')}
          </Button>
        </div>

        {/* Global City Search Combobox with Quick Picks */}
        <CitySearch
          selectedCity={selectedCity}
          onSelectCity={(city) => setSelectedCity(city)}
        />
      </div>

      {/* Main Status Display: Loading, Error, or Live Data */}
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-72 w-full rounded-3xl" />
          <Skeleton className="h-96 w-full rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Skeleton className="h-36 w-full rounded-2xl" />
              <Skeleton className="h-36 w-full rounded-2xl" />
              <Skeleton className="h-36 w-full rounded-2xl" />
              <Skeleton className="h-36 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      ) : isError ? (
        <ErrorState
          title={t('state.errorTitle')}
          message={error instanceof Error ? error.message : t('search.error')}
          onRetry={() => refetch()}
          retryLabel={t('state.retry')}
        />
      ) : data ? (
        <div className="space-y-8">
          {/* Primary Current AQI Card */}
          <CurrentAqiCard data={data} />

          {/* Lazy-Loaded Interactive Air Quality Map */}
          <Suspense fallback={<Skeleton className="h-80 sm:h-96 md:h-[420px] w-full rounded-3xl" />}>
            <AirQualityMap data={data} />
          </Suspense>

          {/* Detailed Pollutants Grid (PM2.5, PM10, NO2, Ozone) */}
          <PollutantGrid data={data} />

          {/* AQI Scale Reference Tiers */}
          <Card variant="tinted">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-vayu-primary" aria-hidden="true" />
                <span>{t('landing.aqiTiersTitle')}</span>
              </CardTitle>
              <CardDescription>
                {t('landing.aqiTiersSubtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-2">
                {AQI_CATEGORIES.map((cat) => {
                  const style = isDark ? cat.dark : cat.light;
                  return (
                    <span
                      key={cat.level}
                      style={{
                        backgroundColor: style.bg,
                        borderColor: style.border,
                        color: style.text,
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold"
                    >
                      <span style={{ backgroundColor: style.dot }} className="w-2 h-2 rounded-full" aria-hidden="true" />
                      <span>{t(cat.translationKey)}</span>
                    </span>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
};
