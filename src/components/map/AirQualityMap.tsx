import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { CleanAirQualityModel } from '../../schemas/airQualitySchema';
import { getAqiCategory } from '../../constants/aqi';
import { useTheme } from '../../contexts/ThemeContext';
import { fixLeafletDefaultIcon, createAqiDivIcon } from './mapUtils';

// Fix default Leaflet marker icons
fixLeafletDefaultIcon();

export interface AirQualityMapProps {
  data: CleanAirQualityModel;
  className?: string;
  onSelectCoordinates?: (lat: number, lon: number, name: string) => void;
}

// Controller component to smoothly fly the map when coordinates change
export const MapController: React.FC<{ center: [number, number]; zoom?: number }> = ({
  center,
  zoom = 11,
}) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);

  return null;
};

export const AirQualityMap: React.FC<AirQualityMapProps> = ({ data, className = '' }) => {
  const { isDark } = useTheme();
  const category = getAqiCategory(data.us_aqi);
  const variant = isDark ? category.dark : category.light;

  const centerPosition: [number, number] = [data.latitude, data.longitude];

  const markerIcon = useMemo(() => {
    return createAqiDivIcon(data.us_aqi, variant.dot, variant.dot);
  }, [data.us_aqi, variant.dot]);

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-vayu-border bg-vayu-surface-elevated shadow-xl ${className}`}
    >
      <div className="relative h-80 sm:h-96 md:h-[420px] w-full">
        <MapContainer
          center={centerPosition}
          zoom={11}
          scrollWheelZoom={false}
          zoomControl={false}
          className="w-full h-full z-10"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          <MapController center={centerPosition} zoom={11} />
          <Marker position={centerPosition} icon={markerIcon} />
        </MapContainer>
      </div>
    </div>
  );
};

export default AirQualityMap;
