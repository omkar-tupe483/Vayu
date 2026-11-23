import { describe, it, expect } from 'vitest';
import {
  getAdvice,
  computeRiskLevel,
  normalizeProfile,
  UserProfileId,
} from '../advisor';
import { CleanForecastModel } from '../../schemas/forecastSchema';

describe('Health Advisor Logic', () => {
  describe('Profile Normalization', () => {
    it('normalizes various profile alias inputs correctly', () => {
      expect(normalizeProfile('general')).toBe('general');
      expect(normalizeProfile('child')).toBe('child');
      expect(normalizeProfile('elderly')).toBe('elderly');
      expect(normalizeProfile('runner')).toBe('runner');
      expect(normalizeProfile('asthma')).toBe('asthma_sensitive');
      expect(normalizeProfile('asthma-sensitive')).toBe('asthma_sensitive');
      expect(normalizeProfile('asthma_sensitive')).toBe('asthma_sensitive');
      expect(normalizeProfile(null)).toBe('general');
      expect(normalizeProfile(undefined)).toBe('general');
      expect(normalizeProfile('unknown_string')).toBe('general');
    });
  });

  describe('AQI Category Boundaries & Risk Levels', () => {
    const profiles: UserProfileId[] = ['general', 'child', 'elderly', 'runner', 'asthma_sensitive'];

    // Category 1: Good (0 - 50)
    it('evaluates AQI 0 and 50 as Low risk for all profiles', () => {
      for (const p of profiles) {
        expect(computeRiskLevel(0, p)).toBe('low');
        expect(computeRiskLevel(50, p)).toBe('low');
      }
    });

    // Category 2: Moderate (51 - 100)
    it('evaluates AQI 51 and 100 as Moderate risk for all profiles', () => {
      for (const p of profiles) {
        expect(computeRiskLevel(51, p)).toBe('moderate');
        expect(computeRiskLevel(100, p)).toBe('moderate');
      }
    });

    // Category 3: Unhealthy for Sensitive Groups (101 - 150)
    it('evaluates AQI 101 and 150 as High risk for sensitive profiles, Moderate for general', () => {
      expect(computeRiskLevel(101, 'general')).toBe('moderate');
      expect(computeRiskLevel(150, 'general')).toBe('moderate');

      expect(computeRiskLevel(101, 'child')).toBe('high');
      expect(computeRiskLevel(150, 'child')).toBe('high');

      expect(computeRiskLevel(101, 'elderly')).toBe('high');
      expect(computeRiskLevel(150, 'elderly')).toBe('high');

      expect(computeRiskLevel(101, 'asthma_sensitive')).toBe('high');
      expect(computeRiskLevel(150, 'asthma_sensitive')).toBe('high');
    });

    // Category 4: Unhealthy (151 - 200)
    it('evaluates AQI 151 and 200 as High or Very High risk across profiles', () => {
      expect(computeRiskLevel(151, 'general')).toBe('high');
      expect(computeRiskLevel(200, 'general')).toBe('high');

      expect(computeRiskLevel(151, 'runner')).toBe('very_high');
      expect(computeRiskLevel(200, 'runner')).toBe('very_high');

      expect(computeRiskLevel(151, 'asthma_sensitive')).toBe('very_high');
      expect(computeRiskLevel(200, 'asthma_sensitive')).toBe('very_high');
    });

    // Category 5: Very Unhealthy (201 - 300)
    it('evaluates AQI 201 and 300 as Very High risk for all profiles', () => {
      for (const p of profiles) {
        expect(computeRiskLevel(201, p)).toBe('very_high');
        expect(computeRiskLevel(300, p)).toBe('very_high');
      }
    });

    // Category 6: Hazardous (301 - 500)
    it('evaluates AQI 301 and 500 as Very High risk for all profiles', () => {
      for (const p of profiles) {
        expect(computeRiskLevel(301, p)).toBe('very_high');
        expect(computeRiskLevel(500, p)).toBe('very_high');
      }
    });
  });

  describe('Advisory Generation for Every Profile', () => {
    it('generates tailored advice for General profile', () => {
      const advice = getAdvice({ us_aqi: 45 }, 'general');
      expect(advice.riskLevel).toBe('low');
      expect(advice.profile).toBe('general');
      expect(advice.summary.key).toContain('advisor.summary.low.general');
      expect(advice.outdoorExercise.key).toContain('advisor.exercise.low.general');
      expect(advice.maskAdvice.key).toBe('advisor.mask.none');
      expect(advice.ventilation.key).toBe('advisor.ventilation.openWide');
      expect(advice.emergencyNotice).toBeUndefined();
    });

    it('generates tailored advice for Child profile with elevated sensitivity', () => {
      const advice = getAdvice({ us_aqi: 120 }, 'child');
      expect(advice.riskLevel).toBe('high');
      expect(advice.profile).toBe('child');
      expect(advice.outdoorExercise.key).toContain('advisor.exercise.high.sensitive');
      expect(advice.profileAdvice.key).toBe('advisor.profile.child.high');
      expect(advice.emergencyNotice).toBeDefined();
    });

    it('generates tailored advice for Elderly profile', () => {
      const advice = getAdvice({ us_aqi: 160 }, 'elderly');
      expect(advice.riskLevel).toBe('high');
      expect(advice.profile).toBe('elderly');
      expect(advice.profileAdvice.key).toBe('advisor.profile.elderly.high');
      expect(advice.emergencyNotice).toBeDefined();
    });

    it('generates tailored advice for Runner profile with minute ventilation warnings', () => {
      const advice = getAdvice({ us_aqi: 155 }, 'runner');
      expect(advice.riskLevel).toBe('very_high');
      expect(advice.profile).toBe('runner');
      expect(advice.outdoorExercise.key).toBe('advisor.exercise.very_high.runner');
      expect(advice.profileAdvice.key).toBe('advisor.profile.runner.very_high');
    });

    it('generates tailored advice for Asthma-Sensitive profile with rescue medication', () => {
      const advice = getAdvice({ us_aqi: 110 }, 'asthma-sensitive');
      expect(advice.riskLevel).toBe('high');
      expect(advice.profile).toBe('asthma_sensitive');
      expect(advice.profileAdvice.key).toBe('advisor.profile.asthma_sensitive.high');

      const medMeasure = advice.protectiveMeasures.find((m) => m.id === 'medical-measure');
      expect(medMeasure).toBeDefined();
      expect(medMeasure?.descKey).toBe('advisor.measures.medical.asthma');
    });
  });

  describe('Missing Data & Edge Cases Handling', () => {
    it('handles null data gracefully without throwing', () => {
      const advice = getAdvice(null, 'general');
      expect(advice.aqi).toBe(0);
      expect(advice.riskLevel).toBe('low');
      expect(advice.summary.params?.aqi).toBe(0);
    });

    it('handles undefined data gracefully', () => {
      const advice = getAdvice(undefined, 'child');
      expect(advice.aqi).toBe(0);
      expect(advice.riskLevel).toBe('low');
    });

    it('handles empty object {} gracefully', () => {
      const advice = getAdvice({}, 'elderly');
      expect(advice.aqi).toBe(0);
      expect(advice.riskLevel).toBe('low');
    });

    it('handles null us_aqi or negative numbers gracefully', () => {
      const advice = getAdvice({ us_aqi: null }, 'runner');
      expect(advice.aqi).toBe(0);
      expect(advice.riskLevel).toBe('low');

      const negativeAdvice = getAdvice({ us_aqi: -25 }, 'general');
      expect(negativeAdvice.aqi).toBe(0);
    });

    it('handles missing pollutant subfields gracefully', () => {
      const advice = getAdvice({ us_aqi: 85, pollutants: null }, 'general');
      expect(advice.aqi).toBe(85);
      expect(advice.riskLevel).toBe('moderate');
    });
  });

  describe('Medical Safety & Disclaimers', () => {
    it('always includes general non-diagnostic disclaimer', () => {
      const adviceLow = getAdvice({ us_aqi: 20 }, 'general');
      expect(adviceLow.disclaimer.key).toBe('advisor.disclaimer.notice');

      const adviceHigh = getAdvice({ us_aqi: 250 }, 'asthma_sensitive');
      expect(adviceHigh.disclaimer.key).toBe('advisor.disclaimer.notice');
    });

    it('includes emergency medical alert at high risk levels', () => {
      const adviceHigh = getAdvice({ us_aqi: 180 }, 'general');
      expect(adviceHigh.emergencyNotice).toBeDefined();
      expect(adviceHigh.emergencyNotice?.key).toBe('advisor.emergency.alert');

      const adviceVeryHigh = getAdvice({ us_aqi: 320 }, 'asthma_sensitive');
      expect(adviceVeryHigh.emergencyNotice).toBeDefined();
      expect(adviceVeryHigh.emergencyNotice?.key).toBe('advisor.emergency.alert');
    });

    it('does NOT include emergency notice at low risk levels', () => {
      const advice = getAdvice({ us_aqi: 35 }, 'general');
      expect(advice.emergencyNotice).toBeUndefined();
    });
  });

  describe('Forecast Integration for Best Time Window', () => {
    it('integrates hourly forecast when provided', () => {
      const mockForecast: CleanForecastModel = {
        city: 'Pune',
        timezone: 'Asia/Kolkata',
        hourly: [
          {
            time: '2026-11-23T11:00',
            hourLabel: '11:00 AM',
            fullLabel: 'Today 11:00 AM',
            timestamp: 1732338000000,
            us_aqi: 40,
            pm2_5: 12,
            pm10: 25,
            ozone: 15,
            nitrogen_dioxide: 10,
          },
          {
            time: '2026-11-23T12:00',
            hourLabel: '12:00 PM',
            fullLabel: 'Today 12:00 PM',
            timestamp: 1732341600000,
            us_aqi: 42,
            pm2_5: 14,
            pm10: 28,
            ozone: 18,
            nitrogen_dioxide: 12,
          },
          {
            time: '2026-11-23T13:00',
            hourLabel: '01:00 PM',
            fullLabel: 'Today 01:00 PM',
            timestamp: 1732345200000,
            us_aqi: 45,
            pm2_5: 15,
            pm10: 30,
            ozone: 20,
            nitrogen_dioxide: 14,
          },
        ],
        minAqi: 40,
        maxAqi: 45,
        minAqiPoint: {
          time: '2026-11-23T11:00',
          hourLabel: '11:00 AM',
          fullLabel: 'Today 11:00 AM',
          timestamp: 1732338000000,
          us_aqi: 40,
          pm2_5: 12,
          pm10: 25,
          ozone: 15,
          nitrogen_dioxide: 10,
        },
        maxAqiPoint: {
          time: '2026-11-23T13:00',
          hourLabel: '01:00 PM',
          fullLabel: 'Today 01:00 PM',
          timestamp: 1732345200000,
          us_aqi: 45,
          pm2_5: 15,
          pm10: 30,
          ozone: 20,
          nitrogen_dioxide: 14,
        },
        units: {
          pm2_5: 'μg/m³',
          pm10: 'μg/m³',
          ozone: 'μg/m³',
          nitrogen_dioxide: 'μg/m³',
          us_aqi: 'USAQI',
        },
      };

      const advice = getAdvice({ us_aqi: 120 }, 'general', mockForecast);
      expect(advice.bestTimeWindow).toBeDefined();
      expect(advice.bestTimeWindow?.hasSafeWindow).toBe(true);
      expect(advice.bestTimeWindow?.startHour).toBe('11:00 AM');
      expect(advice.bestTimeWindow?.endHour).toBe('01:00 PM');
    });
  });
});
