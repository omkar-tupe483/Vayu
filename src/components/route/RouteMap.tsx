import React, { useEffect, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EvaluatedRoute } from '../../utils/routeExposure';
import { getAqiCategory } from '../../constants/aqi';
import { useTheme } from '../../contexts/useTheme';

export interface RouteMapProps {
  routes: EvaluatedRoute[];
  selectedRouteId: string | null;
  onSelectRoute?: (id: string) => void;
  className?: string;
}

// Custom Leaflet DivIcons for Start and Destination Pins
const startIcon = L.divIcon({
  className: 'vayu-route-pin',
  html: `<div style="background-color: #22C55E; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 11px; border: 2.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.35);">A</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const endIcon = L.divIcon({
  className: 'vayu-route-pin',
  html: `<div style="background-color: #FFCBA4; color: #1E2A44; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 11px; border: 2.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.35);">B</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function createWaypointIcon(aqi: number, isDark: boolean) {
  const cat = getAqiCategory(aqi);
  const style = isDark ? cat.dark : cat.light;
  return L.divIcon({
    className: 'vayu-waypoint-pin',
    html: `<div style="background-color: ${style.dot}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.35);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

const FitBoundsHandler: React.FC<{ routes: EvaluatedRoute[] }> = ({ routes }) => {
  const map = useMap();

  useEffect(() => {
    if (routes.length === 0) return;
    const allPoints = routes.flatMap((r) => r.coordinates);
    if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints.map(([lat, lng]) => [lat, lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [routes, map]);

  return null;
};

export const RouteMap: React.FC<RouteMapProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  className = '',
}) => {
  const { isDark } = useTheme();

  const selectedRoute = useMemo(
    () => routes.find((r) => r.id === selectedRouteId) || routes[0],
    [routes, selectedRouteId]
  );

  const startCoord = selectedRoute?.coordinates[0] || [18.5284, 73.8743];
  const endCoord =
    selectedRoute?.coordinates[selectedRoute.coordinates.length - 1] || [18.5074, 73.8077];

  return (
    <div
      tabIndex={0}
      aria-label="Clean Route Navigation Map"
      className={`relative w-full h-[380px] sm:h-[460px] rounded-3xl overflow-hidden border border-vayu-border shadow-2xl focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring ${className}`}
    >
      <MapContainer
        center={[startCoord[0], startCoord[1]]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', minHeight: '380px' }}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBoundsHandler routes={routes} />

        {/* Start & End Point Markers */}
        <Marker position={[startCoord[0], startCoord[1]]} icon={startIcon}>
          <Popup>
            <div className="text-xs font-bold text-gray-900 p-1">
              <span>Start (Origin)</span>
            </div>
          </Popup>
        </Marker>

        <Marker position={[endCoord[0], endCoord[1]]} icon={endIcon}>
          <Popup>
            <div className="text-xs font-bold text-gray-900 p-1">
              <span>Destination</span>
            </div>
          </Popup>
        </Marker>

        {/* Polylines for Routes */}
        {routes.map((route) => {
          const isSelected = route.id === selectedRoute?.id;
          const routeColor = route.isCleanest
            ? '#10B981' // Green
            : route.isFastest
            ? '#3B82F6' // Blue
            : '#8B5CF6'; // Purple

          return (
            <Polyline
              key={route.id}
              positions={route.coordinates}
              pathOptions={{
                color: routeColor,
                weight: isSelected ? 7 : 4,
                opacity: isSelected ? 0.95 : 0.45,
                lineCap: 'round',
                lineJoin: 'round',
              }}
              eventHandlers={{
                click: () => onSelectRoute?.(route.id),
              }}
            />
          );
        })}

        {/* Sample Waypoint AQI Dots along Selected Route */}
        {selectedRoute?.samplePoints.map((pt, idx) => (
          <Marker
            key={`wpt-${idx}`}
            position={[pt.latitude, pt.longitude]}
            icon={createWaypointIcon(pt.aqi, isDark)}
          >
            <Popup>
              <div className="p-1 space-y-1 text-xs text-gray-900">
                <span className="font-bold block">Waypoint #{idx + 1}</span>
                <span className="font-mono font-black text-sm block">AQI {pt.aqi}</span>
                {pt.pm2_5 && <span className="text-[11px] block text-gray-600">PM2.5: {pt.pm2_5} µg/m³</span>}
                <span className="text-[10px] block text-gray-500">{pt.distanceFromStartKm.toFixed(1)} km from start</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute top-4 right-4 z-[400] p-3 rounded-2xl bg-white/90 dark:bg-black/80 backdrop-blur-md border border-black/10 dark:border-white/10 text-xs space-y-1.5 shadow-lg pointer-events-auto">
        <span className="text-[10px] font-black uppercase tracking-wider text-vayu-text-secondary block">
          Routes
        </span>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 rounded-full bg-emerald-500" />
          <span className="font-bold text-vayu-text">Cleanest Route</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 rounded-full bg-blue-500" />
          <span className="font-bold text-vayu-text">Fastest Route</span>
        </div>
      </div>
    </div>
  );
};

export default RouteMap;
