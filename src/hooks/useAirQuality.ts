import { useQuery } from '@tanstack/react-query';
import { CityLocation } from '../constants/cities';
import { fetchCurrentAirQuality } from '../services/airQuality';
import { CleanAirQualityModel } from '../schemas/airQualitySchema';

export function useAirQuality(city: CityLocation) {
  return useQuery<CleanAirQualityModel, Error>({
    queryKey: ['current-air-quality', city.latitude, city.longitude],
    queryFn: ({ signal }) => fetchCurrentAirQuality(city, signal),
    staleTime: 5 * 60 * 1000, // 5 minutes stale time
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
