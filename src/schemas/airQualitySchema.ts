import { z } from 'zod';

export const openMeteoCurrentAirQualitySchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  generationtime_ms: z.number().optional(),
  utc_offset_seconds: z.number().optional(),
  timezone: z.string().optional(),
  timezone_abbreviation: z.string().optional(),
  elevation: z.number().optional(),
  current_units: z.object({
    time: z.string().optional(),
    interval: z.string().optional(),
    pm2_5: z.string().default('μg/m³'),
    pm10: z.string().default('μg/m³'),
    ozone: z.string().default('μg/m³'),
    nitrogen_dioxide: z.string().default('μg/m³'),
    carbon_monoxide: z.string().default('μg/m³'),
    sulphur_dioxide: z.string().default('μg/m³'),
    us_aqi: z.string().default('USAQI'),
    us_aqi_pm2_5: z.string().default('USAQI'),
    us_aqi_pm10: z.string().default('USAQI'),
    us_aqi_nitrogen_dioxide: z.string().default('USAQI'),
    us_aqi_ozone: z.string().default('USAQI'),
    us_aqi_sulphur_dioxide: z.string().default('USAQI'),
    us_aqi_carbon_monoxide: z.string().default('USAQI'),
  }).optional(),
  current: z.object({
    time: z.string(),
    interval: z.number().optional(),
    pm2_5: z.number().catch(0),
    pm10: z.number().catch(0),
    ozone: z.number().catch(0),
    nitrogen_dioxide: z.number().catch(0),
    carbon_monoxide: z.number().catch(0),
    sulphur_dioxide: z.number().catch(0),
    us_aqi: z.number().catch(0),
    us_aqi_pm2_5: z.number().catch(0),
    us_aqi_pm10: z.number().catch(0),
    us_aqi_nitrogen_dioxide: z.number().catch(0),
    us_aqi_ozone: z.number().catch(0),
    us_aqi_sulphur_dioxide: z.number().catch(0),
    us_aqi_carbon_monoxide: z.number().catch(0),
  }),
});

export type OpenMeteoCurrentAirQualityResponse = z.infer<typeof openMeteoCurrentAirQualitySchema>;

export interface CleanPollutant {
  key: string;
  name: string;
  formula: string;
  value: number;
  unit: string;
  subAqi: number;
  description: string;
}

export interface CleanAirQualityModel {
  city: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  time: string;
  us_aqi: number;
  pollutants: {
    pm2_5: CleanPollutant;
    pm10: CleanPollutant;
    nitrogen_dioxide: CleanPollutant;
    ozone: CleanPollutant;
    carbon_monoxide: CleanPollutant;
    sulphur_dioxide: CleanPollutant;
  };
  dominantPollutant: string;
  isModelledEstimate: true;
}

