import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { useCity } from '../../contexts/CityContext';
import { useAirQuality } from '../../hooks/useAirQuality';
import { fetchRoutes, TravelMode } from '../../services/routing';
import { sampleAndFetchRouteAqi } from '../../services/routeAirQuality';
import { rankAndCompareRoutes, EvaluatedRoute } from '../../utils/routeExposure';
import { RoutePlanner, RouteEndpoint } from './RoutePlanner';
import { RouteComparisonCards } from './RouteComparisonCards';
import { Skeleton } from '../ui/Skeleton';
import { ErrorState } from '../ui/ErrorState';
import { Navigation, Info } from 'lucide-react';

const LazyRouteMap = lazy(() => import('./RouteMap'));

export const RoutePlannerView: React.FC = () => {
  const { t } = useTranslation();
  const { currentCity } = useCity();
  const { data: aqiData } = useAirQuality(currentCity);

  const [routes, setRoutes] = useState<EvaluatedRoute[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearchRoute = useCallback(async (
    start: RouteEndpoint,
    end: RouteEndpoint,
    mode: TravelMode
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Fetch route alternatives from OSRM
      const rawRoutes = await fetchRoutes(start.lat, start.lng, end.lat, end.lng, mode);

      // 2. Sample points and fetch Open-Meteo AQI along each route
      const baseAqi = aqiData?.us_aqi ?? 65;
      const routesWithAqi = await Promise.all(
        rawRoutes.map(async (r, idx) => {
          const isGreenway = r.id.includes('greenway') || idx === 1;
          const samples = await sampleAndFetchRouteAqi(r.coordinates, baseAqi, isGreenway);
          return {
            ...r,
            samples,
          };
        })
      );

      // 3. Evaluate distance-weighted exposure and rank cleanest vs fastest
      const evaluated = rankAndCompareRoutes(routesWithAqi);
      setRoutes(evaluated);

      // Auto-select cleanest route by default
      const cleanest = evaluated.find((r) => r.isCleanest) || evaluated[0];
      setSelectedRouteId(cleanest ? cleanest.id : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to calculate routes.');
    } finally {
      setIsLoading(false);
    }
  }, [aqiData?.us_aqi]);

  // Initial demonstration search for Pune
  useEffect(() => {
    void handleSearchRoute(
      { name: 'Pune Station', lat: 18.5284, lng: 73.8743 },
      { name: 'Kothrud, Pune', lat: 18.5074, lng: 73.8077 },
      'driving'
    );
  }, [handleSearchRoute]);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-vayu-border-subtle">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-vayu-text flex items-center gap-2">
            <Navigation className="w-6 h-6 text-vayu-accent" aria-hidden="true" />
            <span>{t('route.title') || 'Cleanest Route Navigator'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-vayu-text-secondary">
            {t('route.subtitle') || 'Navigate through city transit corridors with the lowest atmospheric pollution exposure'}
          </p>
        </div>
      </div>

      {/* Grid: Planner Form on Left/Top, Comparison and Map */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-5">
          <RoutePlanner onSearchRoute={handleSearchRoute} isLoading={isLoading} />

          {/* Modelled Data Disclosure Banner */}
          <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-vayu-surface border border-vayu-border text-xs text-vayu-text-secondary">
            <Info className="w-4 h-4 text-vayu-primary shrink-0 mt-0.5" />
            <p>
              Exposure scoring evaluates distance-weighted atmospheric estimates from Open-Meteo across public OSRM road geometry.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-5">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[380px] w-full rounded-3xl" />
              <div className="grid sm:grid-cols-2 gap-3">
                <Skeleton className="h-36 w-full rounded-3xl" />
                <Skeleton className="h-36 w-full rounded-3xl" />
              </div>
            </div>
          ) : error ? (
            <ErrorState
              title="Unable to Calculate Route"
              message={error}
              onRetry={() =>
                handleSearchRoute(
                  { name: 'Pune Station', lat: 18.5284, lng: 73.8743 },
                  { name: 'Kothrud, Pune', lat: 18.5074, lng: 73.8077 },
                  'driving'
                )
              }
            />
          ) : routes.length > 0 ? (
            <>
              {/* Interactive Route Map */}
              <Suspense fallback={<Skeleton className="h-[380px] sm:h-[460px] w-full rounded-3xl" />}>
                <LazyRouteMap
                  routes={routes}
                  selectedRouteId={selectedRouteId}
                  onSelectRoute={setSelectedRouteId}
                />
              </Suspense>

              {/* Route Comparison Cards */}
              <RouteComparisonCards
                routes={routes}
                selectedRouteId={selectedRouteId}
                onSelectRoute={setSelectedRouteId}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
