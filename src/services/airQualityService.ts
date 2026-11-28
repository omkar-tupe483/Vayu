import { AirQualityData, HourlyForecastPoint, AQICategory, PollutantValues } from '../types';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

interface CacheEntry {
  timestamp: number;
  data: AirQualityData;
}

const memoryCache = new Map<string, CacheEntry>();

export const PRESET_CITIES = [
  { name: 'Delhi', lat: 28.6139, lon: 77.209, country: 'India' },
  { name: 'Pune', lat: 18.5204, lon: 73.8567, country: 'India' },
  { name: 'Mumbai', lat: 19.076, lon: 72.8777, country: 'India' },
  { name: 'Lahore', lat: 31.5204, lon: 74.3587, country: 'Pakistan' },
  { name: 'Beijing', lat: 39.9042, lon: 116.4074, country: 'China' },
  { name: 'London', lat: 51.5074, lon: -0.1278, country: 'UK' },
];

export const DEMO_SEVERE_SMOG_DATA: AirQualityData = {
  city: 'Delhi (Severe Smog Simulation)',
  aqi: 384,
  category: 'Hazardous',
  dominantPollutant: 'PM2.5',
  pollutants: {
    pm2_5: 342.5,
    pm10: 480.2,
    no2: 89.4,
    o3: 45.1,
    co: 3200,
    so2: 42.0,
  },
  timestamp: new Date().toISOString(),
  hourly24h: [
    { time: '06:00', aqi: 410, pm2_5: 380 },
    { time: '08:00', aqi: 435, pm2_5: 410 },
    { time: '10:00', aqi: 390, pm2_5: 350 },
    { time: '12:00', aqi: 340, pm2_5: 290 },
    { time: '14:00', aqi: 310, pm2_5: 260, isBestWindow: true },
    { time: '16:00', aqi: 325, pm2_5: 275, isBestWindow: true },
    { time: '18:00', aqi: 380, pm2_5: 340 },
    { time: '20:00', aqi: 415, pm2_5: 390 },
    { time: '22:00', aqi: 440, pm2_5: 420 },
  ],
  forecast48h: [
    { time: 'Day 1 Morning', aqi: 420, pm2_5: 390 },
    { time: 'Day 1 Afternoon', aqi: 320, pm2_5: 270 },
    { time: 'Day 1 Evening', aqi: 430, pm2_5: 400 },
    { time: 'Day 2 Morning', aqi: 390, pm2_5: 350 },
    { time: 'Day 2 Afternoon', aqi: 280, pm2_5: 230 },
    { time: 'Day 2 Evening', aqi: 360, pm2_5: 320 },
  ],
  bestWindow: {
    startTime: '13:00',
    endTime: '16:00',
    estimatedAqi: 310,
    reason: 'Midday thermal boundary layer rises, dispersing concentrated ground-level particulate matter slightly.',
  },
  isDemo: true,
};

export function getCategoryFromAQI(aqi: number): AQICategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

export function findBestWindow(hourly: HourlyForecastPoint[]): {
  startTime: string;
  endTime: string;
  estimatedAqi: number;
  reason: string;
} | null {
  if (!hourly || hourly.length < 3) return null;

  // Find 2-consecutive hour window with the lowest average AQI
  let minAvg = Infinity;
  let bestIdx = 0;

  for (let i = 0; i < hourly.length - 1; i++) {
    const p1 = hourly[i];
    const p2 = hourly[i + 1];
    if (p1 && p2) {
      const avg = (p1.aqi + p2.aqi) / 2;
      if (avg < minAvg) {
        minAvg = avg;
        bestIdx = i;
      }
    }
  }

  const start = hourly[bestIdx]?.time || '12:00';
  const end = hourly[bestIdx + 1]?.time || '14:00';
  const avgVal = Math.round(minAvg);

  let reason = 'Atmospheric dispersion and sunlight break up shallow ground smog.';
  if (avgVal <= 50) {
    reason = 'Optimal window with clean air. Safe for running and household ventilation.';
  } else if (avgVal <= 100) {
    reason = 'Lowest pollution dip of the day. Complete outdoor chores during this period.';
  } else {
    reason = 'Relative pollution dip, though air remains elevated. Keep outdoor time brief with N95 mask.';
  }

  return {
    startTime: start,
    endTime: end,
    estimatedAqi: avgVal,
    reason,
  };
}

export async function fetchLiveAirQuality(
  city: string,
  lat: number,
  lon: number,
  forceRefresh = false
): Promise<AirQualityData> {
  const cacheKey = `${lat.toFixed(2)}_${lon.toFixed(2)}`;

  if (!forceRefresh) {
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5,nitrogen_dioxide,ozone,us_aqi&timezone=auto&forecast_days=3`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP ${res.status}`);
    }

    interface OpenMeteoHourlyResponse {
      hourly: {
        time: string[];
        us_aqi: (number | null)[];
        pm2_5: (number | null)[];
        pm10: (number | null)[];
        nitrogen_dioxide: (number | null)[];
        ozone: (number | null)[];
      };
    }

    const json = (await res.json()) as OpenMeteoHourlyResponse;
    const times = json.hourly?.time || [];
    const aqis = json.hourly?.us_aqi || [];
    const pm25s = json.hourly?.pm2_5 || [];
    const pm10s = json.hourly?.pm10 || [];
    const no2s = json.hourly?.nitrogen_dioxide || [];
    const o3s = json.hourly?.ozone || [];

    const currentAqi = Math.round(aqis[0] ?? 65);
    const pollutants: PollutantValues = {
      pm2_5: Math.round((pm25s[0] ?? 22) * 10) / 10,
      pm10: Math.round((pm10s[0] ?? 45) * 10) / 10,
      no2: Math.round((no2s[0] ?? 18) * 10) / 10,
      o3: Math.round((o3s[0] ?? 25) * 10) / 10,
    };

    // Determine dominant pollutant
    let dominant = 'PM2.5';
    if (pollutants.pm10 > pollutants.pm2_5 * 2) dominant = 'PM10';
    if (pollutants.no2 > 60) dominant = 'NO₂';

    // Build 24h hourly points (sample every 2 hours for lightweight SVG rendering)
    const hourly24h: HourlyForecastPoint[] = [];
    for (let i = 0; i < Math.min(24, times.length); i += 2) {
      const rawTime = times[i] || '';
      const hourPart = rawTime.includes('T') ? rawTime.split('T')[1]?.slice(0, 5) || rawTime : rawTime;
      hourly24h.push({
        time: hourPart,
        aqi: Math.round(aqis[i] ?? currentAqi),
        pm2_5: Math.round(pm25s[i] ?? pollutants.pm2_5),
      });
    }

    // Build 48h overview
    const forecast48h: HourlyForecastPoint[] = [];
    for (let i = 0; i < Math.min(48, times.length); i += 8) {
      const rawTime = times[i] || '';
      const hourPart = rawTime.includes('T') ? rawTime.split('T')[1]?.slice(0, 5) || rawTime : rawTime;
      forecast48h.push({
        time: hourPart,
        aqi: Math.round(aqis[i] ?? currentAqi),
        pm2_5: Math.round(pm25s[i] ?? pollutants.pm2_5),
      });
    }

    const bestWindow = findBestWindow(hourly24h);
    if (bestWindow) {
      // Mark matching points
      hourly24h.forEach((pt) => {
        if (pt.time === bestWindow.startTime || pt.time === bestWindow.endTime) {
          pt.isBestWindow = true;
        }
      });
    }

    const result: AirQualityData = {
      city,
      aqi: currentAqi,
      category: getCategoryFromAQI(currentAqi),
      dominantPollutant: dominant,
      pollutants,
      timestamp: new Date().toISOString(),
      hourly24h,
      forecast48h,
      bestWindow,
    };

    memoryCache.set(cacheKey, { timestamp: Date.now(), data: result });
    return result;
  } catch (err) {
    console.warn(`Live air quality fetch failed for ${city}, using realistic fallback:`, err);
    return {
      ...DEMO_SEVERE_SMOG_DATA,
      city,
      isDemo: true,
    };
  }
}

export async function searchCities(query: string): Promise<Array<{ name: string; lat: number; lon: number; country: string }>> {
  const q = query.trim().toLowerCase();
  if (!q) return PRESET_CITIES;

  // Filter preset first
  const localMatches = PRESET_CITIES.filter((c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q));
  if (localMatches.length > 0) return localMatches;

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return localMatches;
    interface GeocodingResult {
      results?: Array<{ name: string; latitude: number; longitude: number; country?: string }>;
    }
    const json = (await res.json()) as GeocodingResult;
    if (!json.results) return localMatches;
    return json.results.map((r) => ({
      name: r.name,
      lat: r.latitude,
      lon: r.longitude,
      country: r.country || '',
    }));
  } catch {
    return localMatches;
  }
}
