import React from 'react';
import { useTranslation } from '../i18n';
import { Info, ShieldCheck, Globe, Code2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-semibold">
          <Info className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t('about.title')}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
          {t('about.title')}
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          {t('about.description')}
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl">
          <div className="p-2.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 w-fit">
            <Globe className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2 className="text-base font-bold text-white">{t('about.feature1Title')}</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t('about.feature1Desc')}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 w-fit">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2 className="text-base font-bold text-white">{t('about.feature2Title')}</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t('about.feature2Desc')}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit">
            <Code2 className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2 className="text-base font-bold text-white">{t('about.feature3Title')}</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t('about.feature3Desc')}
          </p>
        </div>
      </div>

      {/* Data Model Disclosure */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs text-slate-400">
        <h3 className="text-sm font-bold text-white">Atmospheric Data Transparency</h3>
        <p className="leading-relaxed">
          {t('disclaimer.modelled')}
        </p>
        <p className="leading-relaxed">
          Open-Meteo uses the CAMS (Copernicus Atmosphere Monitoring Service) European regional ensemble model and SILAM global air quality forecasts with 11 km resolution. These models assimilate satellite observations and emission inventories to calculate ground-level chemical concentrations.
        </p>
      </div>
    </div>
  );
};

