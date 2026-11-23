import L from 'leaflet';
import { getAqiCategory } from '../../constants/aqi';

/**
 * Creates a custom Leaflet divIcon colored by AQI category.
 * Includes a gentle pulse ring (disabled under reduced motion via CSS).
 * Fixes Vite asset bundling issues with default Leaflet images.
 */
export function createAqiDivIcon(aqi: number, isDark = false): L.DivIcon {
  const category = getAqiCategory(aqi);
  const style = isDark ? category.dark : category.light;

  const html = `
    <div style="position: relative; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; inset: 0; border-radius: 9999px; background-color: ${style.dot}; opacity: 0.35; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;" class="vayu-pulse-ring"></div>
      <div style="position: relative; z-index: 10; width: 36px; height: 36px; border-radius: 9999px; background-color: ${style.bg}; border: 2.5px solid ${style.dot}; color: ${style.text}; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.25); font-weight: 900; font-family: monospace; font-size: 13px; line-height: 1;">
        <span>${aqi}</span>
        <span style="font-size: 7px; text-transform: uppercase; opacity: 0.85; font-family: sans-serif;">AQI</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'vayu-custom-marker',
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -22],
  });
}

