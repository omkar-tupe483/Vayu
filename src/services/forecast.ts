import { CityLocation } from '../constants/cities';
import {
  openMeteoForecastSchema,
  CleanForecastModel,
  HourlyForecastPoint,
} from '../schemas/forecastSchema';

const AIR_QUALITY_BASE_URL = 'https://api.open-meteo.com/v1/air-quality';

export async function fetchAirQualityForecast(
  city: CityLocation,
  signal?: AbortSignal
): Promise<CleanForecastModel> {
  const url = `${AIR_QUALITY_BASE_URL}?latitude=${city.latitude}&longitude=${city.longitude}&hourly=pm2_5,pm10,ozone,nitrogen_dioxide,us_aqi&timezone=auto&forecast_days=3`;

  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Open-Meteo Forecast error (Status: ${res.status})`);
  }

  const rawJson = await res.json();
  const parsed = openMeteoForecastSchema.parse(rawJson);
  const hourly = parsed.hourly;

  const nowEpoch = Date.now();
  const allPoints: HourlyForecastPoint[] = hourly.time.map((isoTime, idx) => {
    const pointDate = new Date(isoTime);
    const timestamp = pointDate.getTime();
    const hourLabel = pointDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const fullLabel = pointDate.toLocaleDateString([], { weekday: 'short', hour: 'numeric' });

    return {
      time: isoTime,
      hourLabel,
      fullLabel,
      timestamp,
      us_aqi: Math.round(hourly.us_aqi[idx] ?? 0),
      pm2_5: Number((hourly.pm2_5[idx] ?? 0).toFixed(1)),
      pm10: Number((hourly.pm10[idx] ?? 0).toFixed(1)),
      ozone: Number((hourly.ozone[idx] ?? 0).toFixed(1)),
      nitrogen_dioxide: Number((hourly.nitrogen_dioxide[idx] ?? 0).toFixed(1)),
    };
  });

  // Find index of the current or most recent past hour
  let startIndex = allPoints.findIndex((p) => p.timestamp >= nowEpoch - 3599000);
  if (startIndex === -1) startIndex = 0;

  // Slice next 24 continuous hours
  const next24 = allPoints.slice(startIndex, startIndex + 24);
  if (next24[0]) {
    next24[0].isCurrentHour = true;
  }

  // Calculate highest & lowest points
  let minAqiPoint = next24[0] || allPoints[0]!;
  let maxAqiPoint = next24[0] || allPoints[0]!;

  next24.forEach((pt) => {
    if (pt.us_aqi < minAqiPoint.us_aqi) minAqiPoint = pt;
    if (pt.us_aqi > maxAqiPoint.us_aqi) maxAqiPoint = pt;
  });

  return {
    city: city.name,
    timezone: parsed.timezone || city.timezone,
    hourly: next24,
    minAqi: minAqiPoint.us_aqi,
    maxAqi: maxAqiPoint.us_aqi,
    minAqiPoint,
    maxAqiPoint,
  };
}

