import { HourlyForecastPoint } from '../schemas/forecastSchema';

export type HealthProfileId = 'general' | 'runner' | 'child_elderly' | 'asthma';

export interface HealthProfileConfig {
  id: HealthProfileId;
  labelKey: string;
  defaultThreshold: number;
  isCustomizable?: boolean;
  minThreshold?: number;
  maxThreshold?: number;
}

export const HEALTH_PROFILES: Record<HealthProfileId, HealthProfileConfig> = {
  asthma: {
    id: 'asthma',
    labelKey: 'forecast.profiles.asthma',
    defaultThreshold: 50,
  },
  child_elderly: {
    id: 'child_elderly',
    labelKey: 'forecast.profiles.child_elderly',
    defaultThreshold: 70,
  },
  runner: {
    id: 'runner',
    labelKey: 'forecast.profiles.runner',
    defaultThreshold: 80,
    isCustomizable: true,
    minThreshold: 40,
    maxThreshold: 120,
  },
  general: {
    id: 'general',
    labelKey: 'forecast.profiles.general',
    defaultThreshold: 100,
    isCustomizable: true,
    minThreshold: 50,
    maxThreshold: 150,
  },
};

export interface BestTimeWindowResult {
  startIndex: number;
  endIndex: number;
  startPoint: HourlyForecastPoint;
  endPoint: HourlyForecastPoint;
  durationHours: number;
  avgAqi: number;
  maxAqi: number;
  isSafe: boolean;
  threshold: number;
  profileId: HealthProfileId;
  reason: string;
  points: HourlyForecastPoint[];
}

/**
 * Pure function to identify the optimal continuous outdoor window (default 3 hours).
 */
export function findBestTimeWindow(
  hourly: HourlyForecastPoint[],
  profileId: HealthProfileId = 'general',
  customThreshold?: number,
  windowHours = 3
): BestTimeWindowResult | null {
  if (!hourly || hourly.length === 0) return null;

  const profile = HEALTH_PROFILES[profileId] || HEALTH_PROFILES.general;
  const threshold = typeof customThreshold === 'number' && !isNaN(customThreshold)
    ? customThreshold
    : profile.defaultThreshold;

  const effectiveWindowHours = Math.max(1, Math.min(windowHours, hourly.length));
  const candidateCount = hourly.length - effectiveWindowHours + 1;

  interface Candidate {
    startIndex: number;
    endIndex: number;
    avgAqi: number;
    maxAqi: number;
    isSafe: boolean;
  }

  const candidates: Candidate[] = [];

  for (let i = 0; i < candidateCount; i++) {
    const slice = hourly.slice(i, i + effectiveWindowHours);
    const sumAqi = slice.reduce((acc, point) => acc + (point.us_aqi || 0), 0);
    const avgAqi = Math.round(sumAqi / effectiveWindowHours);
    const maxAqi = Math.max(...slice.map((p) => p.us_aqi || 0));
    const isSafe = maxAqi <= threshold;

    candidates.push({
      startIndex: i,
      endIndex: i + effectiveWindowHours - 1,
      avgAqi,
      maxAqi,
      isSafe,
    });
  }

  const safeCandidates = candidates.filter((c) => c.isSafe);
  let chosen: Candidate | undefined;
  let hasSafe = false;

  if (safeCandidates.length > 0) {
    hasSafe = true;
    safeCandidates.sort((a, b) => {
      if (a.avgAqi !== b.avgAqi) return a.avgAqi - b.avgAqi;
      if (a.maxAqi !== b.maxAqi) return a.maxAqi - b.maxAqi;
      return a.startIndex - b.startIndex;
    });
    chosen = safeCandidates[0];
  } else {
    hasSafe = false;
    candidates.sort((a, b) => {
      if (a.avgAqi !== b.avgAqi) return a.avgAqi - b.avgAqi;
      if (a.maxAqi !== b.maxAqi) return a.maxAqi - b.maxAqi;
      return a.startIndex - b.startIndex;
    });
    chosen = candidates[0];
  }

  if (!chosen) return null;

  const startPoint = hourly[chosen.startIndex];
  const endPoint = hourly[chosen.endIndex];
  if (!startPoint || !endPoint) return null;

  let reason = '';
  if (!hasSafe) {
    reason = `All upcoming periods exceed your safe threshold of AQI ${threshold}. Even the cleanest window reaches AQI ${chosen.avgAqi}.`;
  } else if (chosen.avgAqi <= 50) {
    reason = `Optimal continuous period for outdoor runs, commuting, and opening home windows safely (avg AQI ${chosen.avgAqi}).`;
  } else {
    reason = `Acceptable outdoor window within your threshold (avg AQI ${chosen.avgAqi}). Monitor sensitive symptoms.`;
  }

  return {
    startIndex: chosen.startIndex,
    endIndex: chosen.endIndex,
    startPoint,
    endPoint,
    durationHours: effectiveWindowHours,
    avgAqi: chosen.avgAqi,
    maxAqi: chosen.maxAqi,
    isSafe: hasSafe,
    threshold,
    profileId,
    reason,
    points: hourly.slice(chosen.startIndex, chosen.endIndex + 1),
  };
}

