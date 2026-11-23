import { describe, it, expect } from 'vitest';
import {
  calculateDistanceKm,
  sampleCoordinates,
  calculateRouteExposure,
  rankAndCompareRoutes,
} from '../routeExposure';

describe('Route Exposure & Cleanest Route Calculations (Phase 7)', () => {
  describe('calculateDistanceKm', () => {
    it('calculates great-circle distance accurately', () => {
      // Pune (18.5204, 73.8567) to Mumbai (19.0760, 72.8777) ~ 120-130 km
      const dist = calculateDistanceKm(18.5204, 73.8567, 19.076, 72.8777);
      expect(dist).toBeGreaterThan(110);
      expect(dist).toBeLessThan(140);
    });

    it('returns 0 for identical coordinates', () => {
      expect(calculateDistanceKm(18.52, 73.85, 18.52, 73.85)).toBe(0);
    });
  });

  describe('sampleCoordinates', () => {
    it('samples exact requested count from polyline', () => {
      const line: [number, number][] = [
        [18.50, 73.80],
        [18.51, 73.81],
        [18.52, 73.82],
        [18.53, 73.83],
        [18.54, 73.84],
        [18.55, 73.85],
        [18.56, 73.86],
        [18.57, 73.87],
      ];
      const sampled = sampleCoordinates(line, 4);
      expect(sampled.length).toBe(4);
      expect(sampled[0]).toEqual([18.50, 73.80]);
      expect(sampled[3]).toEqual([18.57, 73.87]);
    });

    it('handles short or empty coordinates array gracefully', () => {
      expect(sampleCoordinates([], 5)).toEqual([]);
      const short: [number, number][] = [[18.5, 73.8]];
      expect(sampleCoordinates(short, 3)).toEqual([[18.5, 73.8]]);
    });
  });

  describe('calculateRouteExposure', () => {
    it('calculates distance-weighted exposure score and peak', () => {
      // Segment 1: from (18.50, 73.80) to (18.55, 73.80) AQI 40 -> 60
      // Segment 2: from (18.55, 73.80) to (18.60, 73.80) AQI 60 -> 120
      const points = [
        { latitude: 18.50, longitude: 73.80, aqi: 40 },
        { latitude: 18.55, longitude: 73.80, aqi: 60 },
        { latitude: 18.60, longitude: 73.80, aqi: 120 },
      ];
      const result = calculateRouteExposure(points, 10);
      expect(result.peakAqi).toBe(120);
      expect(result.peakPoint?.latitude).toBe(18.60);
      expect(result.weightedAqi).toBeGreaterThan(50);
      expect(result.weightedAqi).toBeLessThan(100);
    });

    it('handles single point without division by zero', () => {
      const single = [{ latitude: 18.5, longitude: 73.8, aqi: 75 }];
      const res = calculateRouteExposure(single, 5);
      expect(res.weightedAqi).toBe(75);
      expect(res.peakAqi).toBe(75);
    });
  });

  describe('rankAndCompareRoutes', () => {
    it('identifies cleanest and fastest routes and computes percentage improvement', () => {
      const routes = [
        {
          id: 'route-highway',
          name: 'Direct Highway',
          distanceKm: 8.5,
          durationMinutes: 15,
          mode: 'driving' as const,
          coordinates: [[18.5, 73.8], [18.6, 73.9]] as [number, number][],
          samples: [
            { latitude: 18.50, longitude: 73.80, aqi: 150 },
            { latitude: 18.55, longitude: 73.85, aqi: 160 },
            { latitude: 18.60, longitude: 73.90, aqi: 170 },
          ],
        },
        {
          id: 'route-greenway',
          name: 'Riverside & Park Boulevard',
          distanceKm: 10.2,
          durationMinutes: 19,
          mode: 'driving' as const,
          coordinates: [[18.5, 73.8], [18.55, 73.82], [18.6, 73.9]] as [number, number][],
          samples: [
            { latitude: 18.50, longitude: 73.80, aqi: 60 },
            { latitude: 18.55, longitude: 73.82, aqi: 65 },
            { latitude: 18.60, longitude: 73.90, aqi: 70 },
          ],
        },
      ];

      const ranked = rankAndCompareRoutes(routes);
      expect(ranked.length).toBe(2);

      const fastest = ranked.find((r) => r.isFastest);
      const cleanest = ranked.find((r) => r.isCleanest);

      expect(fastest?.id).toBe('route-highway');
      expect(cleanest?.id).toBe('route-greenway');

      // Highway weighted AQI is ~160, Greenway is ~65 -> ~59% cleaner
      expect(cleanest?.cleanerPercentageVsFastest).toBeDefined();
      expect(cleanest?.cleanerPercentageVsFastest).toBeGreaterThan(40);
    });
  });
});

