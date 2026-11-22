import { AirQualityData } from '../types/airQuality';
import { getAQIStatus } from '../utils/aqiUtils';

const CITY_MOCK_DATA: Record<string, { aqi: number; pm25: number; pm10: number; no2: number; so2: number; o3: number; co: number }> = {
  Delhi: { aqi: 242, pm25: 192.5, pm10: 310.2, no2: 54.3, so2: 18.1, o3: 28.4, co: 2.1 },
  Mumbai: { aqi: 112, pm25: 41.2, pm10: 95.8, no2: 32.1, so2: 11.4, o3: 35.0, co: 0.9 },
  Bengaluru: { aqi: 48, pm25: 12.0, pm10: 34.6, no2: 19.8, so2: 6.2, o3: 22.1, co: 0.4 },
  Kolkata: { aqi: 165, pm25: 88.0, pm10: 172.4, no2: 44.5, so2: 15.0, o3: 31.2, co: 1.4 },
  Chennai: { aqi: 56, pm25: 15.4, pm10: 48.0, no2: 21.0, so2: 8.5, o3: 26.0, co: 0.5 },
};

export const airQualityService = {
  async getLiveAirQuality(city: string = 'Delhi'): Promise<AirQualityData> {
    // Simulated realistic API latency
    await new Promise((resolve) => setTimeout(resolve, 300));

    const metrics = CITY_MOCK_DATA[city] || {
      aqi: 75,
      pm25: 24.0,
      pm10: 58.0,
      no2: 25.0,
      so2: 9.0,
      o3: 30.0,
      co: 0.6,
    };

    const { status, recommendation } = getAQIStatus(metrics.aqi);

    return {
      city,
      aqi: metrics.aqi,
      status,
      dominantPollutant: 'PM2.5',
      pollutants: {
        pm25: metrics.pm25,
        pm10: metrics.pm10,
        o3: metrics.o3,
        no2: metrics.no2,
        so2: metrics.so2,
        co: metrics.co,
      },
      recommendation,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  },
};
