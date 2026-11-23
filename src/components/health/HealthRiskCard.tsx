import React, { useState } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/useTheme';
import { HealthAdvice, RiskLevel } from '../../utils/advisor';
import { getAqiCategory } from '../../constants/aqi';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Flame,
  Sliders,
  RotateCcw,
} from 'lucide-react';

export interface HealthRiskCardProps {
  advice: HealthAdvice;
  simulatedAqi?: number | null;
  onSimulateAqi?: (aqi: number | null) => void;
  className?: string;
}

const RISK_VISUALS: Record<
  RiskLevel,
  {
    title: string;
    icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
    lightBorder: string;
    lightBg: string;
    lightText: string;
    darkBorder: string;
    darkBg: string;
    darkText: string;
    ringColor: string;
  }
> = {
  low: {
    title: 'Low Health Risk',
    icon: ShieldCheck,
    lightBorder: '#86EFAC',
    lightBg: '#F0FDF4',
    lightText: '#14532D',
    darkBorder: '#166534',
    darkBg: 'rgba(20, 83, 45, 0.25)',
    darkText: '#86EFAC',
    ringColor: '#22C55E',
  },
  moderate: {
    title: 'Moderate Health Risk',
    icon: ShieldAlert,
    lightBorder: '#FDE047',
    lightBg: '#FEFCE8',
    lightText: '#713F12',
    darkBorder: '#854D0E',
    darkBg: 'rgba(113, 63, 18, 0.25)',
    darkText: '#FEF08A',
    ringColor: '#EAB308',
  },
  high: {
    title: 'High Health Risk',
    icon: AlertTriangle,
    lightBorder: '#FDBA74',
    lightBg: '#FFF7ED',
    lightText: '#7C2D12',
    darkBorder: '#9A3412',
    darkBg: 'rgba(124, 45, 18, 0.25)',
    darkText: '#FED7AA',
    ringColor: '#F97316',
  },
  very_high: {
    title: 'Very High Health Risk',
    icon: Flame,
    lightBorder: '#FCA5A5',
    lightBg: '#FEF2F2',
    lightText: '#7F1D1D',
    darkBorder: '#991B1B',
    darkBg: 'rgba(127, 29, 29, 0.25)',
    darkText: '#FECACA',
    ringColor: '#EF4444',
  },
};

export const HealthRiskCard: React.FC<HealthRiskCardProps> = ({
  advice,
  simulatedAqi,
  onSimulateAqi,
  className = '',
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [showDevOverride, setShowDevOverride] = useState(false);

  const visual = RISK_VISUALS[advice.riskLevel];
  const Icon = visual.icon;

  const borderColor = isDark ? visual.darkBorder : visual.lightBorder;
  const bgColor = isDark ? visual.darkBg : visual.lightBg;
  const textColor = isDark ? visual.darkText : visual.lightText;

  const category = getAqiCategory(advice.aqi);
  const aqiStyle = isDark ? category.dark : category.light;

  return (
    <div
      style={{ borderColor, backgroundColor: bgColor }}
      className={`rounded-3xl border p-5 sm:p-6 shadow-xl transition-all space-y-5 ${className}`}
    >
      {/* Top Header: Risk Level with Animated Ring + Color + Icon + Text */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Animated Ring Indicator (never color alone) */}
          <div className="relative flex items-center justify-center w-12 h-12">
            <div
              style={{ borderColor: visual.ringColor }}
              className="absolute inset-0 rounded-full border-2 animate-ping opacity-25"
              aria-hidden="true"
            />
            <div
              style={{ color: textColor }}
              className="relative p-2.5 rounded-full bg-black/5 dark:bg-white/10"
            >
              <Icon className="w-6 h-6" aria-hidden="true" />
            </div>
          </div>

          <div>
            <span style={{ color: textColor }} className="text-xs font-bold uppercase tracking-wider block opacity-80">
              {t('advisor.evaluation') || 'Personalized Evaluation'}
            </span>
            <h3 style={{ color: textColor }} className="text-lg sm:text-xl font-black tracking-tight">
              {t(`advisor.risk.${advice.riskLevel}`) || visual.title}
            </h3>
          </div>
        </div>

        {/* Categorical Badge & Dev Slider Trigger */}
        <div className="flex items-center gap-2">
          <div
            style={{ backgroundColor: aqiStyle.bg, borderColor: aqiStyle.border, color: aqiStyle.text }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-sm font-black text-xs font-mono"
          >
            <span style={{ backgroundColor: aqiStyle.dot }} className="w-2 h-2 rounded-full" aria-hidden="true" />
            <span>AQI {advice.aqi}</span>
          </div>

          {onSimulateAqi && (
            <button
              type="button"
              onClick={() => setShowDevOverride((prev) => !prev)}
              title="Dev QA: Test AQI Levels"
              aria-label="Dev QA: Test AQI Levels"
              className="p-1.5 rounded-lg border border-vayu-border text-vayu-text-secondary hover:text-vayu-text hover:bg-vayu-surface-tint focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring"
            >
              <Sliders className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Dev-only AQI Simulation Tool */}
      {showDevOverride && onSimulateAqi && (
        <div className="p-3.5 rounded-2xl bg-vayu-surface border border-vayu-border text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-vayu-text flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-vayu-primary" aria-hidden="true" />
              <span>Dev Simulation Override</span>
            </span>

            {simulatedAqi !== null && (
              <button
                type="button"
                onClick={() => onSimulateAqi(null)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-vayu-accent-link hover:underline"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                <span>Reset to live</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={500}
              step={10}
              value={advice.aqi}
              onChange={(e) => onSimulateAqi(Number(e.target.value))}
              className="w-full accent-vayu-accent cursor-pointer"
            />
            <span className="font-mono font-bold text-vayu-text min-w-[50px] text-right">
              {advice.aqi} AQI
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {[30, 75, 125, 175, 250, 350].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => onSimulateAqi(val)}
                className="px-2 py-0.5 rounded-md border border-vayu-border text-[10px] font-bold text-vayu-text-secondary hover:bg-vayu-surface-tint"
              >
                AQI {val}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Primary Summary Message */}
      <p style={{ color: textColor }} className="text-sm sm:text-base font-bold leading-snug">
        {t(advice.summary.key, advice.summary.params)}
      </p>

      {/* Tailored Profile Guidance */}
      <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-black/30 backdrop-blur-sm border border-black/10 dark:border-white/10 text-xs sm:text-sm">
        <span style={{ color: textColor }} className="text-[11px] font-bold uppercase tracking-wider block mb-1 opacity-80">
          Targeted Advice ({advice.profile.replace('_', ' ')})
        </span>
        <p style={{ color: textColor }} className="leading-relaxed font-medium">
          {t(advice.profileAdvice.key, advice.profileAdvice.params)}
        </p>
      </div>
    </div>
  );
};
