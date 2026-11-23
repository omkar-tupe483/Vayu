import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CleanAirQualityModel } from '../../schemas/airQualitySchema';
import { createAqiDivIcon } from './mapUtils';
import { MapControls } from './MapControls';
import { MapLegend } from './MapLegend';
import { CurrentLocationButton } from './CurrentLocationButton';
import { getAqiCategory } from '../../constants/aqi';
import { useTheme } from '../../contexts/useTheme';
import { useTranslation } from '../../contexts/LanguageContext';
import { Clock, Sparkles } from 'lucide-react';

interface MapUpdaterProps {
  center: [number, number];
  zoom: number;
}

const MapUpdater: React.FC<MapUpdaterProps> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

export interface AirQualityMapProps {
  data: CleanAirQualityModel;
  className?: string;
}

export const AirQualityMap: React.FC<AirQualityMapProps> = ({ data, className = '' }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const markerRef = useRef<L.Marker>(null);

  const center: [number, number] = [data.latitude, data.longitude];
  const zoom = 11;
  const category = getAqiCategory(data.us_aqi);
  const aqiStyle = isDark ? category.dark : category.light;
  const markerIcon = createAqiDivIcon(data.us_aqi, isDark);

  const formattedTime = new Date(data.time).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`relative w-full h-[360px] sm:h-[440px] rounded-3xl overflow-hidden border border-vayu-border shadow-xl ${className}`}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', minHeight: '360px' }}
        className="w-full h-full z-0"
      >
        {/* OpenStreetMap Tiles (No API key needed) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapUpdater center={center} zoom={zoom} />

        {/* Custom AQI DivIcon Marker */}
        <Marker ref={markerRef} position={center} icon={markerIcon}>
          <Popup className="vayu-map-popup">
            <div className="p-1 space-y-2 text-xs font-sans">
              <div className="pb-1.5 border-b border-gray-200">
                <h4 className="font-black text-sm text-gray-900">{data.city}</h4>
                <p className="text-[11px] text-gray-600">
                  {data.admin1 ? `${data.admin1}, ` : ''}{data.country}
                </p>
              </div>

              <div
                style={{ backgroundColor: aqiStyle.bg, color: aqiStyle.text, borderColor: aqiStyle.border }}
                className="p-2 rounded-xl border flex items-center justify-between font-bold"
              >
                <span>{t(category.translationKey)}</span>
                <span className="font-black text-sm font-mono">AQI {data.us_aqi}</span>
              </div>

              {/* Pollutants mini breakdown */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-gray-700">
                <div className="p-1 rounded bg-gray-50 border border-gray-100">
                  <span className="font-bold">PM2.5:</span> {data.pollutants.pm2_5.value} μg
                </div>
                <div className="p-1 rounded bg-gray-50 border border-gray-100">
                  <span className="font-bold">PM10:</span> {data.pollutants.pm10.value} μg
                </div>
                <div className="p-1 rounded bg-gray-50 border border-gray-100">
                  <span className="font-bold">O₃:</span> {data.pollutants.ozone.value} μg
                </div>
                <div className="p-1 rounded bg-gray-50 border border-gray-100">
                  <span className="font-bold">NO₂:</span> {data.pollutants.nitrogen_dioxide.value} μg
                </div>
              </div>

              <div className="pt-1 border-t border-gray-100 text-[10px] text-gray-500 flex items-center justify-between">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formattedTime}</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Open-Meteo</span>
                </span>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Floating Map Custom Accessible Controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <CurrentLocationButton />
        <MapControls initialCenter={center} initialZoom={zoom} />
      </div>

      {/* Bottom Floating Legend */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-10 max-w-md">
        <MapLegend />
      </div>
    </div>
  );
};

export default AirQualityMap;
