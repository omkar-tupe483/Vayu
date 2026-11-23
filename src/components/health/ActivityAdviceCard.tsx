import React from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { HealthAdvice } from '../../utils/advisor';
import { Activity, ShieldAlert, Wind, Clock, Sparkles } from 'lucide-react';

export const ActivityAdviceCard: React.FC<{ advice: HealthAdvice; className?: string }> = ({
  advice,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={`p-5 sm:p-6 rounded-3xl bg-vayu-surface-elevated border border-vayu-border shadow-xl space-y-4 ${className}`}>
      <div className="flex items-center gap-2 pb-2 border-b border-vayu-border-subtle">
        <Activity className="w-5 h-5 text-vayu-primary" aria-hidden="true" />
        <h4 className="text-base sm:text-lg font-black text-vayu-text">
          {t('advisor.activity.title') || 'Daily Activity & Airway Protection'}
        </h4>
      </div>

      <div className="grid sm:grid-cols-2 gap-3.5">
        {/* Outdoor Exercise */}
        <div className="p-4 rounded-2xl bg-vayu-surface border border-vayu-border space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-vayu-text-secondary">
            <Activity className="w-4 h-4 text-vayu-primary" aria-hidden="true" />
            <span>{t('advisor.activity.exercise') || 'Outdoor Exercise'}</span>
          </div>
          <p className="text-xs sm:text-sm text-vayu-text leading-relaxed font-medium">
            {t(advice.outdoorExercise.key, advice.outdoorExercise.params)}
          </p>
        </div>

        {/* Mask Advice with explicit limitations */}
        <div className="p-4 rounded-2xl bg-vayu-surface border border-vayu-border space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-vayu-text-secondary">
            <ShieldAlert className="w-4 h-4 text-vayu-accent" aria-hidden="true" />
            <span>{t('advisor.activity.mask') || 'Mask & Respirator Advice'}</span>
          </div>
          <p className="text-xs sm:text-sm text-vayu-text leading-relaxed font-medium">
            {t(advice.maskAdvice.key, advice.maskAdvice.params)}
          </p>
        </div>

        {/* Ventilation & Windows */}
        <div className="p-4 rounded-2xl bg-vayu-surface border border-vayu-border space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-vayu-text-secondary">
            <Wind className="w-4 h-4 text-vayu-primary" aria-hidden="true" />
            <span>{t('advisor.activity.ventilation') || 'Windows & Ventilation'}</span>
          </div>
          <p className="text-xs sm:text-sm text-vayu-text leading-relaxed font-medium">
            {t(advice.ventilation.key, advice.ventilation.params)}
          </p>
        </div>

        {/* Best Time to Go Out */}
        <div className="p-4 rounded-2xl bg-vayu-surface border border-vayu-border space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-vayu-text-secondary">
            <Clock className="w-4 h-4 text-vayu-accent" aria-hidden="true" />
            <span>{t('advisor.activity.window') || 'Forecast Window'}</span>
          </div>
          {advice.bestTimeWindow ? (
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{advice.bestTimeWindow.startHour} – {advice.bestTimeWindow.endHour}</span>
              </span>
              <p className="text-xs sm:text-sm text-vayu-text leading-relaxed font-medium">
                {t(advice.bestTimeWindow.text.key, advice.bestTimeWindow.text.params)}
              </p>
            </div>
          ) : (
            <p className="text-xs text-vayu-text-secondary">
              {t('advisor.activity.noWindow') || 'Check live atmospheric readings above to time errands.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
