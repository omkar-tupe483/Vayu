import React from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { TranslatableText } from '../../utils/advisor';
import { Info, AlertOctagon } from 'lucide-react';

export interface AdviceDisclaimerProps {
  disclaimer: TranslatableText;
  emergencyNotice?: TranslatableText;
  className?: string;
}

export const AdviceDisclaimer: React.FC<AdviceDisclaimerProps> = ({
  disclaimer,
  emergencyNotice,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={`space-y-3 ${className}`}>
      {/* High-Risk Emergency Alert Banner: Never diagnose, call for help */}
      {emergencyNotice && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-900 dark:text-rose-100 text-xs sm:text-sm font-bold shadow-md"
        >
          <AlertOctagon className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <span className="uppercase tracking-wider text-[11px] font-black text-rose-700 dark:text-rose-300 block">
              {t('advisor.emergency.title') || 'Urgent Medical Notice'}
            </span>
            <p className="leading-relaxed">
              {t(emergencyNotice.key, emergencyNotice.params)}
            </p>
          </div>
        </div>
      )}

      {/* Mandatory General Non-Diagnostic Health Disclaimer */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-vayu-surface border border-vayu-border-subtle text-xs text-vayu-text-secondary">
        <Info className="w-4 h-4 shrink-0 text-vayu-primary mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          {t(disclaimer.key, disclaimer.params)}
        </p>
      </div>
    </div>
  );
};
