import { z } from 'zod';

/**
 * Strict Zod schema for Open-Meteo Air Quality API
 */
export const openMeteoAirQualitySchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  generationtime_ms: z.number().optional(),
  utc_offset_seconds: z.number().optional(),
  timezone: z.string().optional(),
  elevation: z.number().optional(),
  current_units: z.object({
    time: z.string().optional(),
    interval: z.string().optional(),
    pm2_5: z.string().default('μg/m³'),
    pm10: z.string().default('μg/m³'),
    ozone: z.string().default('μg/m³'),
    nitrogen_dioxide: z.string().default('μg/m³'),
    us_aqi: z.string().default('USAQI'),
  }).optional(),
  current: z.object({
    time: z.string(),
    interval: z.number().optional(),
    pm2_5: z.number().nonnegative().catch(0),
    pm10: z.number().nonnegative().catch(0),
    ozone: z.number().nonnegative().catch(0),
    nitrogen_dioxide: z.number().nonnegative().catch(0),
    us_aqi: z.number().nonnegative().catch(0),
  }),
});

export type OpenMeteoAirQualityResponse = z.infer<typeof openMeteoAirQualitySchema>;

export interface CleanAirQualityModel {
  city: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
  time: string;
  us_aqi: number;
  pollutants: {
    pm2_5: number;
    pm10: number;
    ozone: number;
    nitrogen_dioxide: number;
  };
  units: {
    pm2_5: string;
    pm10: string;
    ozone: string;
    nitrogen_dioxide: string;
    us_aqi: string;
  };
  isModelledEstimate: true;
}
