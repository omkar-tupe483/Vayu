export interface CityLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country: string;
  admin1?: string; // State/Province
}

export const DEFAULT_CITY: CityLocation = {
  id: 1259229,
  name: 'Pune',
  latitude: 18.5204,
  longitude: 73.8567,
  timezone: 'Asia/Kolkata',
  country: 'India',
  admin1: 'Maharashtra',
};

export const POPULAR_CITIES: CityLocation[] = [
  DEFAULT_CITY,
  {
    id: 1273294,
    name: 'Delhi',
    latitude: 28.6519,
    longitude: 77.2315,
    timezone: 'Asia/Kolkata',
    country: 'India',
    admin1: 'Delhi',
  },
  {
    id: 1275339,
    name: 'Mumbai',
    latitude: 19.0728,
    longitude: 72.8826,
    timezone: 'Asia/Kolkata',
    country: 'India',
    admin1: 'Maharashtra',
  },
  {
    id: 1277333,
    name: 'Bengaluru',
    latitude: 12.9719,
    longitude: 77.5937,
    timezone: 'Asia/Kolkata',
    country: 'India',
    admin1: 'Karnataka',
  },
  {
    id: 2643743,
    name: 'London',
    latitude: 51.5085,
    longitude: -0.1257,
    timezone: 'Europe/London',
    country: 'United Kingdom',
    admin1: 'England',
  },
  {
    id: 5128581,
    name: 'New York',
    latitude: 40.7143,
    longitude: -74.006,
    timezone: 'America/New_York',
    country: 'United States',
    admin1: 'New York',
  },
];
