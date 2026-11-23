import { GeoCityItem } from '../schemas/geocodingSchema';

export const DEFAULT_CITY: GeoCityItem = {
  id: 1273294,
  name: 'Delhi',
  country: 'India',
  admin1: 'Delhi',
  latitude: 28.65195,
  longitude: 77.23149,
};

export const POPULAR_CITIES: GeoCityItem[] = [
  DEFAULT_CITY,
  { id: 1275339, name: 'Mumbai', country: 'India', admin1: 'Maharashtra', latitude: 19.07283, longitude: 72.88261 },
  { id: 1259229, name: 'Pune', country: 'India', admin1: 'Maharashtra', latitude: 18.51957, longitude: 73.85535 },
  { id: 1277333, name: 'Bengaluru', country: 'India', admin1: 'Karnataka', latitude: 12.97194, longitude: 77.59369 },
  { id: 2643743, name: 'London', country: 'United Kingdom', admin1: 'England', latitude: 51.50853, longitude: -0.12574 },
  { id: 5128581, name: 'New York', country: 'United States', admin1: 'New York', latitude: 40.71427, longitude: -74.00597 },
];

