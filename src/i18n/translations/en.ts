import { TranslationDictionary } from '../types';

export const enTranslations: TranslationDictionary = {
  // Brand
  'brand.name': 'Vayu',
  'brand.tagline': 'Know your air. Breathe smarter.',
  'brand.subtitle': 'Urban Air Quality Assistant',

  // Navigation & Accessibility
  'nav.skipToContent': 'Skip to main content',
  'nav.home': 'Dashboard',
  'nav.routes': 'Clean Routes',
  'nav.health': 'Health Guidance',
  'nav.about': 'About & Methodology',
  'nav.language': 'Language',
  'nav.selectLanguage': 'Select interface language',

  // Search
  'search.placeholder': 'Search any city worldwide (e.g. Delhi, Mumbai, London)...',
  'search.quickPicks': 'Quick picks:',
  'search.searching': 'Searching Open-Meteo geocoding...',
  'search.clear': 'Clear search',
  'search.noResults': 'No cities found for',
  'search.error': 'Unable to search cities. Please check connection.',

  // AQI Overview Card
  'aqi.title': 'Air Quality Index',
  'aqi.scale': 'US AQI Scale',
  'aqi.measuredAt': 'Estimated for',
  'aqi.refresh': 'Refresh',
  'aqi.refreshing': 'Refreshing...',
  'aqi.liveSnapshot': 'Atmospheric Snapshot',

  // AQI Levels (Colors explicitly in single source of truth)
  'aqi.levels.good': 'Good (Green)',
  'aqi.levels.moderate': 'Moderate (Yellow)',
  'aqi.levels.unhealthy_sensitive': 'Unhealthy for Sensitive Groups (Orange)',
  'aqi.levels.unhealthy': 'Unhealthy (Red)',
  'aqi.levels.very_unhealthy': 'Very Unhealthy (Purple)',
  'aqi.levels.hazardous': 'Hazardous (Maroon)',

  // Health Advice
  'aqi.advice.good': 'Air quality is ideal. Enjoy outdoor recreation and ventilate indoor spaces safely.',
  'aqi.advice.moderate': 'Air quality is acceptable. Unusually sensitive individuals should consider limiting prolonged outdoor exertion.',
  'aqi.advice.unhealthy_sensitive': 'Members of sensitive groups (asthma, heart disease, children, elderly) should wear an N95 mask and limit outdoor exercise.',
  'aqi.advice.unhealthy': 'Everyone may begin experiencing health effects. Avoid prolonged outdoor activity, keep windows shut, and run air purifiers.',
  'aqi.advice.very_unhealthy': 'Health alert: serious risk of harm for all citizens. Stay indoors, seal room drafts, and operate continuous HEPA filtration.',
  'aqi.advice.hazardous': 'Health emergency: entire population is severely affected. Remain strictly indoors and avoid any physical exertion outdoors.',

  // Pollutants
  'pollutants.title': 'Detailed Pollutant Breakdown',
  'pollutants.subtitle': 'Open-Meteo atmospheric dispersion model',
  'pollutants.pm2_5.name': 'PM2.5',
  'pollutants.pm2_5.fullName': 'Fine Particulate Matter',
  'pollutants.pm2_5.description': 'Inhalable particles ≤ 2.5 µm that penetrate deep into the lungs and enter the bloodstream.',
  'pollutants.pm10.name': 'PM10',
  'pollutants.pm10.fullName': 'Inhalable Coarse Particles',
  'pollutants.pm10.description': 'Particles ≤ 10 µm including road dust, pollen, mold, and construction particulates.',
  'pollutants.nitrogen_dioxide.name': 'NO₂',
  'pollutants.nitrogen_dioxide.fullName': 'Nitrogen Dioxide',
  'pollutants.nitrogen_dioxide.description': 'Emitted mainly from fossil fuel combustion, vehicular traffic, and industrial facilities.',
  'pollutants.ozone.name': 'Ozone (O₃)',
  'pollutants.ozone.fullName': 'Ground-level Ozone',
  'pollutants.ozone.description': 'Secondary pollutant created by photochemical reactions between sunlight and VOCs/NOx.',

  // Pollutant Statuses
  'status.good': 'Good',
  'status.moderate': 'Moderate',
  'status.poor': 'Poor',
  'status.unhealthy': 'Unhealthy',
  'status.hazardous': 'Hazardous',

  // Interactive Map
  'map.title': 'Interactive Air Quality Map',
  'map.subtitle': 'Centered on selected coordinates with OpenStreetMap tiles',
  'map.recenter': 'Center on City',
  'map.clickHint': 'Click marker to view AQI & main pollutants',
  'map.legend': 'AQI Scale Legend',

  // States
  'state.loading': 'Fetching live air quality data from Open-Meteo...',
  'state.errorTitle': 'Unable to Fetch Air Quality Data',
  'state.retry': 'Try Again',
  'state.offlineNotice': 'You are currently offline. Showing last cached estimates.',
  'state.empty': 'Select a city above to inspect air quality.',

  // Disclaimers (Strict Honesty & Quality rules)
  'disclaimer.modelled': 'Honest Disclosure: Open-Meteo values are modelled atmospheric estimates, not ground-sensor readings.',
  'disclaimer.health': 'Health Guidance Notice: General wellness information only, never a medical diagnosis or treatment plan.',

  // Footer & About
  'footer.copyright': 'Know your air. Breathe smarter.',
  'footer.poweredBy': 'Powered by Open-Meteo & OpenStreetMap • Free & Open Data',
  'about.title': 'About Vayu',
  'about.description': 'Vayu is a lightweight, frontend-only air quality assistant designed for urban citizens. Built for transparency, accessibility, and zero-barrier access with no logins or API keys required.',
  'about.featuresTitle': 'Core Capabilities',
  'about.feature1Title': 'Modelled Estimates',
  'about.feature1Desc': 'Transparently fetches data from the Open-Meteo Atmospheric Chemistry & Geocoding models.',
  'about.feature2Title': 'Trilingual Accessibility',
  'about.feature2Desc': 'Fully localized in English, Hindi, and Marathi with high contrast and keyboard navigation.',
  'about.feature3Title': 'Zero Tracking & No Keys',
  'about.feature3Desc': 'Everything runs directly in your browser. No cookies, no logins, no cloud databases.',
};
