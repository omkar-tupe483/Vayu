import { AirQualityData } from '../types/airQuality';

export function getAQIStatus(aqi: number): {
  status: AirQualityData['status'];
  colorClass: string;
  badgeBg: string;
  recommendation: string;
} {
  if (aqi <= 50) {
    return {
      status: 'Good',
      colorClass: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      recommendation: 'Air quality is ideal. Enjoy outdoor activities and exercise safely!',
    };
  }
  if (aqi <= 100) {
    return {
      status: 'Moderate',
      colorClass: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      recommendation: 'Air quality is acceptable. Unusually sensitive people should consider reducing prolonged outdoor exertion.',
    };
  }
  if (aqi <= 150) {
    return {
      status: 'Unhealthy for Sensitive Groups',
      colorClass: 'text-orange-400',
      badgeBg: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
      recommendation: 'Members of sensitive groups (asthma, elderly, children) may experience health effects. Wear an N95 mask if outdoors.',
    };
  }
  if (aqi <= 200) {
    return {
      status: 'Unhealthy',
      colorClass: 'text-rose-400',
      badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
      recommendation: 'Everyone may begin to experience health effects. Keep windows closed and turn on indoor air purifiers.',
    };
  }
  if (aqi <= 300) {
    return {
      status: 'Very Unhealthy',
      colorClass: 'text-purple-400',
      badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
      recommendation: 'Health alert: serious risk of harm. Avoid all outdoor physical activities; seal drafts and run HEPA air filters.',
    };
  }
  return {
    status: 'Hazardous',
    colorClass: 'text-red-500',
    badgeBg: 'bg-red-500/10 text-red-300 border-red-500/20',
    recommendation: 'Health warnings of emergency conditions. Stay indoors and use continuous high-efficiency air purification.',
  };
}
