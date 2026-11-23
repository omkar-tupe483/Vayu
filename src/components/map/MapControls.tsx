import React from 'react';
import { useMap } from 'react-leaflet';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { CurrentLocationButton } from './CurrentLocationButton';

export interface MapControlsProps {
  initialCenter: [number, number];
  initialZoom?: number;
  onSelectCoordinates?: (lat: number, lon: number, name: string) => void;
  className?: string;
}

export const MapControls: React.FC<MapControlsProps> = ({
  initialCenter,
  initialZoom = 11,
  onSelectCoordinates,
  className = '',
}) => {
  const map = useMap();
  const { t } = useTranslation();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleResetView = () => {
    map.flyTo(initialCenter, initialZoom, { duration: 0.8 });
  };

  return (
    <div
      role="toolbar"
      aria-label="Map navigation controls"
      className={`absolute top-3 right-3 z-20 flex flex-col bg-vayu-surface/95 dark:bg-vayu-surface/95 backdrop-blur-md border border-vayu-border rounded-2xl shadow-xl overflow-hidden pointer-events-auto divide-y divide-vayu-border-subtle ${className}`}
    >
      {/* Zoom In */}
      <button
        type="button"
        onClick={handleZoomIn}
        aria-label={t('map.zoomIn')}
        title={t('map.zoomIn')}
        className="p-2.5 text-vayu-text hover:text-vayu-primary hover:bg-vayu-surface-tint transition focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring focus:z-10"
      >
        <Plus className="w-4 h-4" aria-hidden="true" />
      </button>

      {/* Zoom Out */}
      <button
        type="button"
        onClick={handleZoomOut}
        aria-label={t('map.zoomOut')}
        title={t('map.zoomOut')}
        className="p-2.5 text-vayu-text hover:text-vayu-primary hover:bg-vayu-surface-tint transition focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring focus:z-10"
      >
        <Minus className="w-4 h-4" aria-hidden="true" />
      </button>

      {/* Reset View */}
      <button
        type="button"
        onClick={handleResetView}
        aria-label={t('map.resetView')}
        title={t('map.resetView')}
        className="p-2.5 text-vayu-text hover:text-vayu-accent hover:bg-vayu-surface-tint transition focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring focus:z-10"
      >
        <RotateCcw className="w-4 h-4" aria-hidden="true" />
      </button>

      {/* Geolocation Current Location Button */}
      {onSelectCoordinates && (
        <CurrentLocationButton
          onSelectLocation={onSelectCoordinates}
          className="p-0.5"
        />
      )}
    </div>
  );
};

