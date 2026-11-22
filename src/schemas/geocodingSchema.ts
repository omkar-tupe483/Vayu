import { z } from 'zod';

/**
 * Strict Zod schema for Open-Meteo Geocoding API
 */
export const geoCityItemSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(100),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  elevation: z.number().optional(),
  feature_code: z.string().optional(),
  country_code: z.string().optional(),
  admin1: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional(),
  population: z.number().optional(),
});

export const openMeteoGeocodingSchema = z.object({
  results: z.array(geoCityItemSchema).optional(),
  generationtime_ms: z.number().optional(),
});

export type GeoCityItem = z.infer<typeof geoCityItemSchema>;
export type OpenMeteoGeocodingResponse = z.infer<typeof openMeteoGeocodingSchema>;
