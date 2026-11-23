import React, { useEffect, useRef } from 'react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../contexts/ThemeContext';
import { CleanAirQualityModel } from '../../schemas/airQualitySchema';
import { getAqiCategory, AQI_CATEGORIES } from '../../constants/aqi';
import { Map as MapIcon, Crosshair, Layers, Info } from 'lucide-react';
import L from 'leaflet';

export interface AQIMapProps {
  data: CleanAirQualityModel;
  className?: string;
}

export const AQIMap: React.FC<AQIMapProps> = ({ data, className = '' }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const category = getAqiCategory(data.us_aqi);
  const variant = isDark ? category.dark : category.light;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [data.latitude, data.longitude],
        zoom: 11,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapInstanceRef.current = map;

      // Invalidate size once rendered
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [data.latitude, data.longitude]);

  // Update marker and center smoothly when city changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const latLng: [number, number] = [data.latitude, data.longitude];
    map.flyTo(latLng, 11, { duration: 1.2 });

    const markerColor = variant.dot;

    // Custom pulse marker with AQI number
    const customIcon = L.divIcon({
      className: 'vayu-custom-marker',
      html: `
        <div style="position: relative; width: 44px; height: 52px; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          <span style="position: absolute; top: 0; left: 2px; width: 40px; height: 40px; border-radius: 9999px; background-color: ${markerColor}; opacity: 0.4; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          <div style="position: relative; width: 40px; height: 40px; border-radius: 9999px; background-color: ${markerColor}; border: 2.5px solid #ffffff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4); display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 900; font-size: 13px; font-family: ui-sans-serif, system-ui, sans-serif;">
            ${data.us_aqi}
          </div>
          <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${markerColor}; margin-top: -1px;"></div>
        </div>
      `,
      iconSize: [44, 52],
      iconAnchor: [22, 52],
      popupAnchor: [0, -50],
    });

    const categoryLabel = t(category.translationKey);
    const categoryAdvice = t(category.adviceTranslationKey);

    const popupHtml = `
      <div style="font-family: inherit; min-width: 240px; padding: 4px;">
        <div style="border-bottom: 1px solid rgba(128,128,128,0.2); padding-bottom: 8px; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <h4 style="margin: 0; font-size: 15px; font-weight: 800; color: var(--vayu-text);">${data.city}</h4>
            <span style="font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 9999px; color: ${variant.text}; background-color: ${variant.bg}; border: 1px solid ${variant.border};">
              ${categoryLabel}
            </span>
          </div>
          <div style="font-size: 11px; color: var(--vayu-text-secondary); margin-top: 2px;">
            ${data.admin1 ? data.admin1 + ' • ' : ''}${data.country || ''}
          </div>
        </div>

        <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 11px; font-weight: 700; color: var(--vayu-text-secondary); text-transform: uppercase;">AQI</span>
          <span style="font-size: 26px; font-weight: 900; color: ${variant.dot};">${data.us_aqi} <span style="font-size: 11px; color: var(--vayu-text-secondary); font-weight: 600;">USAQI</span></span>
        </div>

        <div style="background-color: var(--vayu-surface-tint); border: 1px solid var(--vayu-border-subtle); border-radius: 12px; padding: 8px 10px; margin-bottom: 8px;">
          <div style="font-size: 10px; font-weight: 700; color: var(--vayu-text-secondary); text-transform: uppercase; margin-bottom: 6px;">Main Pollutants</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px;">
            <div style="background: var(--vayu-surface); padding: 4px 6px; border-radius: 8px; border: 1px solid var(--vayu-border);">
              <span style="color: var(--vayu-text-secondary); font-size: 10px;">PM2.5:</span>
              <div style="font-weight: 800; color: var(--vayu-text);">${data.pollutants.pm2_5} ${data.units.pm2_5}</div>
            </div>
            <div style="background: var(--vayu-surface); padding: 4px 6px; border-radius: 8px; border: 1px solid var(--vayu-border);">
              <span style="color: var(--vayu-text-secondary); font-size: 10px;">PM10:</span>
              <div style="font-weight: 800; color: var(--vayu-text);">${data.pollutants.pm10} ${data.units.pm10}</div>
            </div>
            <div style="background: var(--vayu-surface); padding: 4px 6px; border-radius: 8px; border: 1px solid var(--vayu-border);">
              <span style="color: var(--vayu-text-secondary); font-size: 10px;">NO₂:</span>
              <div style="font-weight: 800; color: var(--vayu-text);">${data.pollutants.nitrogen_dioxide} ${data.units.nitrogen_dioxide}</div>
            </div>
            <div style="background: var(--vayu-surface); padding: 4px 6px; border-radius: 8px; border: 1px solid var(--vayu-border);">
              <span style="color: var(--vayu-text-secondary); font-size: 10px;">Ozone:</span>
              <div style="font-weight: 800; color: var(--vayu-text);">${data.pollutants.ozone} ${data.units.ozone}</div>
            </div>
          </div>
        </div>

        <p style="font-size: 10px; color: var(--vayu-text-secondary); margin: 0; line-height: 1.35;">
          ${categoryAdvice}
        </p>
      </div>
    `;

    if (markerRef.current) {
      markerRef.current.setLatLng(latLng);
      markerRef.current.setIcon(customIcon);
      markerRef.current.setPopupContent(popupHtml);
    } else {
      const marker = L.marker(latLng, { icon: customIcon }).addTo(map);
      marker.bindPopup(popupHtml, { maxWidth: 320, className: 'vayu-leaflet-popup' });
      markerRef.current = marker;
    }
  }, [data, category, variant, t]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([data.latitude, data.longitude], 11, { duration: 0.8 });
      if (markerRef.current) {
        markerRef.current.openPopup();
      }
    }
  };

  return (
    <div className={`bg-vayu-surface-elevated border border-vayu-border rounded-3xl overflow-hidden shadow-xl ${className}`}>
      {/* Map Header */}
      <div className="p-4 sm:p-5 border-b border-vayu-border-subtle flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-vayu-surface-tint border border-vayu-border flex items-center justify-center text-vayu-primary">
            <MapIcon className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-vayu-text flex items-center gap-2">
              {t('map.title')}
            </h3>
            <p className="text-xs text-vayu-text-secondary">
              {t('map.subtitle')} • {data.city} ({data.latitude.toFixed(2)}°, {data.longitude.toFixed(2)}°)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRecenter}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-vayu-surface hover:bg-vayu-surface-tint text-vayu-text border border-vayu-border text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring"
        >
          <Crosshair className="w-3.5 h-3.5 text-vayu-accent" aria-hidden="true" />
          <span>{t('map.recenter')}</span>
        </button>
      </div>

      {/* Map Display Viewport */}
      <div className="relative">
        <div
          ref={mapContainerRef}
          className="w-full h-80 sm:h-96 z-10 bg-vayu-bg"
          style={{ minHeight: '340px' }}
        />

        <div className="absolute top-3 right-3 z-20 pointer-events-none hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-vayu-surface/90 backdrop-blur-md border border-vayu-border text-vayu-text text-xs shadow-md">
          <Info className="w-3.5 h-3.5 text-vayu-primary" aria-hidden="true" />
          <span>{t('map.clickHint')}</span>
        </div>

        {/* AQI Scale Legend */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-20 bg-vayu-surface/95 backdrop-blur-md border border-vayu-border rounded-2xl p-2.5 sm:p-3 text-xs shadow-xl max-w-lg">
          <div className="flex items-center gap-1 text-[11px] font-bold text-vayu-text-secondary uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5 text-vayu-primary" aria-hidden="true" />
            <span>{t('map.legend')}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {AQI_CATEGORIES.map((cat) => {
              const catStyle = isDark ? cat.dark : cat.light;
              return (
                <span
                  key={cat.level}
                  style={{
                    backgroundColor: catStyle.bg,
                    borderColor: catStyle.border,
                    color: catStyle.text,
                  }}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold"
                >
                  <span style={{ backgroundColor: catStyle.dot }} className="w-2 h-2 rounded-full" aria-hidden="true" />
                  <span>{t(cat.translationKey)}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
