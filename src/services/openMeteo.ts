import { openMeteoGeocodingSchema, GeoCityItem } from '../schemas/geocodingSchema';
import { openMeteoAirQualitySchema, CleanAirQualityModel } from '../schemas/airQualitySchema';
import { openMeteoForecastSchema, CleanForecastModel, HourlyForecastPoint } from '../schemas/forecastSchema';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const AIR_QUALITY_BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

/**
 * Safe fetch with AbortController timeout
 */
async function fetchWithTimeout(url: string, timeoutMs: number = 8000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection.');
    }
    throw err;
  }
}

export const openMeteoService = {
  /**
   * Search for cities worldwide using Open-Meteo Geocoding API.
   * Validates response strictly with Zod.
   */
  async searchCities(rawQuery: string, count: number = 5): Promise<GeoCityItem[]> {
    // Sanitize and limit query length
    const query = rawQuery.trim().slice(0, 100);
    if (query.length < 2) {
      return [];
    }

    const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(query)}&count=${count}&language=en&format=json`;

    const response = await fetchWithTimeout(url);
    if (!response.ok) {
      throw new Error(`Geocoding error (${response.status}): ${response.statusText}`);
    }

    const jsonUnknown: unknown = await response.json();
    const parsed = openMeteoGeocodingSchema.safeParse(jsonUnknown);

    if (!parsed.success) {
      console.error('Zod schema validation failed for geocoding:', parsed.error);
      throw new Error('Received unexpected geocoding data format.');
    }

    return parsed.data.results ?? [];
  },

  /**
   * Fetch current air quality metrics for a given city location.
   * Validates response strictly with Zod.
   */
  async fetchAirQuality(city: GeoCityItem): Promise<CleanAirQualityModel> {
    const url = `${AIR_QUALITY_BASE_URL}?latitude=${city.latitude}&longitude=${city.longitude}&current=pm2_5,pm10,ozone,nitrogen_dioxide,us_aqi`;

    const response = await fetchWithTimeout(url);
    if (!response.ok) {
      throw new Error(`Air Quality API error (${response.status}): ${response.statusText}`);
    }

    const jsonUnknown: unknown = await response.json();
    const parsed = openMeteoAirQualitySchema.safeParse(jsonUnknown);

    if (!parsed.success) {
      console.error('Zod schema validation failed for air quality:', parsed.error);
      throw new Error('Received unexpected air quality data format.');
    }

    const { current, current_units } = parsed.data;

    return {
      city: city.name,
      admin1: city.admin1,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
      time: current.time,
      us_aqi: Math.round(current.us_aqi),
      pollutants: {
        pm2_5: current.pm2_5,
        pm10: current.pm10,
        ozone: current.ozone,
        nitrogen_dioxide: current.nitrogen_dioxide,
      },
      units: {
        pm2_5: current_units?.pm2_5 ?? 'μg/m³',
        pm10: current_units?.pm10 ?? 'μg/m³',
        ozone: current_units?.ozone ?? 'μg/m³',
        nitrogen_dioxide: current_units?.nitrogen_dioxide ?? 'μg/m³',
        us_aqi: current_units?.us_aqi ?? 'USAQI',
      },
      isModelledEstimate: true,
    };
  },

  /**
   * Fetch 24-hour air quality forecast for a city in its local timezone.
   * Filters and formats the next 24 hours starting from the current hour.
   */
  async fetchHourlyForecast(city: GeoCityItem): Promise<CleanForecastModel> {
    const url = `${AIR_QUALITY_BASE_URL}?latitude=${city.latitude}&longitude=${city.longitude}&hourly=pm2_5,pm10,ozone,nitrogen_dioxide,us_aqi&timezone=auto&forecast_days=3`;

    const response = await fetchWithTimeout(url);
    if (!response.ok) {
      throw new Error(`Air Quality Forecast API error (${response.status}): ${response.statusText}`);
    }

    const jsonUnknown: unknown = await response.json();
    const parsed = openMeteoForecastSchema.safeParse(jsonUnknown);

    if (!parsed.success) {
      console.error('Zod schema validation failed for forecast:', parsed.error);
      throw new Error('Received unexpected forecast data format.');
    }

    const { hourly, hourly_units, timezone = 'UTC' } = parsed.data;

    const allPoints: HourlyForecastPoint[] = hourly.time.map((timeStr, idx) => {
      const date = new Date(timeStr);
      const hourLabel = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      const fullLabel = date.toLocaleDateString([], { weekday: 'short', hour: 'numeric' });

      return {
        time: timeStr,
        hourLabel,
        fullLabel,
        timestamp: date.getTime(),
        us_aqi: Math.round(hourly.us_aqi[idx] ?? 0),
        pm2_5: Number((hourly.pm2_5[idx] ?? 0).toFixed(1)),
        pm10: Number((hourly.pm10[idx] ?? 0).toFixed(1)),
        ozone: Number((hourly.ozone[idx] ?? 0).toFixed(1)),
        nitrogen_dioxide: Number((hourly.nitrogen_dioxide[idx] ?? 0).toFixed(1)),
      };
    });

    // Find the current hour point (or closest upcoming hour)
    const now = Date.now();
    let startIndex = allPoints.findIndex((p) => p.timestamp >= now - 1800000);
    if (startIndex < 0) startIndex = 0;

    // Next 24 hours starting from current hour
    const next24Hours = allPoints.slice(startIndex, startIndex + 24);
    if (next24Hours.length > 0) {
      const first = next24Hours[0];
      if (first) first.isCurrentHour = true;
    }

    // Identify minimum and maximum AQI points
    let minPoint = next24Hours[0] ?? allPoints[0];
    let maxPoint = next24Hours[0] ?? allPoints[0];

    for (const pt of next24Hours) {
      if (minPoint && pt.us_aqi < minPoint.us_aqi) minPoint = pt;
      if (maxPoint && pt.us_aqi > maxPoint.us_aqi) maxPoint = pt;
    }

    return {
      city: city.name,
      timezone,
      hourly: next24Hours,
      minAqi: minPoint?.us_aqi ?? 0,
      maxAqi: maxPoint?.us_aqi ?? 0,
      minAqiPoint: minPoint as HourlyForecastPoint,
      maxAqiPoint: maxPoint as HourlyForecastPoint,
      units: {
        pm2_5: hourly_units?.pm2_5 ?? 'μg/m³',
        pm10: hourly_units?.pm10 ?? 'μg/m³',
        ozone: hourly_units?.ozone ?? 'μg/m³',
        nitrogen_dioxide: hourly_units?.nitrogen_dioxide ?? 'μg/m³',
        us_aqi: hourly_units?.us_aqi ?? 'USAQI',
      },
    };
  },
};

