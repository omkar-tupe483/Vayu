import { useQuery } from '@tanstack/react-query';
import { CityLocation } from '../constants/cities';
import { fetchAirQualityForecast } from '../services/forecast';
import { CleanForecastModel } from '../schemas/forecastSchema';

export function useAirQualityForecast(city: CityLocation) {
  return useQuery<CleanForecastModel, Error>({
    queryKey: ['hourly-forecast', city.latitude, city.longitude],
    queryFn: ({ signal }) => fetchAirQualityForecast(city, signal),
    staleTime: 15 * 60 * 1000, // 15 minutes stale time
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

