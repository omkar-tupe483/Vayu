import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '../i18n';
import { useTheme } from '../contexts/ThemeContext';
import { openMeteoService } from '../services/openMeteo';
import { GeoCityItem } from '../schemas/geocodingSchema';
import { getAqiCategory, AQI_CATEGORIES } from '../constants/aqi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { MapPin, RefreshCw, Activity, Layers } from 'lucide-react';

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
  const { isDark } = useTheme();
  const [selectedCity] = useState<GeoCityItem>(DEFAULT_CITY);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['airQuality', selectedCity.latitude, selectedCity.longitude],
    queryFn: () => openMeteoService.fetchAirQuality(selectedCity),
    staleTime: 5 * 60 * 1000,
  });

  const category = data ? getAqiCategory(data.us_aqi) : null;
  const aqiStyle = category ? (isDark ? category.dark : category.light) : null;

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-vayu-border-subtle">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-vayu-text flex items-center gap-2">
            <Activity className="w-6 h-6 text-vayu-primary" aria-hidden="true" />
            <span>{t('nav.dashboard') || 'Dashboard'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-vayu-text-secondary">
            {t('dashboard.subtitle') || 'Live urban air quality monitoring with Open-Meteo modelled estimates.'}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          isLoading={isFetching}
          leftIcon={<RefreshCw className="w-4 h-4" aria-hidden="true" />}
        >
          {t('aqi.refresh')}
        </Button>
      </div>

      {/* Main Status Display */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      ) : isError ? (
        <ErrorState
          title={t('state.errorTitle')}
          message={error instanceof Error ? error.message : t('search.error')}
          onRetry={() => refetch()}
          retryLabel={t('state.retry')}
        />
      ) : data && category && aqiStyle ? (
        <div className="space-y-6">
          {/* Primary AQI Card */}
          <div
            style={{
              backgroundColor: aqiStyle.bg,
              borderColor: aqiStyle.border,
            }}
            className="rounded-3xl border p-6 sm:p-8 shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 shrink-0" style={{ color: aqiStyle.text }} aria-hidden="true" />
                <span className="text-lg sm:text-xl font-bold" style={{ color: aqiStyle.text }}>
                  {data.city}, {data.country}
                </span>
              </div>
              <span
                style={{
                  color: aqiStyle.text,
                  borderColor: aqiStyle.border,
                }}
                className="text-xs font-bold px-3 py-1 rounded-full border bg-white/40 dark:bg-black/20"
              >
                {t(category.translationKey)}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 items-center">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold opacity-80" style={{ color: aqiStyle.text }}>
                  {t('aqi.title')}
                </span>
                <div className="text-6xl sm:text-7xl font-black mt-1" style={{ color: aqiStyle.text }}>
                  {data.us_aqi}
                </div>
                <p className="text-xs sm:text-sm mt-3 font-medium leading-relaxed" style={{ color: aqiStyle.text }}>
                  {t(category.adviceTranslationKey)}
                </p>
              </div>

              <div className="bg-white/60 dark:bg-black/30 rounded-2xl p-4 border" style={{ borderColor: aqiStyle.border }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: aqiStyle.text }}>
                  {t('aqi.liveSnapshot')}
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-2.5 rounded-xl bg-white/70 dark:bg-black/20 border" style={{ borderColor: aqiStyle.border }}>
                    <div className="text-[10px] opacity-75" style={{ color: aqiStyle.text }}>PM2.5</div>
                    <div className="text-lg font-bold" style={{ color: aqiStyle.text }}>{data.pollutants.pm2_5}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/70 dark:bg-black/20 border" style={{ borderColor: aqiStyle.border }}>
                    <div className="text-[10px] opacity-75" style={{ color: aqiStyle.text }}>PM10</div>
                    <div className="text-lg font-bold" style={{ color: aqiStyle.text }}>{data.pollutants.pm10}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/70 dark:bg-black/20 border" style={{ borderColor: aqiStyle.border }}>
                    <div className="text-[10px] opacity-75" style={{ color: aqiStyle.text }}>NO₂</div>
                    <div className="text-lg font-bold" style={{ color: aqiStyle.text }}>{data.pollutants.nitrogen_dioxide}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/70 dark:bg-black/20 border" style={{ borderColor: aqiStyle.border }}>
                    <div className="text-[10px] opacity-75" style={{ color: aqiStyle.text }}>Ozone</div>
                    <div className="text-lg font-bold" style={{ color: aqiStyle.text }}>{data.pollutants.ozone}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AQI Scale Reference in Current Theme */}
          <Card variant="tinted">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-vayu-primary" aria-hidden="true" />
                <span>{t('landing.aqiTiersTitle') || 'AQI Scale Reference'}</span>
              </CardTitle>
              <CardDescription>
                {t('landing.aqiTiersSubtitle') || 'Color-coded health tiers.'}
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
