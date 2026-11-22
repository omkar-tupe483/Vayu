import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { openMeteoService } from '../services/openMeteo';
import { GeoCityItem } from '../schemas/geocodingSchema';

export function useCitySearch(debounceMs: number = 300) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  const {
    data: cities = [],
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery<GeoCityItem[], Error>({
    queryKey: ['citySearch', debouncedTerm],
    queryFn: () => openMeteoService.searchCities(debouncedTerm, 8),
    enabled: debouncedTerm.length >= 2,
    staleTime: 10 * 60 * 1000,
  });

  return {
    searchTerm,
    setSearchTerm,
    debouncedTerm,
    cities,
    isLoading: isLoading || (searchTerm.trim().length >= 2 && isFetching),
    isError,
    error,
    clearSearch: () => {
      setSearchTerm('');
      setDebouncedTerm('');
    },
  };
}
