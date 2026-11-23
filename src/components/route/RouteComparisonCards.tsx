import React from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/useTheme';
import { EvaluatedRoute } from '../../utils/routeExposure';
import { Sparkles, Zap, Clock, Navigation2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export interface RouteComparisonCardsProps {
  routes: EvaluatedRoute[];
  selectedRouteId: string | null;
  onSelectRoute: (id: string) => void;
  className?: string;
}

export const RouteComparisonCards: React.FC<RouteComparisonCardsProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  className = '',
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  if (routes.length === 0) return null;

  return (
    <div className={`space-y-3.5 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-vayu-text-secondary">
          {t('route.comparisonTitle') || 'Route Alternatives & Exposure Scoring'}
        </h4>
        <span className="text-[11px] text-vayu-text-secondary">Click card to highlight on map</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {routes.map((route) => {
          const isSelected = selectedRouteId === route.id;
          const aqiStyle = isDark ? route.category.dark : route.category.light;

          return (
            <div
              key={route.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectRoute(route.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectRoute(route.id);
                }
              }}
              style={{
                borderColor: isSelected ? 'var(--vayu-accent)' : undefined,
              }}
              className={`p-4 sm:p-5 rounded-3xl border transition-all text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring relative overflow-hidden ${
                isSelected
                  ? 'bg-vayu-surface-elevated shadow-xl border-2'
                  : 'bg-vayu-surface border-vayu-border hover:bg-vayu-surface-tint'
              }`}
            >
              {/* Badges Bar: Cleanest, Fastest */}
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                {route.isCleanest && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                    <span>Cleanest Route</span>
                  </span>
                )}

                {route.isFastest && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30 text-xs font-black uppercase">
                    <Zap className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
                    <span>Fastest Route</span>
                  </span>
                )}

                {isSelected && (
                  <span className="ml-auto flex items-center gap-1 text-[11px] font-bold text-vayu-accent-link">
                    <CheckCircle2 className="w-3.5 h-3.5 text-vayu-accent" />
                    <span>Selected</span>
                  </span>
                )}
              </div>

              {/* Title & Stats */}
              <div className="space-y-1 mb-4">
                <h5 className="text-base font-black text-vayu-text tracking-tight">
                  {route.name}
                </h5>
                <div className="flex items-center gap-4 text-xs font-bold text-vayu-text-secondary">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-vayu-primary" />
                    <span>{route.durationMinutes} min</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Navigation2 className="w-3.5 h-3.5 text-vayu-accent" />
                    <span>{route.distanceKm} km</span>
                  </span>
                </div>
              </div>

              {/* AQI Exposure Metrics */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-vayu-border-subtle text-xs">
                {/* Distance-Weighted Exposure */}
                <div className="p-2.5 rounded-2xl bg-vayu-surface-tint border border-vayu-border/60">
                  <span className="text-[10px] uppercase font-bold text-vayu-text-secondary block">
                    Average Exposure
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      style={{ backgroundColor: aqiStyle.dot }}
                      className="w-2.5 h-2.5 rounded-full"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-black font-mono text-vayu-text">
                      {route.weightedAqi} AQI
                    </span>
                  </div>
                </div>

                {/* Peak AQI on Route */}
                <div className="p-2.5 rounded-2xl bg-vayu-surface-tint border border-vayu-border/60">
                  <span className="text-[10px] uppercase font-bold text-vayu-text-secondary block flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5 text-amber-500" />
                    <span>Peak Hotspot</span>
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-sm font-black font-mono text-vayu-text">
                      {route.peakAqi} AQI
                    </span>
                  </div>
                </div>
              </div>

              {/* Cleaner Percentage Improvement Banner */}
              {route.cleanerPercentageVsFastest && route.cleanerPercentageVsFastest > 0 && (
                <div className="mt-3 py-1.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                  <span>{route.cleanerPercentageVsFastest}% cleaner air exposure than direct traffic corridor</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
