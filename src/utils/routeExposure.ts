import { getAqiCategory, AqiCategory } from '../constants/aqi';

export interface RoutePointAqi {
  latitude: number;
  longitude: number;
  aqi: number;
  pm2_5?: number;
  pm10?: number;
  distanceFromStartKm: number;
}

export interface EvaluatedRoute {
  id: string;
  name: string;
  distanceKm: number;
  durationMinutes: number;
  mode: 'walking' | 'cycling' | 'driving';
  coordinates: [number, number][]; // [lat, lng]
  samplePoints: RoutePointAqi[];
  weightedAqi: number;
  peakAqi: number;
  peakPoint?: RoutePointAqi;
  category: AqiCategory;
  isCleanest: boolean;
  isFastest: boolean;
  cleanerPercentageVsFastest?: number; // e.g. 24 (%)
}

/**
 * Haversine formula to calculate great-circle distance between two coordinates in kilometers.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Sample N evenly-spaced coordinates along a route polyline.
 */
export function sampleCoordinates(
  coordinates: [number, number][],
  sampleCount = 6
): [number, number][] {
  if (!coordinates || coordinates.length === 0) return [];
  if (coordinates.length <= sampleCount) return [...coordinates];

  const sampled: [number, number][] = [];
  const step = (coordinates.length - 1) / (sampleCount - 1);

  for (let i = 0; i < sampleCount; i++) {
    const idx = Math.min(coordinates.length - 1, Math.round(i * step));
    const coord = coordinates[idx];
    if (coord) {
      sampled.push(coord);
    }
  }

  return sampled;
}

/**
 * Distance-weighted exposure calculation:
 * Weighted AQI = sum(segment_length_km * point_aqi) / total_distance_km
 */
export function calculateRouteExposure(
  points: { latitude: number; longitude: number; aqi: number }[],
  totalDistanceKm: number
): { weightedAqi: number; peakAqi: number; peakPoint?: RoutePointAqi } {
  if (!points || points.length === 0) {
    return { weightedAqi: 0, peakAqi: 0 };
  }

  if (points.length === 1) {
    const p = points[0]!;
    const single: RoutePointAqi = {
      latitude: p.latitude,
      longitude: p.longitude,
      aqi: p.aqi,
      distanceFromStartKm: 0,
    };
    return { weightedAqi: p.aqi, peakAqi: p.aqi, peakPoint: single };
  }

  let runningDistance = 0;
  const samplePoints: RoutePointAqi[] = [];
  let weightedSum = 0;
  let totalSegmentsLength = 0;
  let peakAqi = -1;
  let peakPoint: RoutePointAqi | undefined;

  for (let i = 0; i < points.length; i++) {
    const curr = points[i]!;
    if (i > 0) {
      const prev = points[i - 1]!;
      const segDist = calculateDistanceKm(
        prev.latitude,
        prev.longitude,
        curr.latitude,
        curr.longitude
      );
      runningDistance += segDist;
      totalSegmentsLength += segDist;

      // Average AQI of the segment * segment length
      const segmentAvgAqi = (prev.aqi + curr.aqi) / 2;
      weightedSum += segmentAvgAqi * segDist;
    }

    const ptAqi: RoutePointAqi = {
      latitude: curr.latitude,
      longitude: curr.longitude,
      aqi: curr.aqi,
      distanceFromStartKm: runningDistance,
    };
    samplePoints.push(ptAqi);

    if (curr.aqi > peakAqi) {
      peakAqi = curr.aqi;
      peakPoint = ptAqi;
    }
  }

  const effectiveDist = totalSegmentsLength > 0 ? totalSegmentsLength : Math.max(0.1, totalDistanceKm);
  const weightedAqi = Math.round(weightedSum / effectiveDist);

  return {
    weightedAqi: Math.max(0, weightedAqi || samplePoints[0]?.aqi || 0),
    peakAqi: Math.max(0, peakAqi),
    peakPoint,
  };
}

/**
 * Compare multiple route options, identifying the Cleanest and Fastest,
 * and calculating relative cleaner percentages.
 */
export function rankAndCompareRoutes(
  routes: Array<{
    id: string;
    name: string;
    distanceKm: number;
    durationMinutes: number;
    mode: 'walking' | 'cycling' | 'driving';
    coordinates: [number, number][];
    samples: { latitude: number; longitude: number; aqi: number; pm2_5?: number; pm10?: number }[];
  }>
): EvaluatedRoute[] {
  if (routes.length === 0) return [];

  const evaluated: EvaluatedRoute[] = routes.map((r) => {
    const { weightedAqi, peakAqi, peakPoint } = calculateRouteExposure(r.samples, r.distanceKm);
    const category = getAqiCategory(weightedAqi);

    return {
      id: r.id,
      name: r.name,
      distanceKm: r.distanceKm,
      durationMinutes: r.durationMinutes,
      mode: r.mode,
      coordinates: r.coordinates,
      samplePoints: r.samples.map((s, idx) => ({
        ...s,
        distanceFromStartKm: (r.distanceKm / Math.max(1, r.samples.length - 1)) * idx,
      })),
      weightedAqi,
      peakAqi,
      peakPoint,
      category,
      isCleanest: false,
      isFastest: false,
    };
  });

  // Find lowest weighted AQI (cleanest) and lowest duration (fastest)
  let lowestAqi = Infinity;
  let lowestDuration = Infinity;
  let cleanestIndex = 0;
  let fastestIndex = 0;

  evaluated.forEach((r, idx) => {
    if (r.weightedAqi < lowestAqi) {
      lowestAqi = r.weightedAqi;
      cleanestIndex = idx;
    }
    if (r.durationMinutes < lowestDuration) {
      lowestDuration = r.durationMinutes;
      fastestIndex = idx;
    }
  });

  const cleanestRoute = evaluated[cleanestIndex];
  if (cleanestRoute) {
    cleanestRoute.isCleanest = true;
  }

  const fastestRoute = evaluated[fastestIndex];
  if (fastestRoute) {
    fastestRoute.isFastest = true;
  }

  // Calculate percentage improvement of cleanest vs fastest
  const fastestAqi = fastestRoute?.weightedAqi ?? lowestAqi;
  evaluated.forEach((r) => {
    if (r.isCleanest && fastestAqi > 0 && fastestAqi > r.weightedAqi) {
      const diff = ((fastestAqi - r.weightedAqi) / fastestAqi) * 100;
      r.cleanerPercentageVsFastest = Math.round(diff);
    }
  });

  return evaluated;
}
