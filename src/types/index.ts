export type Confidence = 'Low' | 'Medium' | 'High';
export type Effort = 'Easy' | 'Moderate' | 'High';
export type Cost = 'Free' | 'Low' | 'Medium' | 'High';

export type AQICategory =
  | 'Good'
  | 'Moderate'
  | 'Unhealthy for Sensitive'
  | 'Unhealthy'
  | 'Very Unhealthy'
  | 'Hazardous';

export interface AQIBandInfo {
  category: AQICategory;
  shape: 'Circle' | 'Triangle' | 'Diamond' | 'Pentagon' | 'Hexagon' | 'Octagon';
  symbol: string;
  label: string;
  headline: string;
  colorName: 'powder-blue' | 'lavender' | 'sunset-peach' | 'amber' | 'rose' | 'maroon';
}

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Severe';

export interface HouseholdMember {
  id: string;
  name: string;
  role: 'child' | 'elderly' | 'pregnant' | 'respiratory' | 'pet' | 'adult';
  hasAsthmaOrHeart?: boolean;
  riskLevel: RiskLevel;
}

export interface LifestyleProfile {
  city: string;
  latitude: number;
  longitude: number;
  commuteMode: 'walk' | 'bicycle' | 'metro_bus' | 'car_motorcycle';
  cookingFuel: 'lpg_electric' | 'piped_gas' | 'biomass_wood_coal';
  heatingMethod: 'none_mild' | 'electric_heat' | 'biomass_chulha';
  homeType: 'apartment' | 'detached_house' | 'dense_slum_cluster';
  budgetTier: 'tight' | 'flexible' | 'comfortable';
  hasPurifier: boolean;
}

export interface PollutantValues {
  pm2_5: number;
  pm10: number;
  no2: number;
  o3: number;
  co?: number;
  so2?: number;
}

export interface HourlyForecastPoint {
  time: string; // ISO or '14:00'
  aqi: number;
  pm2_5: number;
  isBestWindow?: boolean;
}

export interface AirQualityData {
  city: string;
  aqi: number;
  category: AQICategory;
  dominantPollutant: string;
  pollutants: PollutantValues;
  timestamp: string;
  hourly24h: HourlyForecastPoint[];
  forecast48h: HourlyForecastPoint[];
  bestWindow: {
    startTime: string;
    endTime: string;
    estimatedAqi: number;
    reason: string;
  } | null;
  isDemo?: boolean;
}

export interface DailyPlanItem {
  id: string;
  timeSlot: 'Morning (6-10 AM)' | 'Midday (10 AM-4 PM)' | 'Evening (4-8 PM)' | 'Night (8 PM-6 AM)';
  action: string;
  whyThisMatters: string;
  estimatedImpact: string;
  confidence: Confidence;
  effort: Effort;
  cost: Cost;
}

export interface RoomHack {
  id: string;
  room: 'Bedroom' | 'Kitchen' | 'Living Room' | 'Balcony/Entry';
  title: string;
  guidance: string;
  ventilationTiming: string;
  purifierTip: string;
  diyOption: {
    description: string;
    honestEffectiveness: string;
  };
  confidence: Confidence;
}

export interface SustainableSwap {
  id: string;
  category: 'Commute' | 'Cooking' | 'Heating' | 'Waste';
  currentHabit: string;
  betterSwap: string;
  whyThisMatters: string;
  weeklyImpact: string;
  effort: Effort;
  confidence: Confidence;
}

export interface WhatIfInputs {
  skipCarTripKm: number; // 0 - 30 km
  switchCookingToClean: boolean;
  runPurifierHours: number; // 0 - 24 hours
  ventilateCleanestHour: boolean;
  wearN95Commute: boolean;
}

export interface WhatIfResult {
  personalExposureReductionPct: number; // e.g. 42%
  communityEmissionAvoidedGrams: number; // e.g. 120g PM2.5/NO2 avoided
  confidence: Confidence;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  groundedAqi?: number;
}
