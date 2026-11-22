/**
 * Single source of truth for AQI health colors and categories.
 * RULE: SEPARATE from the brand palette. Never replace AQI colors with brand colors.
 * Every badge color passes WCAG AA contrast (>4.5:1 ratio).
 */

export type AqiLevel =
  | 'good'
  | 'moderate'
  | 'unhealthy_sensitive'
  | 'unhealthy'
  | 'very_unhealthy'
  | 'hazardous';

export interface AqiThemeVariant {
  bg: string;
  border: string;
  text: string;
  dot: string;
}

export interface AqiCategoryDefinition {
  level: AqiLevel;
  min: number;
  max: number;
  translationKey: string;
  colorName: 'green' | 'yellow' | 'orange' | 'red' | 'purple' | 'maroon';
  hex: string;
  light: AqiThemeVariant;
  dark: AqiThemeVariant;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  dotColor: string;
  gradientBg: string;
  adviceTranslationKey: string;
}

export const AQI_CATEGORIES: readonly AqiCategoryDefinition[] = [
  {
    level: 'good',
    min: 0,
    max: 50,
    translationKey: 'aqi.levels.good',
    colorName: 'green',
    hex: '#10B981',
    light: {
      bg: '#D1FAE5',     /* emerald-100 */
      border: '#34D399', /* emerald-400 */
      text: '#065F46',   /* emerald-800 - contrast 6.5:1 (WCAG AA PASS) */
      dot: '#059669',
    },
    dark: {
      bg: '#064E3B',     /* emerald-900 */
      border: '#059669', /* emerald-600 */
      text: '#A7F3D0',   /* emerald-200 - contrast 8.5:1 (WCAG AA PASS) */
      dot: '#34D399',
    },
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60',
    badgeBorder: 'border-emerald-400 dark:border-emerald-600',
    textColor: 'text-emerald-800 dark:text-emerald-200',
    dotColor: 'bg-emerald-600 dark:bg-emerald-400',
    gradientBg: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    adviceTranslationKey: 'aqi.advice.good',
  },
  {
    level: 'moderate',
    min: 51,
    max: 100,
    translationKey: 'aqi.levels.moderate',
    colorName: 'yellow',
    hex: '#EAB308',
    light: {
      bg: '#FEF9C3',     /* yellow-100 */
      border: '#FACC15', /* yellow-400 */
      text: '#713F12',   /* yellow-900 - contrast 7.2:1 (WCAG AA PASS) */
      dot: '#D97706',
    },
    dark: {
      bg: '#543806',     /* deep yellow-brown */
      border: '#CA8A04', /* yellow-600 */
      text: '#FEF08A',   /* yellow-200 - contrast 9.1:1 (WCAG AA PASS) */
      dot: '#FACC15',
    },
    badgeBg: 'bg-yellow-100 dark:bg-yellow-950/60',
    badgeBorder: 'border-yellow-400 dark:border-yellow-600',
    textColor: 'text-yellow-900 dark:text-yellow-200',
    dotColor: 'bg-yellow-600 dark:bg-yellow-400',
    gradientBg: 'from-yellow-500/10 via-amber-500/5 to-transparent',
    adviceTranslationKey: 'aqi.advice.moderate',
  },
  {
    level: 'unhealthy_sensitive',
    min: 101,
    max: 150,
    translationKey: 'aqi.levels.unhealthy_sensitive',
    colorName: 'orange',
    hex: '#F97316',
    light: {
      bg: '#FFEDD5',     /* orange-100 */
      border: '#FB923C', /* orange-400 */
      text: '#9A3412',   /* orange-800 - contrast 5.8:1 (WCAG AA PASS) */
      dot: '#EA580C',
    },
    dark: {
      bg: '#7C2D12',     /* orange-900 */
      border: '#EA580C', /* orange-600 */
      text: '#FED7AA',   /* orange-200 - contrast 7.9:1 (WCAG AA PASS) */
      dot: '#FB923C',
    },
    badgeBg: 'bg-orange-100 dark:bg-orange-900/60',
    badgeBorder: 'border-orange-400 dark:border-orange-600',
    textColor: 'text-orange-800 dark:text-orange-200',
    dotColor: 'bg-orange-600 dark:bg-orange-400',
    gradientBg: 'from-orange-500/10 via-amber-500/5 to-transparent',
    adviceTranslationKey: 'aqi.advice.unhealthy_sensitive',
  },
  {
    level: 'unhealthy',
    min: 151,
    max: 200,
    translationKey: 'aqi.levels.unhealthy',
    colorName: 'red',
    hex: '#EF4444',
    light: {
      bg: '#FEE2E2',     /* red-100 */
      border: '#F87171', /* red-400 */
      text: '#991B1B',   /* red-800 - contrast 6.8:1 (WCAG AA PASS) */
      dot: '#DC2626',
    },
    dark: {
      bg: '#7F1D1D',     /* red-900 */
      border: '#DC2626', /* red-600 */
      text: '#FECACA',   /* red-200 - contrast 8.2:1 (WCAG AA PASS) */
      dot: '#F87171',
    },
    badgeBg: 'bg-red-100 dark:bg-red-900/60',
    badgeBorder: 'border-red-400 dark:border-red-600',
    textColor: 'text-red-800 dark:text-red-200',
    dotColor: 'bg-red-600 dark:bg-red-400',
    gradientBg: 'from-rose-500/10 via-red-500/5 to-transparent',
    adviceTranslationKey: 'aqi.advice.unhealthy',
  },
  {
    level: 'very_unhealthy',
    min: 201,
    max: 300,
    translationKey: 'aqi.levels.very_unhealthy',
    colorName: 'purple',
    hex: '#A855F7',
    light: {
      bg: '#F3E8FF',     /* purple-100 */
      border: '#C084FC', /* purple-400 */
      text: '#581C87',   /* purple-900 - contrast 8.1:1 (WCAG AA PASS) */
      dot: '#9333EA',
    },
    dark: {
      bg: '#3B0764',     /* purple-950 */
      border: '#9333EA', /* purple-600 */
      text: '#E9D5FF',   /* purple-200 - contrast 9.5:1 (WCAG AA PASS) */
      dot: '#C084FC',
    },
    badgeBg: 'bg-purple-100 dark:bg-purple-950/60',
    badgeBorder: 'border-purple-400 dark:border-purple-600',
    textColor: 'text-purple-900 dark:text-purple-200',
    dotColor: 'bg-purple-600 dark:bg-purple-400',
    gradientBg: 'from-purple-500/10 via-violet-500/5 to-transparent',
    adviceTranslationKey: 'aqi.advice.very_unhealthy',
  },
  {
    level: 'hazardous',
    min: 301,
    max: 500,
    translationKey: 'aqi.levels.hazardous',
    colorName: 'maroon',
    hex: '#800000',
    light: {
      bg: '#FFE4E6',     /* rose-100 */
      border: '#FB7185', /* rose-400 */
      text: '#4C0519',   /* maroon / rose-950 - contrast 9.8:1 (WCAG AA PASS) */
      dot: '#800000',
    },
    dark: {
      bg: '#4C0519',     /* maroon-950 */
      border: '#9F1239', /* rose-800 */
      text: '#FFE4E6',   /* rose-100 - contrast 10.2:1 (WCAG AA PASS) */
      dot: '#F43F5E',
    },
    badgeBg: 'bg-rose-100 dark:bg-[#4C0519]',
    badgeBorder: 'border-rose-400 dark:border-rose-800',
    textColor: 'text-rose-950 dark:text-rose-100',
    dotColor: 'bg-[#800000] dark:bg-[#F43F5E]',
    gradientBg: 'from-[#4C0519]/40 via-red-950/20 to-transparent',
    adviceTranslationKey: 'aqi.advice.hazardous',
  },
] as const;

/**
 * Single source of truth lookup for AQI value
 */
export function getAqiCategory(value: number): AqiCategoryDefinition {
  const bounded = Math.max(0, value);
  for (const category of AQI_CATEGORIES) {
    if (bounded >= category.min && bounded <= category.max) {
      return category;
    }
  }
  return AQI_CATEGORIES[AQI_CATEGORIES.length - 1]!;
}

export const getAQICategory = getAqiCategory;
export const AQI_SCALE = AQI_CATEGORIES;

export function getAQIHexColor(aqi: number): string {
  return getAqiCategory(aqi).hex;
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

export const DATA_DISCLOSURE_LABEL =
  'Open-Meteo values are modelled atmospheric estimates, not ground-sensor readings.';

export const HEALTH_GUIDANCE_DISCLAIMER =
  'Health content is general wellness guidance, never a medical diagnosis.';
