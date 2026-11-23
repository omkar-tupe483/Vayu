import React from 'react';
import { useTranslation } from '../i18n';
import { AQI_SCALE } from '../constants/aqi';
import { HeartPulse, ShieldAlert } from 'lucide-react';

export const HealthGuidancePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-semibold">
          <HeartPulse className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t('nav.health')}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
          {t('nav.health')}
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
          {t('disclaimer.health')}
        </p>
      </div>

      {/* Tiers Breakdown from Single Source of Truth */}
      <div className="space-y-4">
        {AQI_SCALE.map((scaleItem) => (
          <div
            key={scaleItem.level}
            className={`p-6 rounded-3xl border bg-slate-900/80 backdrop-blur-md shadow-xl ${scaleItem.badgeBorder}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full ${scaleItem.dotColor}`} aria-hidden="true" />
                <h2 className="text-lg font-bold text-white">
                  {t(scaleItem.translationKey)}
                </h2>
              </div>
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${scaleItem.badgeBg} ${scaleItem.badgeBorder} ${scaleItem.textColor}`}>
                AQI {scaleItem.min} – {scaleItem.max === Infinity ? '301+' : scaleItem.max}
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {t(scaleItem.adviceTranslationKey)}
            </p>
          </div>
        ))}
      </div>

      {/* Prominent Medical Disclaimer */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
          <ShieldAlert className="w-4 h-4" aria-hidden="true" />
          <span>Important Medical Disclaimer</span>
        </div>
        <p className="leading-relaxed">
          {t('disclaimer.health')} Always consult a certified medical professional or local emergency health authority for individual clinical diagnoses, medication advice, or acute respiratory distress symptoms.
        </p>
      </div>
    </div>
  );
};
