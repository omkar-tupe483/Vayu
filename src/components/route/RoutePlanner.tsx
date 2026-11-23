import React, { useState } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { TravelMode } from '../../services/routing';
import { Navigation, ArrowUpDown, Footprints, Bike, Car, Search, Sparkles } from 'lucide-react';

export interface RouteEndpoint {
  name: string;
  lat: number;
  lng: number;
}

export interface RoutePlannerProps {
  onSearchRoute: (start: RouteEndpoint, end: RouteEndpoint, mode: TravelMode) => void;
  isLoading?: boolean;
  className?: string;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  onSearchRoute,
  isLoading = false,
  className = '',
}) => {
  const { t } = useTranslation();

  // Default points in Pune for quick zero-friction demonstration
  const [startPoint, setStartPoint] = useState<RouteEndpoint>({
    name: 'Pune Railway Station, Agarkar Nagar',
    lat: 18.5284,
    lng: 73.8743,
  });

  const [endPoint, setEndPoint] = useState<RouteEndpoint>({
    name: 'Kothrud, Pune, Maharashtra',
    lat: 18.5074,
    lng: 73.8077,
  });

  const [mode, setMode] = useState<TravelMode>('driving');

  const handleSwap = () => {
    const temp = startPoint;
    setStartPoint(endPoint);
    setEndPoint(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchRoute(startPoint, endPoint, mode);
  };

  return (
    <div className={`p-5 sm:p-6 rounded-3xl bg-vayu-surface-elevated border border-vayu-border shadow-xl space-y-5 ${className}`}>
      <div className="flex items-center gap-2 pb-2 border-b border-vayu-border-subtle">
        <Navigation className="w-5 h-5 text-vayu-primary" aria-hidden="true" />
        <h3 className="text-base sm:text-lg font-black text-vayu-text">
          {t('route.plannerTitle') || 'Cleanest Route Navigation'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mode Toggle: Walking, Cycling, Driving */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-vayu-surface border border-vayu-border">
          <button
            type="button"
            onClick={() => setMode('walking')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              mode === 'walking'
                ? 'bg-vayu-accent text-vayu-btn-text border-vayu-accent shadow-sm'
                : 'bg-transparent text-vayu-text-secondary border-transparent hover:text-vayu-text'
            }`}
          >
            <Footprints className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Walking</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('cycling')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              mode === 'cycling'
                ? 'bg-vayu-accent text-vayu-btn-text border-vayu-accent shadow-sm'
                : 'bg-transparent text-vayu-text-secondary border-transparent hover:text-vayu-text'
            }`}
          >
            <Bike className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Cycling</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('driving')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              mode === 'driving'
                ? 'bg-vayu-accent text-vayu-btn-text border-vayu-accent shadow-sm'
                : 'bg-transparent text-vayu-text-secondary border-transparent hover:text-vayu-text'
            }`}
          >
            <Car className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Driving</span>
          </button>
        </div>

        {/* Origin & Destination Inputs with Swap button */}
        <div className="relative space-y-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-vayu-text-secondary block mb-1">
              {t('route.startLocation') || 'Starting Point (Origin)'}
            </label>
            <input
              type="text"
              value={startPoint.name}
              onChange={(e) => setStartPoint((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter start address or landmark..."
              className="w-full py-2.5 px-3.5 rounded-2xl bg-vayu-surface border border-vayu-border text-xs sm:text-sm text-vayu-text focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring"
            />
          </div>

          {/* Swap Button */}
          <div className="flex justify-end -my-1 pr-3">
            <button
              type="button"
              onClick={handleSwap}
              title="Swap start and destination"
              aria-label="Swap start and destination"
              className="p-1.5 rounded-full bg-vayu-surface border border-vayu-border text-vayu-text-secondary hover:text-vayu-text hover:bg-vayu-surface-tint shadow-sm focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring"
            >
              <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-vayu-text-secondary block mb-1">
              {t('route.endLocation') || 'Destination'}
            </label>
            <input
              type="text"
              value={endPoint.name}
              onChange={(e) => setEndPoint((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter destination address..."
              className="w-full py-2.5 px-3.5 rounded-2xl bg-vayu-surface border border-vayu-border text-xs sm:text-sm text-vayu-text focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-2xl bg-vayu-accent text-vayu-btn-text text-xs sm:text-sm font-black shadow-lg hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Search className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>Analyzing Atmospheric Exposure...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>{t('route.findCleanest') || 'Find Cleanest Route'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
