import React, { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CleanAirQualityModel } from '../../schemas/airQualitySchema';
import { getAqiCategory } from '../../constants/aqi';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../i18n';
import { fixLeafletDefaultIcon, createAqiDivIcon } from './mapUtils';
import { MapLegend } from './MapLegend';
import { Clock } from 'lucide-react';

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
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const markerRef = useRef<L.Marker | null>(null);

  const category = getAqiCategory(data.us_aqi);
  const variant = isDark ? category.dark : category.light;

  const centerPosition: [number, number] = [data.latitude, data.longitude];

  const markerIcon = useMemo(() => {
    return createAqiDivIcon(data.us_aqi, variant.dot, variant.dot);
  }, [data.us_aqi, variant.dot]);

  const formattedTime = new Date(data.time).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

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

          <Marker ref={markerRef} position={centerPosition} icon={markerIcon}>
            <Popup className="vayu-leaflet-popup" maxWidth={320}>
              <div className="font-sans min-w-[240px] p-1 space-y-2.5">
                {/* Area name & Category badge */}
                <div className="border-b border-vayu-border-subtle pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-extrabold text-sm sm:text-base text-vayu-text leading-tight">
                      {data.city}
                    </h4>
                    <span
                      style={{
                        backgroundColor: variant.bg,
                        borderColor: variant.border,
                        color: variant.text,
                      }}
                      className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0"
                    >
                      {t(category.translationKey)}
                    </span>
                  </div>
                  <div className="text-[11px] text-vayu-text-secondary mt-0.5">
                    {data.admin1 ? `${data.admin1} • ` : ''}
                    {data.country || ''}
                  </div>
                </div>

                {/* US AQI */}
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] font-bold text-vayu-text-secondary uppercase tracking-wider">
                    {t('aqi.title')}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black" style={{ color: variant.dot }}>
                      {data.us_aqi}
                    </span>
                    <span className="text-[10px] font-semibold text-vayu-text-secondary">
                      US AQI
                    </span>
                  </div>
                </div>

                {/* Pollutant breakdown matrix */}
                <div className="bg-vayu-surface-tint border border-vayu-border-subtle rounded-xl p-2 space-y-1.5">
                  <div className="text-[10px] font-bold text-vayu-text-secondary uppercase tracking-wider">
                    Main Pollutants
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <div className="bg-vayu-surface p-1.5 rounded-lg border border-vayu-border/60">
                      <span className="text-vayu-text-secondary text-[10px]">PM2.5:</span>
                      <div className="font-bold text-vayu-text">
                        {data.pollutants.pm2_5} {data.units.pm2_5}
                      </div>
                    </div>
                    <div className="bg-vayu-surface p-1.5 rounded-lg border border-vayu-border/60">
                      <span className="text-vayu-text-secondary text-[10px]">PM10:</span>
                      <div className="font-bold text-vayu-text">
                        {data.pollutants.pm10} {data.units.pm10}
                      </div>
                    </div>
                    <div className="bg-vayu-surface p-1.5 rounded-lg border border-vayu-border/60">
                      <span className="text-vayu-text-secondary text-[10px]">Ozone:</span>
                      <div className="font-bold text-vayu-text">
                        {data.pollutants.ozone} {data.units.ozone}
                      </div>
                    </div>
                    <div className="bg-vayu-surface p-1.5 rounded-lg border border-vayu-border/60">
                      <span className="text-vayu-text-secondary text-[10px]">NO₂:</span>
                      <div className="font-bold text-vayu-text">
                        {data.pollutants.nitrogen_dioxide} {data.units.nitrogen_dioxide}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health advice snippet */}
                <p className="text-[11px] text-vayu-text-secondary leading-snug">
                  {t(category.adviceTranslationKey)}
                </p>

                {/* Last updated footer */}
                <div className="text-[10px] text-vayu-text-secondary pt-1 border-t border-vayu-border-subtle flex items-center justify-between">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    <span>
                      {t('aqi.measuredAt')}: {formattedTime}
                    </span>
                  </span>
                  <span className="italic font-mono text-[9px] opacity-75">Open-Meteo</span>
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-20 pointer-events-auto">
          <MapLegend />
        </div>
      </div>
    </div>
  );
};

export default AirQualityMap;
