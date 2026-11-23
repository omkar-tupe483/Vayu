import { CleanAirQualityModel } from '../schemas/airQualitySchema';
import { CleanForecastModel } from '../schemas/forecastSchema';
import { findBestTimeWindow } from './bestWindow';

export type UserProfileId =
  | 'general'
  | 'child'
  | 'elderly'
  | 'runner'
  | 'asthma_sensitive';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'very_high';

export interface TranslatableText {
  key: string;
  params?: Record<string, string | number>;
}

export interface ProtectiveMeasure {
  id: string;
  titleKey: string;
  descKey: string;
  iconName: 'mask' | 'window' | 'purifier' | 'hydration' | 'medical' | 'activity';
  isCritical?: boolean;
}

export interface HealthAdvice {
  riskLevel: RiskLevel;
  aqi: number;
  profile: UserProfileId;
  summary: TranslatableText;
  outdoorExercise: TranslatableText;
  maskAdvice: TranslatableText;
  ventilation: TranslatableText;
  bestTimeWindow?: {
    hasSafeWindow: boolean;
    startHour?: string;
    endHour?: string;
    avgAqi?: number;
    text: TranslatableText;
  };
  profileAdvice: TranslatableText;
  protectiveMeasures: ProtectiveMeasure[];
  disclaimer: TranslatableText;
  emergencyNotice?: TranslatableText;
}

export interface AqiInputData {
  us_aqi?: number | null;
  pollutants?: {
    pm2_5?: number | null;
    pm10?: number | null;
    ozone?: number | null;
    nitrogen_dioxide?: number | null;
  } | null;
}

export function normalizeProfile(profile?: string | null): UserProfileId {
  if (!profile) return 'general';
  const clean = profile.toLowerCase().trim().replace('-', '_');
  if (clean === 'child') return 'child';
  if (clean === 'elderly') return 'elderly';
  if (clean === 'runner') return 'runner';
  if (clean === 'asthma' || clean === 'asthma_sensitive') return 'asthma_sensitive';
  return 'general';
}

export function computeRiskLevel(aqi: number, profile: UserProfileId): RiskLevel {
  const safeAqi = Math.max(0, isNaN(aqi) ? 0 : aqi);

  if (safeAqi <= 50) return 'low';
  if (safeAqi <= 100) return 'moderate';
  if (safeAqi <= 150) {
    if (profile === 'asthma_sensitive' || profile === 'child' || profile === 'elderly') {
      return 'high';
    }
    return 'moderate';
  }
  if (safeAqi <= 200) {
    return profile === 'asthma_sensitive' || profile === 'runner' ? 'very_high' : 'high';
  }
  return 'very_high';
}

export function getAdvice(
  aqiData?: CleanAirQualityModel | AqiInputData | null,
  rawProfile: UserProfileId | string = 'general',
  forecast?: CleanForecastModel | null
): HealthAdvice {
  const profile = normalizeProfile(rawProfile);
  const aqi = Math.max(0, Math.round(aqiData?.us_aqi ?? 0));
  const riskLevel = computeRiskLevel(aqi, profile);

  // 1. Short Summary
  const summary: TranslatableText = {
    key: `advisor.summary.${riskLevel}.${profile}`,
    params: { aqi },
  };

  // 2. Outdoor Exercise Advice
  let outdoorKey = `advisor.exercise.${riskLevel}.general`;
  if (profile === 'runner') {
    outdoorKey = `advisor.exercise.${riskLevel}.runner`;
  } else if (profile === 'child' || profile === 'elderly' || profile === 'asthma_sensitive') {
    outdoorKey = `advisor.exercise.${riskLevel}.sensitive`;
  }
  const outdoorExercise: TranslatableText = {
    key: outdoorKey,
    params: { aqi },
  };

  // 3. Mask Advice (N95/FFP2 only where appropriate, stating limitations)
  let maskKey = 'advisor.mask.none';
  if (riskLevel === 'moderate') {
    maskKey = profile === 'asthma_sensitive' || profile === 'elderly'
      ? 'advisor.mask.optionalSensitive'
      : 'advisor.mask.none';
  } else if (riskLevel === 'high') {
    maskKey = 'advisor.mask.recommendedN95';
  } else if (riskLevel === 'very_high') {
    maskKey = 'advisor.mask.criticalN95';
  }
  const maskAdvice: TranslatableText = {
    key: maskKey,
    params: { aqi },
  };

  // 4. Ventilation & Window Advice
  let ventKey = 'advisor.ventilation.openWide';
  if (aqi > 50 && aqi <= 100) {
    ventKey = 'advisor.ventilation.moderate';
  } else if (aqi > 100 && aqi <= 150) {
    ventKey = 'advisor.ventilation.limited';
  } else if (aqi > 150) {
    ventKey = 'advisor.ventilation.closed';
  }
  const ventilation: TranslatableText = {
    key: ventKey,
    params: { aqi },
  };

  // 5. Profile-Specific Tailored Guidance
  const profileAdvice: TranslatableText = {
    key: `advisor.profile.${profile}.${riskLevel}`,
    params: { aqi },
  };

  // 6. Best Time Window from Forecast
  let bestTimeWindow: HealthAdvice['bestTimeWindow'] | undefined;
  if (forecast && forecast.hourly && forecast.hourly.length > 0) {
    const bestWindowProfileId = profile === 'asthma_sensitive' ? 'asthma' : profile === 'runner' ? 'runner' : 'general';
    const windowResult = findBestTimeWindow(forecast.hourly, bestWindowProfileId, undefined, 3);

    if (windowResult) {
      bestTimeWindow = {
        hasSafeWindow: windowResult.isSafe,
        startHour: windowResult.startPoint.hourLabel,
        endHour: windowResult.endPoint.hourLabel,
        avgAqi: windowResult.avgAqi,
        text: {
          key: windowResult.isSafe ? 'advisor.bestWindow.safe' : 'advisor.bestWindow.unsafe',
          params: {
            start: windowResult.startPoint.hourLabel,
            end: windowResult.endPoint.hourLabel,
            avgAqi: windowResult.avgAqi,
          },
        },
      };
    }
  }

  // 7. Protective Measures List
  const protectiveMeasures: ProtectiveMeasure[] = [];
  protectiveMeasures.push({
    id: 'air-purifier',
    iconName: 'purifier',
    titleKey: 'advisor.measures.purifier.title',
    descKey: aqi <= 100 ? 'advisor.measures.purifier.low' : 'advisor.measures.purifier.high',
    isCritical: aqi > 150,
  });
  protectiveMeasures.push({
    id: 'outdoor-activity',
    iconName: 'activity',
    titleKey: 'advisor.measures.activity.title',
    descKey: `advisor.measures.activity.${riskLevel}`,
    isCritical: riskLevel === 'very_high',
  });
  protectiveMeasures.push({
    id: 'ventilation-measure',
    iconName: 'window',
    titleKey: 'advisor.measures.ventilation.title',
    descKey: aqi <= 100 ? 'advisor.measures.ventilation.low' : 'advisor.measures.ventilation.high',
    isCritical: aqi > 200,
  });
  protectiveMeasures.push({
    id: 'mask-measure',
    iconName: 'mask',
    titleKey: 'advisor.measures.mask.title',
    descKey: aqi <= 100 ? 'advisor.measures.mask.low' : 'advisor.measures.mask.high',
    isCritical: riskLevel === 'high' || riskLevel === 'very_high',
  });
  protectiveMeasures.push({
    id: 'hydration-measure',
    iconName: 'hydration',
    titleKey: 'advisor.measures.hydration.title',
    descKey: 'advisor.measures.hydration.desc',
  });

  if (profile === 'asthma_sensitive' || profile === 'elderly' || riskLevel === 'high' || riskLevel === 'very_high') {
    protectiveMeasures.push({
      id: 'medical-measure',
      iconName: 'medical',
      titleKey: 'advisor.measures.medical.title',
      descKey: profile === 'asthma_sensitive'
        ? 'advisor.measures.medical.asthma'
        : 'advisor.measures.medical.general',
      isCritical: riskLevel === 'high' || riskLevel === 'very_high',
    });
  }

  // 8. General Health Disclaimer
  const disclaimer: TranslatableText = {
    key: 'advisor.disclaimer.notice',
  };

  // 9. Emergency Notice for High / Very High Risk (Severe breathing difficulty / chest pain)
  let emergencyNotice: TranslatableText | undefined;
  if (riskLevel === 'high' || riskLevel === 'very_high') {
    emergencyNotice = {
      key: 'advisor.emergency.alert',
      params: { aqi },
    };
  }

  return {
    riskLevel,
    aqi,
    profile,
    summary,
    outdoorExercise,
    maskAdvice,
    ventilation,
    bestTimeWindow,
    profileAdvice,
    protectiveMeasures,
    disclaimer,
    emergencyNotice,
  };
}
