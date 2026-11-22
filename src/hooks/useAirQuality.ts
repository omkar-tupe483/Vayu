import { useState, useEffect, useCallback } from 'react';
import { AirQualityData } from '../types/airQuality';
import { airQualityService } from '../services/airQualityService';

export function useAirQuality(initialCity: string = 'Delhi') {
  const [city, setCity] = useState(initialCity);
  const [data, setData] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAQI = useCallback(async (targetCity: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await airQualityService.getLiveAirQuality(targetCity);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch air quality data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAQI(city);
  }, [city, fetchAQI]);

  const refresh = () => fetchAQI(city);

  return {
    city,
    setCity,
    data,
    loading,
    error,
    refresh,
  };
}
