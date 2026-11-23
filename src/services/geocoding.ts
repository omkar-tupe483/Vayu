import { z } from 'zod';
import { CityLocation } from '../constants/cities';

export const geocodingResultSchema = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  elevation: z.number().optional(),
  feature_code: z.string().optional(),
  country_code: z.string().optional(),
  admin1_id: z.number().optional(),
  timezone: z.string().default('auto'),
  country: z.string().default(''),
  admin1: z.string().optional(),
});

export const geocodingResponseSchema = z.object({
  results: z.array(geocodingResultSchema).optional().default([]),
  generationtime_ms: z.number().optional(),
});

export async function searchCities(query: string, count = 10, signal?: AbortSignal): Promise<CityLocation[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    trimmed
  )}&count=${count}&language=en&format=json`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) {
      throw new Error(`Geocoding HTTP error: ${res.status}`);
    }
    const json = await res.json();
    const parsed = geocodingResponseSchema.parse(json);

    return (parsed.results || []).map((item) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'auto',
      country: item.country || '',
      admin1: item.admin1,
    }));
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      return [];
    }
    console.warn('Geocoding search failed:', err);
    return [];
  }
}

