import React, { useState } from 'react';
import { LocateFixed, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useToast } from '../ui/toastContext';

export interface CurrentLocationButtonProps {
  onSelectLocation: (lat: number, lon: number, name: string) => void;
  className?: string;
  variant?: 'compact' | 'full';
}

export const CurrentLocationButton: React.FC<CurrentLocationButtonProps> = ({
  onSelectLocation,
  className = '',
  variant = 'compact',
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLocating, setIsLocating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGetLocation = () => {
    setErrorMessage(null);

    if (typeof window === 'undefined' || !navigator.geolocation) {
      const msg = t('map.geoUnsupported');
      setErrorMessage(msg);
      toast({
        title: 'Geolocation Error',
        message: msg,
        type: 'warning',
      });
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setErrorMessage(null);
        const { latitude, longitude } = pos.coords;
        onSelectLocation(latitude, longitude, t('map.myLocation'));
        toast({
          title: t('map.myLocation'),
          message: `${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E`,
          type: 'success',
        });
      },
      (err) => {
        setIsLocating(false);
        let msg = t('map.geoUnavailable');

        if (err.code === err.PERMISSION_DENIED) {
          msg = t('map.geoDenied');
        } else if (err.code === err.TIMEOUT) {
          msg = t('map.geoTimeout');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = t('map.geoUnavailable');
        }

        setErrorMessage(msg);
        toast({
          title: 'Location Notice',
          message: msg,
          type: 'warning',
        });
      },
      {
        timeout: 10000,
        enableHighAccuracy: false,
        maximumAge: 60000,
      }
    );
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleGetLocation}
        disabled={isLocating}
        aria-label={t('map.currentLocation')}
        title={t('map.currentLocation')}
        className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-vayu-border bg-vayu-surface hover:bg-vayu-surface-tint text-vayu-text text-xs font-bold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring ${
          variant === 'full' ? 'px-3 py-2 w-full' : 'p-2'
        }`}
      >
        {isLocating ? (
          <Loader2 className="w-4 h-4 text-vayu-primary animate-spin" aria-hidden="true" />
        ) : (
          <LocateFixed className="w-4 h-4 text-vayu-accent shrink-0" aria-hidden="true" />
        )}
        {variant === 'full' && (
          <span>{isLocating ? t('map.locating') : t('map.currentLocation')}</span>
        )}
      </button>

      {/* Accessible Inline Error Message */}
      {errorMessage && (
        <div
          role="alert"
          className="absolute right-0 top-full mt-2 w-64 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-800 dark:text-amber-200 text-xs font-medium shadow-xl z-30 flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
          <span className="flex-1">{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-xs font-bold opacity-70 hover:opacity-100"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};
