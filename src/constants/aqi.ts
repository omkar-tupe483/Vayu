/**
 * Single source of truth for AQI categories, thresholds, and colors.
 * RULE: Never duplicate colors elsewhere in the codebase.
 */

export type AQILevel =
  | 'good'
  | 'moderate'
  | 'unhealthy_sensitive'
  | 'unhealthy'
  | 'very_unhealthy'
  | 'hazardous';

export interface AQICategoryDefinition {
  level: AQILevel;
  min: number;
  max: number;
  translationKey: string;
  colorName: 'green' | 'yellow' | 'orange' | 'red' | 'purple' | 'maroon';
  hex: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  dotColor: string;
  gradientBg: string;
  adviceTranslationKey: string;
}

export const AQI_SCALE: readonly AQICategoryDefinition[] = [
  {
    level: 'good',
    min: 0,
    max: 50,
    translationKey: 'aqi.levels.good',
    colorName: 'green',
    hex: '#10b981',
    badgeBg: 'bg-emerald-500/15',
    badgeBorder: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    dotColor: 'bg-emerald-400',
    gradientBg: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    adviceTranslationKey: 'aqi.advice.good',
  },
  {
    level: 'moderate',
    min: 51,
    max: 100,
    translationKey: 'aqi.levels.moderate',
    colorName: 'yellow',
    hex: '#eab308',
    badgeBg: 'bg-yellow-500/15',
    badgeBorder: 'border-yellow-500/30',
    textColor: 'text-amber-400',
    dotColor: 'bg-amber-400',
    gradientBg: 'from-amber-500/10 via-yellow-500/5 to-transparent',
    adviceTranslationKey: 'aqi.advice.moderate',
  },
  {
    level: 'unhealthy_sensitive',
    min: 101,
    max: 150,
    translationKey: 'aqi.levels.unhealthy_sensitive',
    colorName: 'orange',
    hex: '#f97316',
    badgeBg: 'bg-orange-500/15',
    badgeBorder: 'border-orange-500/30',
    textColor: 'text-orange-400',
    dotColor: 'bg-orange-400',
    gradientBg: 'from-orange-500/10 via-amber-500/5 to-transparent',
    adviceTranslationKey: 'aqi.advice.unhealthy_sensitive',
  },
  {
    level: 'unhealthy',
    min: 151,
    max: 200,
    translationKey: 'aqi.levels.unhealthy',
    colorName: 'red',
    hex: '#ef4444',
    badgeBg: 'bg-rose-500/15',
    badgeBorder: 'border-rose-500/30',
    textColor: 'text-rose-400',
    dotColor: 'bg-rose-500',
    gradientBg: 'from-rose-500/10 via-red-500/5 to-transparent',
    adviceTranslationKey: 'aqi.advice.unhealthy',
  },
  {
    level: 'very_unhealthy',
    min: 201,
    max: 300,
    translationKey: 'aqi.levels.very_unhealthy',
    colorName: 'purple',
    hex: '#a855f7',
    badgeBg: 'bg-purple-500/15',
    badgeBorder: 'border-purple-500/30',
    textColor: 'text-purple-400',
    dotColor: 'bg-purple-400',
    gradientBg: 'from-purple-500/10 via-violet-500/5 to-transparent',
    adviceTranslationKey: 'aqi.advice.very_unhealthy',
  },
  {
    level: 'hazardous',
    min: 301,
    max: Infinity,
    translationKey: 'aqi.levels.hazardous',
    colorName: 'maroon',
    hex: '#800000',
    badgeBg: 'bg-[#4c0519]/80',
    badgeBorder: 'border-[#881337]',
    textColor: 'text-rose-200',
    dotColor: 'bg-[#800000]',
    gradientBg: 'from-[#4c0519]/40 via-red-950/20 to-transparent',
    adviceTranslationKey: 'aqi.advice.hazardous',
  },
] as const;

export function getAQICategory(aqi: number): AQICategoryDefinition {
  const boundedAqi = Math.max(0, aqi);
  for (const category of AQI_SCALE) {
    if (boundedAqi >= category.min && boundedAqi <= category.max) {
      return category;
    }
  }
  return AQI_SCALE[AQI_SCALE.length - 1]!;
}

export function getAQIHexColor(aqi: number): string {
  return getAQICategory(aqi).hex;
}

export interface PollutantThreshold {
  pollutant: 'pm2_5' | 'pm10' | 'nitrogen_dioxide' | 'ozone';
  goodMax: number;
  moderateMax: number;
  unhealthyMax: number;
}

export const POLLUTANT_THRESHOLDS: Record<string, PollutantThreshold> = {
  pm2_5: { pollutant: 'pm2_5', goodMax: 12.0, moderateMax: 35.4, unhealthyMax: 150.4 },
  pm10: { pollutant: 'pm10', goodMax: 54.0, moderateMax: 154.0, unhealthyMax: 354.0 },
  nitrogen_dioxide: { pollutant: 'nitrogen_dioxide', goodMax: 40.0, moderateMax: 80.0, unhealthyMax: 180.0 },
  ozone: { pollutant: 'ozone', goodMax: 50.0, moderateMax: 100.0, unhealthyMax: 168.0 },
};

/**
 * Honest disclosure and health guidance guidelines
 */
export const DATA_DISCLOSURE_LABEL =
  'Open-Meteo values are modelled atmospheric estimates, not ground-sensor readings.';

export const HEALTH_GUIDANCE_DISCLAIMER =
  'Health content is general wellness guidance, never a medical diagnosis.';

