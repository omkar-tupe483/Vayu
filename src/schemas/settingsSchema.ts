import { z } from 'zod';

export const alertThresholdSchema = z.object({
  cityId: z.string(),
  cityName: z.string().min(1),
  thresholdAqi: z.number().min(50).max(500).default(100),
  enabled: z.boolean().default(true),
  lastTriggered: z.number().optional(),
});

export type AlertThresholdConfig = z.infer<typeof alertThresholdSchema>;

export const savedCityItemSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  country: z.string().optional(),
  admin1: z.string().optional(),
  timezone: z.string().optional(),
  savedAt: z.number().default(() => Date.now()),
});

export type SavedCityItem = z.infer<typeof savedCityItemSchema>;

export const appSettingsSchema = z.object({
  reduceMotion: z.boolean().default(false),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  language: z.enum(['en', 'hi', 'mr']).default('en'),
});

export type AppSettings = z.infer<typeof appSettingsSchema>;
