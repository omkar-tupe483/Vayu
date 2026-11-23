import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

/**
 * Fix default Leaflet marker icon asset paths in bundler environments
 */
export function fixLeafletDefaultIcon(): void {
  delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });
}

/**
 * Custom DivIcon generator using AQI single-source colors
 */
export function createAqiDivIcon(aqi: number, colorHex: string, dotColor: string): L.DivIcon {
  return L.divIcon({
    className: 'vayu-custom-marker',
    html: `
      <div style="position: relative; width: 44px; height: 52px; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <span style="position: absolute; top: 0; left: 2px; width: 40px; height: 40px; border-radius: 9999px; background-color: ${dotColor}; opacity: 0.4; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <div style="position: relative; width: 40px; height: 40px; border-radius: 9999px; background-color: ${colorHex}; border: 2.5px solid #ffffff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4); display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 900; font-size: 13px; font-family: ui-sans-serif, system-ui, sans-serif;">
          ${aqi}
        </div>
        <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${colorHex}; margin-top: -1px;"></div>
      </div>
    `,
    iconSize: [44, 52],
    iconAnchor: [22, 52],
    popupAnchor: [0, -50],
  });
}
