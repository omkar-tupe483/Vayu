import React from 'react';
import { CleanPollutant } from '../../schemas/airQualitySchema';
import { getAqiCategory } from '../../constants/aqi';
import { useTheme } from '../../contexts/useTheme';

export interface PollutantCardProps {
  pollutant: CleanPollutant;
}

export const PollutantCard: React.FC<PollutantCardProps> = ({ pollutant }) => {
  const { isDark } = useTheme();
  const subCategory = getAqiCategory(pollutant.subAqi);
  const aqiStyle = isDark ? subCategory.dark : subCategory.light;

  return (
    <div
      style={{
        borderColor: aqiStyle.border,
      }}
      className="p-4 rounded-2xl bg-vayu-surface border shadow-sm transition-all hover:-translate-y-0.5 space-y-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-xs font-bold text-vayu-text-secondary uppercase tracking-wider block">
            {pollutant.name}
          </span>
          <span className="text-lg font-black text-vayu-text font-mono">
            {pollutant.formula}
          </span>
        </div>

        {/* Sub-AQI Badge */}
        <span
          style={{
            backgroundColor: aqiStyle.bg,
            color: aqiStyle.text,
            borderColor: aqiStyle.border,
          }}
          className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full border shadow-inner"
        >
          <span style={{ backgroundColor: aqiStyle.dot }} className="w-1.5 h-1.5 rounded-full" aria-hidden="true" />
          <span>AQI {pollutant.subAqi}</span>
        </span>
      </div>

      <div className="flex items-baseline gap-1.5 pt-1">
        <span className="text-2xl font-black text-vayu-text font-mono">
          {pollutant.value.toFixed(1)}
        </span>
        <span className="text-xs text-vayu-text-secondary font-medium">
          {pollutant.unit}
        </span>
      </div>

      <p className="text-xs text-vayu-text-secondary leading-relaxed pt-1 border-t border-vayu-border-subtle">
        {pollutant.description}
      </p>
    </div>
  );
};
