import React from 'react';
import { useMap } from 'react-leaflet';
import { Plus, Minus, RotateCcw } from 'lucide-react';

export interface MapControlsProps {
  initialCenter: [number, number];
  initialZoom: number;
}

export const MapControls: React.FC<MapControlsProps> = ({ initialCenter, initialZoom }) => {
  const map = useMap();

  return (
    <div
      role="group"
      aria-label="Map view controls"
      className="flex flex-col gap-1.5 p-1 rounded-2xl bg-vayu-surface/90 backdrop-blur-md border border-vayu-border shadow-lg"
    >
      <button
        type="button"
        onClick={() => map.zoomIn()}
        aria-label="Zoom In"
        title="Zoom In"
        className="p-2 rounded-xl text-vayu-text hover:bg-vayu-surface-tint focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring transition-colors"
      >
        <Plus className="w-4 h-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => map.zoomOut()}
        aria-label="Zoom Out"
        title="Zoom Out"
        className="p-2 rounded-xl text-vayu-text hover:bg-vayu-surface-tint focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring transition-colors border-t border-b border-vayu-border-subtle"
      >
        <Minus className="w-4 h-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => map.flyTo(initialCenter, initialZoom, { duration: 1.2 })}
        aria-label="Reset View"
        title="Reset View"
        className="p-2 rounded-xl text-vayu-text hover:bg-vayu-surface-tint focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring transition-colors"
      >
        <RotateCcw className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
};

