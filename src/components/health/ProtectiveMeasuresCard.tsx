import React, { useState } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { ProtectiveMeasure } from '../../utils/advisor';
import {
  ShieldCheck,
  ChevronDown,
  Wind,
  ShieldAlert,
  Droplets,
  HeartHandshake,
  Activity,
  Layers,
  AlertTriangle,
} from 'lucide-react';

const ICON_MAP = {
  purifier: Layers,
  window: Wind,
  mask: ShieldAlert,
  hydration: Droplets,
  medical: HeartHandshake,
  activity: Activity,
};

export const ProtectiveMeasuresCard: React.FC<{ measures: ProtectiveMeasure[]; className?: string }> = ({
  measures,
  className = '',
}) => {
  const { t } = useTranslation();
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    measures.slice(0, 2).forEach((m) => (init[m.id] = true));
    return init;
  });

  const toggle = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={`p-5 sm:p-6 rounded-3xl bg-vayu-surface-elevated border border-vayu-border shadow-xl space-y-4 ${className}`}>
      <div className="flex items-center justify-between pb-2 border-b border-vayu-border-subtle">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-vayu-primary" aria-hidden="true" />
          <h4 className="text-base sm:text-lg font-black text-vayu-text">
            {t('advisor.measures.header') || 'Actionable Protective Measures'}
          </h4>
        </div>
        <span className="text-xs text-vayu-text-secondary">
          {t('advisor.measures.clickDetails') || 'Click measure for details'}
        </span>
      </div>

      <div className="space-y-2.5">
        {measures.map((m) => {
          const isExpanded = !!expandedIds[m.id];
          const Icon = ICON_MAP[m.iconName] || ShieldCheck;

          return (
            <div
              key={m.id}
              className={`rounded-2xl border transition-all ${
                m.isCritical
                  ? 'border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/20'
                  : 'border-vayu-border bg-vayu-surface'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(m.id)}
                aria-expanded={isExpanded}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl shrink-0 ${m.isCritical ? 'bg-amber-500/20 text-amber-600' : 'bg-vayu-surface-tint text-vayu-primary'}`}>
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-vayu-text">{t(m.titleKey)}</span>
                    {m.isCritical && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-rose-500/10 text-rose-600 text-[10px] font-black uppercase">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Priority
                      </span>
                    )}
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-vayu-text-secondary transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-vayu-text-secondary leading-relaxed border-t border-vayu-border-subtle">
                  <p className="mt-2 font-medium text-vayu-text">{t(m.descKey)}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
