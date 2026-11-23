import { describe, it, expect } from 'vitest';
import {
  getAdvice,
  computeRiskLevel,
  normalizeProfile,
  UserProfileId,
} from '../advisor';
import { CleanForecastModel } from '../../schemas/forecastSchema';

describe('Health Advisor Logic (Phase 5)', () => {
  describe('Profile Normalization', () => {
    it('normalizes various profile inputs correctly', () => {
      expect(normalizeProfile('general')).toBe('general');
      expect(normalizeProfile('child')).toBe('child');
      expect(normalizeProfile('elderly')).toBe('elderly');
      expect(normalizeProfile('runner')).toBe('runner');
      expect(normalizeProfile('asthma')).toBe('asthma_sensitive');
      expect(normalizeProfile('asthma-sensitive')).toBe('asthma_sensitive');
      expect(normalizeProfile(null)).toBe('general');
      expect(normalizeProfile(undefined)).toBe('general');
    });
  });

  describe('AQI Category Boundaries & Risk Levels', () => {
    const profiles: UserProfileId[] = ['general', 'child', 'elderly', 'runner', 'asthma_sensitive'];

    it('evaluates AQI 0 and 50 as Low risk for all profiles', () => {
      for (const p of profiles) {
        expect(computeRiskLevel(0, p)).toBe('low');
        expect(computeRiskLevel(50, p)).toBe('low');
      }
    });

    it('evaluates AQI 51 and 100 as Moderate risk for all profiles', () => {
      for (const p of profiles) {
        expect(computeRiskLevel(51, p)).toBe('moderate');
        expect(computeRiskLevel(100, p)).toBe('moderate');
      }
    });

    it('evaluates AQI 101 and 150 as High risk for sensitive profiles, Moderate for general', () => {
      expect(computeRiskLevel(101, 'general')).toBe('moderate');
      expect(computeRiskLevel(150, 'general')).toBe('moderate');
      expect(computeRiskLevel(101, 'child')).toBe('high');
      expect(computeRiskLevel(101, 'elderly')).toBe('high');
      expect(computeRiskLevel(101, 'asthma_sensitive')).toBe('high');
    });

    it('evaluates AQI 151 and 200 as High or Very High risk across profiles', () => {
      expect(computeRiskLevel(151, 'general')).toBe('high');
      expect(computeRiskLevel(151, 'runner')).toBe('very_high');
      expect(computeRiskLevel(151, 'asthma_sensitive')).toBe('very_high');
    });

    it('evaluates AQI 201+ as Very High risk for all profiles', () => {
      for (const p of profiles) {
        expect(computeRiskLevel(201, p)).toBe('very_high');
        expect(computeRiskLevel(500, p)).toBe('very_high');
      }
    });
  });

  describe('Advisory Generation & Safety Disclaimers', () => {
    it('always includes non-diagnostic general disclaimer', () => {
      const advice = getAdvice({ us_aqi: 25 }, 'general');
      expect(advice.disclaimer.key).toBe('advisor.disclaimer.notice');
      expect(advice.emergencyNotice).toBeUndefined();
    });

    it('includes emergency medical alert when risk is High or Very High', () => {
      const highAdvice = getAdvice({ us_aqi: 165 }, 'general');
      expect(highAdvice.emergencyNotice).toBeDefined();
      expect(highAdvice.emergencyNotice?.key).toBe('advisor.emergency.alert');

      const veryHighAdvice = getAdvice({ us_aqi: 220 }, 'asthma_sensitive');
      expect(veryHighAdvice.emergencyNotice).toBeDefined();
    });

    it('handles null, undefined, or missing data gracefully without throwing', () => {
      expect(getAdvice(null, 'general').aqi).toBe(0);
      expect(getAdvice(undefined, 'child').aqi).toBe(0);
      expect(getAdvice({}, 'runner').aqi).toBe(0);
      expect(getAdvice({ us_aqi: -10 }, 'elderly').aqi).toBe(0);
    });

    it('integrates 24h forecast when provided', () => {
      const mockForecast: CleanForecastModel = {
        city: 'Pune',
        timezone: 'Asia/Kolkata',
        hourly: [
          {
            time: '2026-11-23T11:00',
            hourLabel: '11:00 AM',
            fullLabel: 'Today 11:00 AM',
            timestamp: 1732338000000,
            us_aqi: 35,
            pm2_5: 10,
            pm10: 20,
            ozone: 15,
            nitrogen_dioxide: 10,
          },
          {
            time: '2026-11-23T12:00',
            hourLabel: '12:00 PM',
            fullLabel: 'Today 12:00 PM',
            timestamp: 1732341600000,
            us_aqi: 38,
            pm2_5: 12,
            pm10: 22,
            ozone: 16,
            nitrogen_dioxide: 12,
          },
          {
            time: '2026-11-23T13:00',
            hourLabel: '01:00 PM',
            fullLabel: 'Today 01:00 PM',
            timestamp: 1732345200000,
            us_aqi: 40,
            pm2_5: 14,
            pm10: 24,
            ozone: 18,
            nitrogen_dioxide: 14,
          },
        ],
        minAqi: 35,
        maxAqi: 40,
        minAqiPoint: {
          time: '2026-11-23T11:00',
          hourLabel: '11:00 AM',
          fullLabel: 'Today 11:00 AM',
          timestamp: 1732338000000,
          us_aqi: 35,
          pm2_5: 10,
          pm10: 20,
          ozone: 15,
          nitrogen_dioxide: 10,
        },
        maxAqiPoint: {
          time: '2026-11-23T13:00',
          hourLabel: '01:00 PM',
          fullLabel: 'Today 01:00 PM',
          timestamp: 1732345200000,
          us_aqi: 40,
          pm2_5: 14,
          pm10: 24,
          ozone: 18,
          nitrogen_dioxide: 14,
        },
      };

      const advice = getAdvice({ us_aqi: 120 }, 'general', mockForecast);
      expect(advice.bestTimeWindow).toBeDefined();
      expect(advice.bestTimeWindow?.hasSafeWindow).toBe(true);
      expect(advice.bestTimeWindow?.startHour).toBe('11:00 AM');
    });
  });
});
