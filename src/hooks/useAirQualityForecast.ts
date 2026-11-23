import { useQuery } from '@tanstack/react-query';
import { openMeteoService } from '../services/openMeteo';
import { GeoCityItem } from '../schemas/geocodingSchema';
import { CleanForecastModel } from '../schemas/forecastSchema';

export function useAirQualityForecast(city: GeoCityItem) {
  return useQuery<CleanForecastModel, Error>({
    queryKey: ['airQualityForecast', city.latitude, city.longitude],
    queryFn: () => openMeteoService.fetchHourlyForecast(city),
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
}
