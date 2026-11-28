import type { JSX } from 'preact';
import { AQIBandInfo } from '../../types';

export function getAQIBandInfo(aqi: number): AQIBandInfo {
  if (aqi <= 50) {
    return {
      category: 'Good',
      shape: 'Circle',
      symbol: '●',
      label: 'Good Air',
      headline: 'Safe for all activities. Ideal for opening windows.',
      colorName: 'powder-blue',
    };
  }
  if (aqi <= 100) {
    return {
      category: 'Moderate',
      shape: 'Triangle',
      symbol: '▲',
      label: 'Moderate',
      headline: 'Acceptable air. Very sensitive people should monitor breathing.',
      colorName: 'lavender',
    };
  }
  if (aqi <= 150) {
    return {
      category: 'Unhealthy for Sensitive',
      shape: 'Diamond',
      symbol: '◆',
      label: 'Sensitive Warning',
      headline: 'Children, elders, and asthmatics should reduce heavy outdoor exertion.',
      colorName: 'sunset-peach',
    };
  }
  if (aqi <= 200) {
    return {
      category: 'Unhealthy',
      shape: 'Pentagon',
      symbol: '⬟',
      label: 'Unhealthy',
      headline: 'Everyone may experience irritation. Sensitive groups stay indoors.',
      colorName: 'amber',
    };
  }
  if (aqi <= 300) {
    return {
      category: 'Very Unhealthy',
      shape: 'Hexagon',
      symbol: '⬢',
      label: 'Very Unhealthy',
      headline: 'Health alert: Serious risk of respiratory irritation for all.',
      colorName: 'rose',
    };
  }
  return {
    category: 'Hazardous',
    shape: 'Octagon',
    symbol: '🛑',
    label: 'Hazardous Emergency',
    headline: 'Emergency conditions: Entire population likely affected. Seal indoors.',
    colorName: 'maroon',
  };
}

interface AQISeverityBadgeProps {
  aqi: number;
  showDetails?: boolean;
}

export function AQISeverityBadge({ aqi, showDetails = false }: AQISeverityBadgeProps): JSX.Element {
  const band = getAQIBandInfo(aqi);

  return (
    <div
      role="status"
      aria-label={`Air quality index ${aqi}, rating: ${band.label}, shape indicator: ${band.shape}`}
      class="inline-flex items-center gap-2"
    >
      <span class={`badge badge-${band.colorName === 'powder-blue' ? 'blue' : band.colorName === 'lavender' ? 'lavender' : 'peach'}`}>
        <span aria-hidden="true" style={{ fontSize: '1rem', lineHeight: 1 }}>{band.symbol}</span>
        <span>{band.label} (AQI {aqi})</span>
      </span>
      {showDetails && (
        <span class="sr-only">
          Shape indicator: {band.shape}. {band.headline}
        </span>
      )}
    </div>
  );
}
