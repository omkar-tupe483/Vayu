import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { CleanAirQualityModel } from '../../schemas/airQualitySchema';
import { CleanForecastModel } from '../../schemas/forecastSchema';
import { UserProfileId, getAdvice, normalizeProfile } from '../../utils/advisor';
import { UserProfileSelector } from './UserProfileSelector';
import { HealthRiskCard } from './HealthRiskCard';
import { ActivityAdviceCard } from './ActivityAdviceCard';
import { ProtectiveMeasuresCard } from './ProtectiveMeasuresCard';
import { AdviceDisclaimer } from './AdviceDisclaimer';
import { HeartPulse } from 'lucide-react';

const PROFILE_KEY = 'vayu_user_profile';

export const HealthAdvisorSection: React.FC<{
  data: CleanAirQualityModel;
  forecast?: CleanForecastModel | null;
  className?: string;
}> = ({ data, forecast, className = '' }) => {
  const { t } = useTranslation();

  const [selectedProfile, setSelectedProfile] = useState<UserProfileId>(() => {
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      if (stored) return normalizeProfile(stored);
    } catch {
      // Ignored
    }
    return 'general';
  });

  const [simulatedAqi, setSimulatedAqi] = useState<number | null>(null);

  const handleSelect = (p: UserProfileId) => {
    setSelectedProfile(p);
    try {
      localStorage.setItem(PROFILE_KEY, p);
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    setSimulatedAqi(null);
  }, [data.city]);

  const advice = useMemo(() => {
    const effectiveAqi = simulatedAqi !== null ? simulatedAqi : data.us_aqi;
    return getAdvice({ ...data, us_aqi: effectiveAqi }, selectedProfile, forecast);
  }, [data, simulatedAqi, selectedProfile, forecast]);

  return (
    <section id="health-advisor" aria-label="Health Advisor" className={`scroll-mt-24 space-y-6 ${className}`}>
      <div className="flex items-center gap-2.5 pb-2 border-b border-vayu-border-subtle">
        <div className="p-2 rounded-2xl bg-vayu-accent/20 text-vayu-accent-link">
          <HeartPulse className="w-6 h-6 text-vayu-accent" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-vayu-text">
            {t('advisor.title')}
          </h2>
          <p className="text-xs sm:text-sm text-vayu-text-secondary">
            {t('advisor.subtitle')}
          </p>
        </div>
      </div>

      <UserProfileSelector selectedProfile={selectedProfile} onSelectProfile={handleSelect} />

      <HealthRiskCard advice={advice} simulatedAqi={simulatedAqi} onSimulateAqi={setSimulatedAqi} />

      <ActivityAdviceCard advice={advice} />

      <ProtectiveMeasuresCard measures={advice.protectiveMeasures} />

      <AdviceDisclaimer disclaimer={advice.disclaimer} emergencyNotice={advice.emergencyNotice} />
    </section>
  );
};
