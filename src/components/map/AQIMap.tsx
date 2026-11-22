import React, { useEffect, useRef } from 'react';
import { useTranslation } from '../../i18n';
import { CleanAirQualityModel } from '../../schemas/airQualitySchema';
import { getAQICategory, AQI_SCALE } from '../../constants/aqi';
import { Map as MapIcon, Crosshair, Layers, Info } from 'lucide-react';
import L from 'leaflet';

interface AQIMapProps {
  data: CleanAirQualityModel;
}

export const AQIMap: React.FC<AQIMapProps> = ({ data }) => {
  const { t } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Single source of truth for AQI category & colors
  const category = getAQICategory(data.us_aqi);

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
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [data.latitude, data.longitude]);

  // Update marker and center smoothly on city change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const latLng: [number, number] = [data.latitude, data.longitude];
    map.flyTo(latLng, 11, { duration: 1.2 });

    const markerColor = category.hex;

    // Custom styled divIcon
    const customIcon = L.divIcon({
      className: 'vayu-custom-marker',
      html: `
        <div style="position: relative; width: 44px; height: 52px; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          <span style="position: absolute; top: 0; left: 2px; width: 40px; height: 40px; border-radius: 9999px; background-color: ${markerColor}; opacity: 0.5; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          <div style="position: relative; width: 40px; height: 40px; border-radius: 9999px; background-color: ${markerColor}; border: 2.5px solid #ffffff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 900; font-size: 13px; font-family: ui-sans-serif, system-ui, sans-serif;">
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
      <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 230px; padding: 2px;">
        <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <h4 style="margin: 0; font-size: 15px; font-weight: 700; color: #0f172a;">${data.city}</h4>
            <span style="font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 9999px; color: #ffffff; background-color: ${markerColor}; text-transform: uppercase;">
              ${categoryLabel}
            </span>
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            ${data.admin1 ? data.admin1 + ' • ' : ''}${data.country || ''}
          </div>
        </div>

        <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase;">AQI</span>
          <span style="font-size: 24px; font-weight: 900; color: ${markerColor};">${data.us_aqi} <span style="font-size: 11px; color: #64748b;">US AQI</span></span>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 10px; margin-bottom: 8px;">
          <div style="font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 6px;">Main Pollutants</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px;">
            <div style="background: #ffffff; padding: 4px 6px; border-radius: 6px; border: 1px solid #cbd5e1;">
              <span style="color: #64748b; font-size: 10px;">PM2.5:</span>
              <div style="font-weight: 700; color: #0f172a;">${data.pollutants.pm2_5} ${data.units.pm2_5}</div>
            </div>
            <div style="background: #ffffff; padding: 4px 6px; border-radius: 6px; border: 1px solid #cbd5e1;">
              <span style="color: #64748b; font-size: 10px;">PM10:</span>
              <div style="font-weight: 700; color: #0f172a;">${data.pollutants.pm10} ${data.units.pm10}</div>
            </div>
            <div style="background: #ffffff; padding: 4px 6px; border-radius: 6px; border: 1px solid #cbd5e1;">
              <span style="color: #64748b; font-size: 10px;">NO₂:</span>
              <div style="font-weight: 700; color: #0f172a;">${data.pollutants.nitrogen_dioxide} ${data.units.nitrogen_dioxide}</div>
            </div>
            <div style="background: #ffffff; padding: 4px 6px; border-radius: 6px; border: 1px solid #cbd5e1;">
              <span style="color: #64748b; font-size: 10px;">Ozone:</span>
              <div style="font-weight: 700; color: #0f172a;">${data.pollutants.ozone} ${data.units.ozone}</div>
            </div>
          </div>
        </div>

        <p style="font-size: 10px; color: #475569; margin: 0; line-height: 1.35;">
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
  }, [data, category, t]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([data.latitude, data.longitude], 11, { duration: 0.8 });
      if (markerRef.current) {
        markerRef.current.openPopup();
      }
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
      <div className="p-5 md:p-6 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <MapIcon className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              {t('map.title')}
            </h3>
            <p className="text-xs text-slate-400">
              {t('map.subtitle')} • {data.city} ({data.latitude.toFixed(2)}°, {data.longitude.toFixed(2)}°)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRecenter}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <Crosshair className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />
          <span>{t('map.recenter')}</span>
        </button>
      </div>

      <div className="relative">
        <div
          ref={mapContainerRef}
          className="w-full h-80 md:h-96 z-10 bg-slate-950"
          style={{ minHeight: '340px' }}
        />

        <div className="absolute top-3 right-3 z-20 pointer-events-none hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/70 text-slate-300 text-xs shadow-lg">
          <Info className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />
          <span>{t('map.clickHint')}</span>
        </div>

        {/* AQI Scale Legend from Single Source of Truth */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 text-xs shadow-2xl">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <Layers className="w-3 h-3 text-teal-400" aria-hidden="true" />
            <span>{t('map.legend')}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {AQI_SCALE.map((scaleItem) => (
              <span
                key={scaleItem.level}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-semibold ${scaleItem.badgeBg} ${scaleItem.badgeBorder} ${scaleItem.textColor}`}
              >
                <span className={`w-2 h-2 rounded-full ${scaleItem.dotColor}`} aria-hidden="true" />
                {t(scaleItem.translationKey)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
