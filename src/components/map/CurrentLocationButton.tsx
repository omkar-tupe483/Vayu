import React, { useState } from 'react';
import { useCity } from '../../contexts/CityContext';
import { useToast } from '../ui/toastContext';
import { Navigation, Loader2 } from 'lucide-react';

export const CurrentLocationButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { setCity } = useCity();
  const { addToast } = useToast();
  const [isLocating, setIsLocating] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      addToast({
        title: 'Geolocation Unsupported',
        message: 'Your browser does not support automatic location detection.',
        type: 'error',
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        setCity({
          id: Date.now(),
          name: 'My Location',
          latitude,
          longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
          country: 'Current Coordinates',
          admin1: `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`,
        });
        addToast({
          title: 'Location Detected',
          message: `Coordinates locked: ${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
          type: 'success',
        });
      },
      (error) => {
        setIsLocating(false);
        let message = 'Unable to retrieve location.';
        if (error.code === error.PERMISSION_DENIED) {
          message = 'Location permission was denied. Please enable permission in browser settings.';
        } else if (error.code === error.TIMEOUT) {
          message = 'Location request timed out. Please try again.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = 'Location information is currently unavailable.';
        }
        addToast({
          title: 'Location Failed',
          message,
          type: 'warning',
        });
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  return (
    <button
      type="button"
      onClick={handleGetLocation}
      disabled={isLocating}
      aria-label="Use Current Location"
      title="Use Current Location"
      className={`p-2 rounded-2xl bg-vayu-surface/90 backdrop-blur-md border border-vayu-border text-vayu-text shadow-lg hover:bg-vayu-surface-tint focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring transition-all disabled:opacity-50 ${className}`}
    >
      {isLocating ? (
        <Loader2 className="w-4 h-4 animate-spin text-vayu-primary" aria-hidden="true" />
      ) : (
        <Navigation className="w-4 h-4 text-vayu-primary" aria-hidden="true" />
      )}
    </button>
  );
};

