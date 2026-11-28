import { describe, it, expect } from 'vitest';
import {
  generateDailyPlan,
  generateIndoorLabHacks,
  generateSustainableSwaps,
  calculateWhatIfImpact,
  getHealthShieldGuidance,
} from '../ruleEngine';
import { findBestWindow, getCategoryFromAQI } from '../airQualityService';
import { generateChatReply } from '../chatEngine';
import { AirQualityData, HouseholdMember, LifestyleProfile } from '../../types';

describe('Vayu Deterministic Rule Engine & Formulas', () => {
  const mockAqiData: AirQualityData = {
    city: 'Pune',
    aqi: 165,
    category: 'Unhealthy',
    dominantPollutant: 'PM2.5',
    pollutants: { pm2_5: 85, pm10: 140, no2: 32, o3: 40 },
    timestamp: '2026-11-28T12:00:00Z',
    hourly24h: [
      { time: '06:00', aqi: 180, pm2_5: 95 },
      { time: '12:00', aqi: 130, pm2_5: 65, isBestWindow: true },
      { time: '14:00', aqi: 125, pm2_5: 60, isBestWindow: true },
      { time: '18:00', aqi: 190, pm2_5: 105 },
    ],
    forecast48h: [],
    bestWindow: {
      startTime: '12:00',
      endTime: '14:00',
      estimatedAqi: 127,
      reason: 'Midday dispersion',
    },
  };

  const mockHousehold: HouseholdMember[] = [
    { id: '1', name: 'Aarav', role: 'child', riskLevel: 'High' },
    { id: '2', name: 'Grandmother', role: 'elderly', hasAsthmaOrHeart: true, riskLevel: 'Severe' },
  ];

  const mockLifestyle: LifestyleProfile = {
    city: 'Pune',
    latitude: 18.52,
    longitude: 73.85,
    commuteMode: 'car_motorcycle',
    cookingFuel: 'lpg_electric',
    heatingMethod: 'none_mild',
    homeType: 'apartment',
    budgetTier: 'flexible',
    hasPurifier: true,
  };

  describe('Daily Plan Generator', () => {
    it('produces 4 comprehensive time-slotted plan cards with impacts and confidence', () => {
      const plan = generateDailyPlan(mockAqiData, mockHousehold, mockLifestyle);
      expect(plan.length).toBe(4);

      plan.forEach((item) => {
        expect(item.action).toBeTruthy();
        expect(item.whyThisMatters).toBeTruthy();
        expect(item.estimatedImpact).toBeTruthy();
        expect(['Low', 'Medium', 'High']).toContain(item.confidence);
        expect(['Easy', 'Moderate', 'High']).toContain(item.effort);
        expect(['Free', 'Low', 'Medium', 'High']).toContain(item.cost);
      });
    });

    it('tailors morning slot for severe smog', () => {
      const severeData = { ...mockAqiData, aqi: 320 };
      const plan = generateDailyPlan(severeData, mockHousehold, mockLifestyle);
      const morning = plan.find((p) => p.timeSlot.startsWith('Morning'));
      expect(morning?.action).toContain('windows tightly sealed');
    });
  });

  describe('Indoor Air Lab Hacks', () => {
    it('provides room-by-room guidance with honest DIY ratings', () => {
      const hacks = generateIndoorLabHacks(mockAqiData, mockLifestyle);
      expect(hacks.length).toBe(4);

      const bedroom = hacks.find((h) => h.room === 'Bedroom');
      expect(bedroom?.title).toBeTruthy();
      expect(bedroom?.diyOption.description).toContain('Box Fan');
      expect(bedroom?.diyOption.honestEffectiveness).toContain('60-75%');
    });
  });

  describe('Sustainable Swaps', () => {
    it('generates commute, cooking, heating, and waste swaps with weekly impacts', () => {
      const swaps = generateSustainableSwaps(mockLifestyle);
      expect(swaps.length).toBe(4);
      expect(swaps[0]?.category).toBe('Commute');
      expect(swaps[0]?.weeklyImpact).toContain('kg');
    });
  });

  describe('What If? Simulator Formula', () => {
    it('calculates personal exposure reduction and community emissions accurately', () => {
      const result = calculateWhatIfImpact(
        {
          skipCarTripKm: 10,
          switchCookingToClean: true,
          runPurifierHours: 12,
          ventilateCleanestHour: true,
          wearN95Commute: true,
        },
        165
      );

      expect(result.personalExposureReductionPct).toBeGreaterThan(50);
      expect(result.personalExposureReductionPct).toBeLessThanOrEqual(85);
      expect(result.communityEmissionAvoidedGrams).toBeGreaterThan(1000);
      expect(['Medium', 'High']).toContain(result.confidence);
    });
  });

  describe('Health Shield Member Guidance', () => {
    it('provides specialized child and elderly advice for high smog', () => {
      const childGuidance = getHealthShieldGuidance(mockHousehold[0]!, 220);
      expect(childGuidance.outdoorAdvice).toContain('Strictly cancel outdoor playground');
      expect(childGuidance.maskAdvice).toContain('N95');
      expect(childGuidance.whenToSeekDoctor).toContain('ribs pull inward');

      const elderGuidance = getHealthShieldGuidance(mockHousehold[1]!, 220);
      expect(elderGuidance.whenToSeekDoctor).toContain('rescue inhaler');
    });
  });

  describe('AQI Calculations & Best Window Algorithm', () => {
    it('maps AQI values to official categories', () => {
      expect(getCategoryFromAQI(45)).toBe('Good');
      expect(getCategoryFromAQI(85)).toBe('Moderate');
      expect(getCategoryFromAQI(140)).toBe('Unhealthy for Sensitive');
      expect(getCategoryFromAQI(180)).toBe('Unhealthy');
      expect(getCategoryFromAQI(250)).toBe('Very Unhealthy');
      expect(getCategoryFromAQI(350)).toBe('Hazardous');
    });

    it('identifies best 2-hour window correctly', () => {
      const points = [
        { time: '08:00', aqi: 250, pm2_5: 120 },
        { time: '10:00', aqi: 190, pm2_5: 90 },
        { time: '12:00', aqi: 110, pm2_5: 50 },
        { time: '14:00', aqi: 115, pm2_5: 55 },
        { time: '16:00', aqi: 210, pm2_5: 100 },
      ];
      const best = findBestWindow(points);
      expect(best?.startTime).toBe('12:00');
      expect(best?.endTime).toBe('14:00');
      expect(best?.estimatedAqi).toBe(113);
    });
  });

  describe('Conversational Chat Engine', () => {
    it('gives practical tips for "how can i improve my breathing?" without false emergency alarm', () => {
      const reply = generateChatReply({
        message: 'how can i improve my breathing?',
        city: 'Delhi',
        aqi: 235,
      });
      expect(reply).not.toContain('Emergency Notice');
      expect(reply).toContain('Breathe through your nose');
      expect(reply).toContain('Why this matters');
    });

    it('acknowledges "i dont have any problems" warmly without repeating canned AQI dump', () => {
      const reply = generateChatReply({
        message: 'i dont have any problems',
        city: 'Delhi',
        aqi: 235,
      });
      expect(reply).toContain('Glad to hear');
      expect(reply).not.toMatch(/^Current AQI in Delhi is 235/);
    });

    it('triggers emergency notice only on genuine distress phrases', () => {
      const reply = generateChatReply({
        message: 'I have chest pain and cannot breathe',
        city: 'Delhi',
        aqi: 235,
      });
      expect(reply).toContain('Emergency Notice');
      expect(reply).toContain('108');
    });
  });
});
