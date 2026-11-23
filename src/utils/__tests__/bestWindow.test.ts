import { describe, it, expect } from 'vitest';
import { findBestTimeWindow } from '../bestWindow';
import { HourlyForecastPoint } from '../../schemas/forecastSchema';

describe('findBestTimeWindow pure algorithm', () => {
  const createMockPoints = (aqis: number[]): HourlyForecastPoint[] =>
    aqis.map((aqi, i) => ({
      time: `2026-11-23T${String(i).padStart(2, '0')}:00`,
      hourLabel: `${i}:00`,
      fullLabel: `Today ${i}:00`,
      timestamp: 1732338000000 + i * 3600000,
      us_aqi: aqi,
      pm2_5: aqi * 0.4,
      pm10: aqi * 0.6,
      ozone: 15,
      nitrogen_dioxide: 10,
    }));

  it('returns null on empty hourly forecast array', () => {
    expect(findBestTimeWindow([])).toBeNull();
  });

  it('finds cleanest 3-hour window for General profile (AQI <= 100)', () => {
    // 24 hours: peak in middle, valley at hours 3-5 (AQI 40, 42, 45)
    const points = createMockPoints([
      120, 110, 80, 40, 42, 45, 90, 130, 150, 160, 170, 160,
      140, 130, 120, 110, 95, 85, 75, 80, 90, 110, 125, 130,
    ]);

    const result = findBestTimeWindow(points, 'general', undefined, 3);
    expect(result).not.toBeNull();
    expect(result?.isSafe).toBe(true);
    expect(result?.startIndex).toBe(3);
    expect(result?.endIndex).toBe(5);
    expect(result?.avgAqi).toBe(42);
    expect(result?.maxAqi).toBe(45);
  });

  it('enforces stricter Asthma threshold (AQI <= 50)', () => {
    // Valley has AQI 60, 62, 65 -> exceeds asthma threshold 50, but safe for runner 80
    const points = createMockPoints([
      120, 110, 80, 60, 62, 65, 90, 130, 150, 160, 170, 160,
      140, 130, 120, 110, 95, 85, 75, 80, 90, 110, 125, 130,
    ]);

    const asthmaResult = findBestTimeWindow(points, 'asthma', undefined, 3);
    expect(asthmaResult).not.toBeNull();
    expect(asthmaResult?.isSafe).toBe(false); // No window <= 50

    const runnerResult = findBestTimeWindow(points, 'runner', undefined, 3);
    expect(runnerResult?.isSafe).toBe(true); // Window <= 80
    expect(runnerResult?.startIndex).toBe(3);
  });

  it('respects custom configurable threshold for Runners & Athletes', () => {
    const points = createMockPoints([
      120, 110, 80, 55, 58, 60, 90, 130, 150, 160, 170, 160,
      140, 130, 120, 110, 95, 85, 75, 80, 90, 110, 125, 130,
    ]);

    // Custom threshold of 50 -> should be unsafe
    const strictRunner = findBestTimeWindow(points, 'runner', 50, 3);
    expect(strictRunner?.isSafe).toBe(false);

    // Custom threshold of 65 -> should be safe
    const relaxedRunner = findBestTimeWindow(points, 'runner', 65, 3);
    expect(relaxedRunner?.isSafe).toBe(true);
    expect(relaxedRunner?.threshold).toBe(65);
  });
});

