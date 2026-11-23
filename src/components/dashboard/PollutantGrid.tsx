import React from 'react';
import { useTranslation } from '../../i18n';
import { CleanAirQualityModel } from '../../schemas/airQualitySchema';
import { POLLUTANT_THRESHOLDS } from '../../constants/aqi';
import { Activity } from 'lucide-react';

interface PollutantGridProps {
  data: CleanAirQualityModel;
}

export const PollutantGrid: React.FC<PollutantGridProps> = ({ data }) => {
  const { t } = useTranslation();

  const getStatus = (pollutantKey: 'pm2_5' | 'pm10' | 'nitrogen_dioxide' | 'ozone', value: number) => {
    const threshold = POLLUTANT_THRESHOLDS[pollutantKey];
    if (!threshold) return { key: 'status.good', colorClass: 'text-emerald-400' };

    if (value <= threshold.goodMax) {
      return { key: 'status.good', colorClass: 'text-emerald-400' };
    }
    if (value <= threshold.moderateMax) {
      return { key: 'status.moderate', colorClass: 'text-amber-400' };
    }
    if (value <= threshold.unhealthyMax) {
      return { key: 'status.unhealthy', colorClass: 'text-rose-400' };
    }
    return { key: 'status.hazardous', colorClass: 'text-purple-400' };
  };

  const pollutantItems = [
    {
      id: 'pm2_5' as const,
      nameKey: 'pollutants.pm2_5.name',
      fullNameKey: 'pollutants.pm2_5.fullName',
      descKey: 'pollutants.pm2_5.description',
      value: data.pollutants.pm2_5,
      unit: data.units.pm2_5,
      status: getStatus('pm2_5', data.pollutants.pm2_5),
    },
    {
      id: 'pm10' as const,
      nameKey: 'pollutants.pm10.name',
      fullNameKey: 'pollutants.pm10.fullName',
      descKey: 'pollutants.pm10.description',
      value: data.pollutants.pm10,
      unit: data.units.pm10,
      status: getStatus('pm10', data.pollutants.pm10),
    },
    {
      id: 'nitrogen_dioxide' as const,
      nameKey: 'pollutants.nitrogen_dioxide.name',
      fullNameKey: 'pollutants.nitrogen_dioxide.fullName',
      descKey: 'pollutants.nitrogen_dioxide.description',
      value: data.pollutants.nitrogen_dioxide,
      unit: data.units.nitrogen_dioxide,
      status: getStatus('nitrogen_dioxide', data.pollutants.nitrogen_dioxide),
    },
    {
      id: 'ozone' as const,
      nameKey: 'pollutants.ozone.name',
      fullNameKey: 'pollutants.ozone.fullName',
      descKey: 'pollutants.ozone.description',
      value: data.pollutants.ozone,
      unit: data.units.ozone,
      status: getStatus('ozone', data.pollutants.ozone),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-400" aria-hidden="true" />
          <span>{t('pollutants.title')}</span>
        </h3>
        <span className="text-xs text-slate-400">{t('pollutants.subtitle')}</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pollutantItems.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-teal-400 border border-slate-700">
                  {t(item.nameKey)}
                </span>
                <span className={`text-xs font-semibold ${item.status.colorClass}`}>
                  {t(item.status.key)}
                </span>
              </div>

              <div className="text-sm font-semibold text-white mt-1">{t(item.fullNameKey)}</div>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {t(item.descKey)}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-baseline justify-between">
              <div className="text-2xl font-black text-white group-hover:text-teal-300 transition-colors">
                {item.value}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {item.unit}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

