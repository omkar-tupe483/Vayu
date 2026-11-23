import React from 'react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../contexts/ThemeContext';
import { getAqiCategory } from '../../constants/aqi';
import {
  HealthProfileId,
  HEALTH_PROFILES,
  BestTimeWindowResult,
} from '../../utils/bestWindow';
import {
  Sparkles,
  Clock,
  AlertTriangle,
  UserCheck,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  Info,
} from 'lucide-react';

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
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const currentConfig = HEALTH_PROFILES[selectedProfile] || HEALTH_PROFILES.general;
  const activeThreshold = customThreshold ?? currentConfig.defaultThreshold;

  const profileKeys: HealthProfileId[] = ['general', 'runner', 'child_elderly', 'asthma'];

  const category = bestWindow ? getAqiCategory(bestWindow.avgAqi) : null;
  const categoryVariant = category ? (isDark ? category.dark : category.light) : null;

  return (
    <div
      className={`bg-vayu-surface-elevated border border-vayu-border rounded-3xl p-5 sm:p-6 shadow-xl space-y-6 ${className}`}
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-vayu-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-vayu-accent/20 text-vayu-accent-link">
            <Sparkles className="w-5 h-5 text-vayu-accent" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-vayu-text">
              {t('forecast.bestWindow')}
            </h3>
            <p className="text-xs text-vayu-text-secondary">
              {t('forecast.subtitle')}
            </p>
          </div>
        </div>

        {/* Selected Profile Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-vayu-surface border border-vayu-border text-xs font-bold text-vayu-text">
          <UserCheck className="w-3.5 h-3.5 text-vayu-primary" aria-hidden="true" />
          <span>{t(currentConfig.labelKey)}</span>
        </div>
      </div>

      {/* Health Profile Selector Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-vayu-text-secondary flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-vayu-primary" aria-hidden="true" />
          <span>{t('forecast.profile')}</span>
        </label>

        <div
          role="tablist"
          aria-label="Health profile selection"
          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
        >
          {profileKeys.map((key) => {
            const config = HEALTH_PROFILES[key];
            const isSelected = selectedProfile === key;
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
                {t(config.labelKey)}
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
              <span>{t('forecast.threshold')}</span>
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
            aria-label={`${t('forecast.threshold')} slider`}
            className="w-full accent-vayu-accent cursor-pointer focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-vayu-text-secondary">
            <span>Stricter ({currentConfig.minThreshold || 40})</span>
            <span>Relaxed ({currentConfig.maxThreshold || 150})</span>
          </div>
        </div>
      )}

      {/* Window Result Display: Safe Window vs No Safe Window */}
      {bestWindow ? (
        bestWindow.isSafe ? (
          <div className="p-5 rounded-2xl bg-vayu-surface border border-vayu-accent/40 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Window Time Interval */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <Clock className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-vayu-text-secondary">
                    Continuous {bestWindow.durationHours} {t('forecast.hours')}
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-vayu-text">
                    {bestWindow.startPoint.hourLabel} – {bestWindow.endPoint.hourLabel}
                  </div>
                </div>
              </div>

              {/* Expected Average AQI */}
              {categoryVariant && (
                <div
                  style={{
                    backgroundColor: categoryVariant.bg,
                    borderColor: categoryVariant.border,
                    color: categoryVariant.text,
                  }}
                  className="px-4 py-2 rounded-2xl border flex flex-col items-center justify-center text-center shadow-inner"
                >
                  <span className="text-xs font-bold uppercase opacity-85">
                    {t('forecast.expectedAqi')}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black">{bestWindow.avgAqi}</span>
                    <span className="text-xs font-bold">AQI</span>
                  </div>
                </div>
              )}
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-vayu-border-subtle text-xs">
              <div className="p-2.5 rounded-xl bg-vayu-surface-elevated border border-vayu-border-subtle">
                <span className="text-[11px] text-vayu-text-secondary block">
                  {t('forecast.peakAqi')}
                </span>
                <span className="text-sm font-bold text-vayu-text">
                  AQI {bestWindow.maxAqi}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-vayu-surface-elevated border border-vayu-border-subtle">
                <span className="text-[11px] text-vayu-text-secondary block">
                  Max Safe Threshold
                </span>
                <span className="text-sm font-bold text-vayu-text">
                  ≤ {bestWindow.threshold}
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-vayu-surface-elevated border border-vayu-border-subtle">
                <span className="text-[11px] text-vayu-text-secondary block">
                  Outdoor Suitability
                </span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Safe Window</span>
                </span>
              </div>
            </div>

            {/* Health Reasoning */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-200">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span>{t(bestWindow.reasonKey)}</span>
            </div>
          </div>
        ) : (
          /* No Safe Window Alert State */
          <div
            role="alert"
            className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-3"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-bold text-amber-900 dark:text-amber-100">
                  {t('forecast.noSafeWindow')}
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  {t('forecast.noSafeWindowDesc')}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-vayu-surface/60 border border-amber-500/20 text-xs space-y-1 text-vayu-text">
              <div className="flex items-center gap-1 font-bold text-vayu-text">
                <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                <span>Lowest Exposure Alternative:</span>
              </div>
              <p className="text-vayu-text-secondary">
                {bestWindow.startPoint.hourLabel} – {bestWindow.endPoint.hourLabel} reaches an average of AQI {bestWindow.avgAqi} (peak {bestWindow.maxAqi}), which exceeds your {t(currentConfig.labelKey)} safety ceiling of AQI {bestWindow.threshold}.
              </p>
            </div>
          </div>
        )
      ) : null}
    </div>
  );
};

export default BestTimeWindowCard;
