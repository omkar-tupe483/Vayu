import { openMeteoGeocodingSchema, GeoCityItem } from '../schemas/geocodingSchema';
import { openMeteoAirQualitySchema, CleanAirQualityModel } from '../schemas/airQualitySchema';

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
};

