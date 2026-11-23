import React from 'react';
import { useTheme } from '../../contexts/useTheme';
import { getAqiCategory } from '../../constants/aqi';
import {
  HealthProfileId,
  HEALTH_PROFILES,
  BestTimeWindowResult,
} from '../../utils/bestWindow';
import { Sparkles, Clock, AlertTriangle, ShieldCheck, Sliders, CheckCircle2 } from 'lucide-react';

export interface BestTimeWindowCardProps {
  bestWindow: BestTimeWindowResult | null;
  selectedProfile: HealthProfileId;
  onSelectProfile: (profile: HealthProfileId) => void;
  customThreshold?: number;
  onThresholdChange?: (threshold: number) => void;
  className?: string;
}

export const BestTimeWindowCard: React.FC<BestTimeWindowCardProps> = ({
  bestWindow,
  selectedProfile,
  onSelectProfile,
  customThreshold,
  onThresholdChange,
  className = '',
}) => {
  const { isDark } = useTheme();

  const currentConfig = HEALTH_PROFILES[selectedProfile] || HEALTH_PROFILES.general;
  const activeThreshold = customThreshold ?? currentConfig.defaultThreshold;
  const profileKeys: HealthProfileId[] = ['general', 'runner', 'child_elderly', 'asthma'];

  const category = bestWindow ? getAqiCategory(bestWindow.avgAqi) : null;
  const categoryVariant = category ? (isDark ? category.dark : category.light) : null;

  return (
    <div className={`p-5 sm:p-6 rounded-3xl bg-vayu-surface-elevated border border-vayu-border shadow-xl space-y-5 ${className}`}>
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-vayu-border-subtle">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-vayu-accent" aria-hidden="true" />
          <h3 className="text-base sm:text-lg font-black text-vayu-text">
            Recommended Outdoor Time Window
          </h3>
        </div>
      </div>

      {/* Profile Selector Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-vayu-text-secondary flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-vayu-primary" aria-hidden="true" />
          <span>Health Profile (Threshold Sensitive)</span>
        </label>

        <div role="tablist" aria-label="Health profile selection" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {profileKeys.map((key) => {
            const isSelected = selectedProfile === key;
            const labels: Record<HealthProfileId, string> = {
              general: 'General (≤100)',
              runner: 'Runner (≤80)',
              child_elderly: 'Child & Elderly (≤70)',
              asthma: 'Asthma (≤50)',
            };

            return (
              <button
                key={key}
                role="tab"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => onSelectProfile(key)}
                className={`py-2 px-3 rounded-2xl text-xs font-bold border transition-all text-center focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring ${
                  isSelected
                    ? 'bg-vayu-accent text-vayu-btn-text border-vayu-accent shadow-md scale-[1.02]'
                    : 'bg-vayu-surface text-vayu-text-secondary border-vayu-border hover:bg-vayu-surface-tint hover:text-vayu-text'
                }`}
              >
                {labels[key]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Configurable Threshold Slider for General and Runner */}
      {currentConfig.isCustomizable && onThresholdChange && (
        <div className="p-3.5 rounded-2xl bg-vayu-surface border border-vayu-border-subtle space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-vayu-text flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-vayu-primary" aria-hidden="true" />
              <span>Custom AQI Threshold:</span>
            </span>
            <span className="font-mono font-bold text-vayu-accent-link">
              AQI ≤ {activeThreshold}
            </span>
          </div>
          <input
            type="range"
            min={currentConfig.minThreshold || 40}
            max={currentConfig.maxThreshold || 150}
            step={5}
            value={activeThreshold}
            onChange={(e) => onThresholdChange(Number(e.target.value))}
            aria-label="Threshold slider"
            className="w-full accent-vayu-accent cursor-pointer rounded-lg"
          />
        </div>
      )}

      {/* Safe vs No Safe Window Result */}
      {bestWindow ? (
        bestWindow.isSafe ? (
          <div className="p-5 rounded-2xl bg-vayu-surface border border-vayu-accent/40 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <Clock className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-vayu-text-secondary">
                    Continuous {bestWindow.durationHours} Hours Window
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-vayu-text">
                    {bestWindow.startPoint.hourLabel} – {bestWindow.endPoint.hourLabel}
                  </div>
                </div>
              </div>

              {categoryVariant && (
                <div
                  style={{
                    backgroundColor: categoryVariant.bg,
                    borderColor: categoryVariant.border,
                    color: categoryVariant.text,
                  }}
                  className="px-4 py-2 rounded-2xl border flex flex-col items-center justify-center text-center shadow-inner"
                >
                  <span className="text-xs font-bold uppercase opacity-85">Expected Average</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black">{bestWindow.avgAqi}</span>
                    <span className="text-xs font-bold">AQI</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span>{bestWindow.reason}</span>
            </div>
          </div>
        ) : (
          <div
            role="alert"
            className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-2"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h4 className="text-sm sm:text-base font-bold text-amber-900 dark:text-amber-100">
                  No safe window detected for this profile today
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                  {bestWindow.reason} Keep windows shut and exercise indoors.
                </p>
              </div>
            </div>
          </div>
        )
      ) : null}
    </div>
  );
};
