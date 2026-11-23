import { z } from 'zod';

/**
 * Strict Zod schema for Open-Meteo Hourly Air Quality API
 */
export const openMeteoForecastSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  generationtime_ms: z.number().optional(),
  utc_offset_seconds: z.number().optional(),
  timezone: z.string().optional(),
  timezone_abbreviation: z.string().optional(),
  elevation: z.number().optional(),
  hourly_units: z.object({
    time: z.string().optional(),
    pm2_5: z.string().default('μg/m³'),
    pm10: z.string().default('μg/m³'),
    ozone: z.string().default('μg/m³'),
    nitrogen_dioxide: z.string().default('μg/m³'),
    us_aqi: z.string().default('USAQI'),
  }).optional(),
  hourly: z.object({
    time: z.array(z.string()),
    pm2_5: z.array(z.number().nullable().transform((v) => v ?? 0)),
    pm10: z.array(z.number().nullable().transform((v) => v ?? 0)),
    ozone: z.array(z.number().nullable().transform((v) => v ?? 0)),
    nitrogen_dioxide: z.array(z.number().nullable().transform((v) => v ?? 0)),
    us_aqi: z.array(z.number().nullable().transform((v) => v ?? 0)),
  }),
});

export type OpenMeteoForecastResponse = z.infer<typeof openMeteoForecastSchema>;

export interface HourlyForecastPoint {
  time: string;           // Raw ISO "2026-11-23T11:00"
  hourLabel: string;      // "11:00 AM" or "11:00"
  fullLabel: string;      // "Mon 11:00 AM"
  timestamp: number;      // Epoch ms
  us_aqi: number;
  pm2_5: number;
  pm10: number;
  ozone: number;
  nitrogen_dioxide: number;
  isCurrentHour?: boolean;
}

export interface CleanForecastModel {
  city: string;
  timezone: string;
  hourly: HourlyForecastPoint[]; // Next 24 hours starting from current hour
  minAqi: number;
  maxAqi: number;
  minAqiPoint: HourlyForecastPoint;
  maxAqiPoint: HourlyForecastPoint;
  units: {
    pm2_5: string;
    pm10: string;
    ozone: string;
    nitrogen_dioxide: string;
    us_aqi: string;
  };
}
