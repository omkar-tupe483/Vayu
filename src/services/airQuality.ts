import { CityLocation } from '../constants/cities';
import {
  openMeteoCurrentAirQualitySchema,
  CleanAirQualityModel,
} from '../schemas/airQualitySchema';

const AIR_QUALITY_BASE_URL = 'https://api.open-meteo.com/v1/air-quality';

export async function fetchCurrentAirQuality(
  city: CityLocation,
  signal?: AbortSignal
): Promise<CleanAirQualityModel> {
  const currentFields = [
    'pm2_5',
    'pm10',
    'ozone',
    'nitrogen_dioxide',
    'carbon_monoxide',
    'sulphur_dioxide',
    'us_aqi',
    'us_aqi_pm2_5',
    'us_aqi_pm10',
    'us_aqi_nitrogen_dioxide',
    'us_aqi_ozone',
    'us_aqi_sulphur_dioxide',
    'us_aqi_carbon_monoxide',
  ].join(',');

  const url = `${AIR_QUALITY_BASE_URL}?latitude=${city.latitude}&longitude=${city.longitude}&current=${currentFields}&timezone=auto`;

  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Open-Meteo Air Quality error (Status: ${res.status})`);
  }

  const rawJson = await res.json();
  const parsed = openMeteoCurrentAirQualitySchema.parse(rawJson);
  const cur = parsed.current;

  // Identify dominant pollutant by highest sub-index
  const subIndices = [
    { key: 'pm2_5', name: 'Fine Particulates (PM2.5)', val: cur.us_aqi_pm2_5 },
    { key: 'pm10', name: 'Coarse Dust (PM10)', val: cur.us_aqi_pm10 },
    { key: 'ozone', name: 'Ground-level Ozone (O₃)', val: cur.us_aqi_ozone },
    { key: 'nitrogen_dioxide', name: 'Nitrogen Dioxide (NO₂)', val: cur.us_aqi_nitrogen_dioxide },
    { key: 'carbon_monoxide', name: 'Carbon Monoxide (CO)', val: cur.us_aqi_carbon_monoxide },
    { key: 'sulphur_dioxide', name: 'Sulphur Dioxide (SO₂)', val: cur.us_aqi_sulphur_dioxide },
  ];
  subIndices.sort((a, b) => b.val - a.val);
  const dominantPollutant = subIndices[0]?.name || 'PM2.5';

  return {
    city: city.name,
    admin1: city.admin1,
    country: city.country,
    latitude: parsed.latitude,
    longitude: parsed.longitude,
    timezone: parsed.timezone || city.timezone,
    time: cur.time,
    us_aqi: cur.us_aqi,
    pollutants: {
      pm2_5: {
        key: 'pm2_5',
        name: 'Fine Particles (PM2.5)',
        formula: 'PM₂.₅',
        value: cur.pm2_5,
        unit: 'μg/m³',
        subAqi: cur.us_aqi_pm2_5,
        description: 'Microscopic combustion and smoke particles that penetrate deep into lung alveoli.',
      },
      pm10: {
        key: 'pm10',
        name: 'Inhalable Dust (PM10)',
        formula: 'PM₁₀',
        value: cur.pm10,
        unit: 'μg/m³',
        subAqi: cur.us_aqi_pm10,
        description: 'Coarse dust, pollen, and construction particulates that irritate upper airways.',
      },
      ozone: {
        key: 'ozone',
        name: 'Surface Ozone',
        formula: 'O₃',
        value: cur.ozone,
        unit: 'μg/m³',
        subAqi: cur.us_aqi_ozone,
        description: 'Secondary photochemical smog formed by sunlight reacting with vehicular emissions.',
      },
      nitrogen_dioxide: {
        key: 'nitrogen_dioxide',
        name: 'Nitrogen Dioxide',
        formula: 'NO₂',
        value: cur.nitrogen_dioxide,
        unit: 'μg/m³',
        subAqi: cur.us_aqi_nitrogen_dioxide,
        description: 'Corrosive exhaust gas emitted from diesel and gasoline combustion engines.',
      },
      carbon_monoxide: {
        key: 'carbon_monoxide',
        name: 'Carbon Monoxide',
        formula: 'CO',
        value: cur.carbon_monoxide,
        unit: 'μg/m³',
        subAqi: cur.us_aqi_carbon_monoxide,
        description: 'Toxic, odorless gas produced by incomplete combustion that reduces blood oxygenation.',
      },
      sulphur_dioxide: {
        key: 'sulphur_dioxide',
        name: 'Sulphur Dioxide',
        formula: 'SO₂',
        value: cur.sulphur_dioxide,
        unit: 'μg/m³',
        subAqi: cur.us_aqi_sulphur_dioxide,
        description: 'Acidic industrial gas produced by thermal power plants and coal combustion.',
      },
    },
    dominantPollutant,
    isModelledEstimate: true,
  };
}

