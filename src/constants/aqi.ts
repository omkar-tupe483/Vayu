export interface AqiCategoryStyle {
  bg: string;
  border: string;
  text: string;
  dot: string;
}

export interface AqiCategory {
  level: number;
  label: string;
  translationKey: string;
  min: number;
  max: number;
  light: AqiCategoryStyle;
  dark: AqiCategoryStyle;
  healthSummaryKey: string;
  adviceTranslationKey: string;
}

/**
 * Single source of truth for US AQI categories and health colors.
 * WCAG AA contrast compliant in both light and dark themes.
 * Never replaced by brand colors.
 */
export const AQI_CATEGORIES: AqiCategory[] = [
  {
    level: 1,
    label: 'Good',
    translationKey: 'aqi.categories.good',
    min: 0,
    max: 50,
    light: {
      bg: '#DCFCE7',
      border: '#86EFAC',
      text: '#14532D',
      dot: '#16A34A',
    },
    dark: {
      bg: 'rgba(20, 83, 45, 0.35)',
      border: '#166534',
      text: '#86EFAC',
      dot: '#22C55E',
    },
    healthSummaryKey: 'aqi.summary.good',
    adviceTranslationKey: 'aqi.advice.good',
  },
  {
    level: 2,
    label: 'Moderate',
    translationKey: 'aqi.categories.moderate',
    min: 51,
    max: 100,
    light: {
      bg: '#FEF9C3',
      border: '#FDE047',
      text: '#713F12',
      dot: '#CA8A04',
    },
    dark: {
      bg: 'rgba(113, 63, 18, 0.35)',
      border: '#854D0E',
      text: '#FEF08A',
      dot: '#EAB308',
    },
    healthSummaryKey: 'aqi.summary.moderate',
    adviceTranslationKey: 'aqi.advice.moderate',
  },
  {
    level: 3,
    label: 'Unhealthy for Sensitive Groups',
    translationKey: 'aqi.categories.unhealthy_sensitive',
    min: 101,
    max: 150,
    light: {
      bg: '#FFEDD5',
      border: '#FDBA74',
      text: '#7C2D12',
      dot: '#EA580C',
    },
    dark: {
      bg: 'rgba(124, 45, 18, 0.35)',
      border: '#9A3412',
      text: '#FED7AA',
      dot: '#F97316',
    },
    healthSummaryKey: 'aqi.summary.unhealthy_sensitive',
    adviceTranslationKey: 'aqi.advice.unhealthy_sensitive',
  },
  {
    level: 4,
    label: 'Unhealthy',
    translationKey: 'aqi.categories.unhealthy',
    min: 151,
    max: 200,
    light: {
      bg: '#FEE2E2',
      border: '#FCA5A5',
      text: '#7F1D1D',
      dot: '#DC2626',
    },
    dark: {
      bg: 'rgba(127, 29, 29, 0.35)',
      border: '#991B1B',
      text: '#FECACA',
      dot: '#EF4444',
    },
    healthSummaryKey: 'aqi.summary.unhealthy',
    adviceTranslationKey: 'aqi.advice.unhealthy',
  },
  {
    level: 5,
    label: 'Very Unhealthy',
    translationKey: 'aqi.categories.very_unhealthy',
    min: 201,
    max: 300,
    light: {
      bg: '#F3E8FF',
      border: '#D8B4FE',
      text: '#581C87',
      dot: '#9333EA',
    },
    dark: {
      bg: 'rgba(88, 28, 135, 0.35)',
      border: '#6B21A8',
      text: '#E9D5FF',
      dot: '#A855F7',
    },
    healthSummaryKey: 'aqi.summary.very_unhealthy',
    adviceTranslationKey: 'aqi.advice.very_unhealthy',
  },
  {
    level: 6,
    label: 'Hazardous',
    translationKey: 'aqi.categories.hazardous',
    min: 301,
    max: 500,
    light: {
      bg: '#FFE4E6',
      border: '#FDA4AF',
      text: '#4C0519',
      dot: '#881337',
    },
    dark: {
      bg: 'rgba(76, 5, 25, 0.4)',
      border: '#881337',
      text: '#FECDD3',
      dot: '#BE123C',
    },
    healthSummaryKey: 'aqi.summary.hazardous',
    adviceTranslationKey: 'aqi.advice.hazardous',
  },
];

/**
 * Maps any US AQI integer to its category
 */
export function getAqiCategory(value: number): AqiCategory {
  const rounded = Math.round(value);
  if (rounded <= 50) return AQI_CATEGORIES[0]!;
  if (rounded <= 100) return AQI_CATEGORIES[1]!;
  if (rounded <= 150) return AQI_CATEGORIES[2]!;
  if (rounded <= 200) return AQI_CATEGORIES[3]!;
  if (rounded <= 300) return AQI_CATEGORIES[4]!;
  return AQI_CATEGORIES[5]!;
}
