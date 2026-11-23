import { describe, it, expect } from 'vitest';
import {
  alertThresholdSchema,
  savedCityItemSchema,
  appSettingsSchema,
} from '../../schemas/settingsSchema';

describe('Settings & Alerts Schemas (Phase 8)', () => {
  describe('alertThresholdSchema', () => {
    it('validates a valid alert configuration', () => {
      const valid = {
        cityId: 'pune-18.52-73.85',
        cityName: 'Pune',
        thresholdAqi: 120,
        enabled: true,
      };
      const parsed = alertThresholdSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.thresholdAqi).toBe(120);
      }
    });

    it('rejects thresholds outside allowable boundaries (50-500)', () => {
      const tooLow = alertThresholdSchema.safeParse({
        cityId: '1',
        cityName: 'City',
        thresholdAqi: 20,
      });
      expect(tooLow.success).toBe(false);

      const tooHigh = alertThresholdSchema.safeParse({
        cityId: '1',
        cityName: 'City',
        thresholdAqi: 650,
      });
      expect(tooHigh.success).toBe(false);
    });
  });

  describe('savedCityItemSchema', () => {
    it('validates saved city items accurately', () => {
      const city = {
        id: 'pune',
        name: 'Pune',
        latitude: 18.5204,
        longitude: 73.8567,
        country: 'India',
        admin1: 'Maharashtra',
      };
      const res = savedCityItemSchema.safeParse(city);
      expect(res.success).toBe(true);
    });

    it('fails if coordinates or name are missing', () => {
      const invalid = {
        id: 'broken',
        latitude: 18.5,
      };
      expect(savedCityItemSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe('appSettingsSchema', () => {
    it('defaults reduceMotion to false and language to en', () => {
      const parsed = appSettingsSchema.parse({});
      expect(parsed.reduceMotion).toBe(false);
      expect(parsed.language).toBe('en');
      expect(parsed.theme).toBe('system');
    });

    it('allows valid theme and language combinations', () => {
      const parsed = appSettingsSchema.parse({
        reduceMotion: true,
        theme: 'dark',
        language: 'mr',
      });
      expect(parsed.reduceMotion).toBe(true);
      expect(parsed.theme).toBe('dark');
      expect(parsed.language).toBe('mr');
    });
  });
});

