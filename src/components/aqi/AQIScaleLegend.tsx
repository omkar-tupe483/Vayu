import React from 'react';
import { AQI_CATEGORIES } from '../../constants/aqi';
import { useTranslation } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/useTheme';
import { Tooltip } from '../ui/Tooltip';
import { Layers } from 'lucide-react';

export const AQIScaleLegend: React.FC<{ currentAqi?: number; className?: string }> = ({
  currentAqi,
  className = '',
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <div
      className={`p-4 sm:p-5 rounded-3xl bg-vayu-surface-elevated border border-vayu-border shadow-md space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-vayu-primary" aria-hidden="true" />
          <h4 className="text-xs sm:text-sm font-bold text-vayu-text">
            {t('landing.aqiTiersTitle')}
          </h4>
        </div>
        <span className="text-[11px] text-vayu-text-secondary">
          Hover or tap for health details
        </span>
      </div>

      {/* Responsive Horizontal Strip of Categories with Tooltips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2" role="region" aria-label="AQI Categories">
        {AQI_CATEGORIES.map((cat) => {
          const style = isDark ? cat.dark : cat.light;
          const isCurrentRange =
            typeof currentAqi === 'number' && currentAqi >= cat.min && currentAqi <= cat.max;

          return (
            <Tooltip
              key={cat.level}
              content={
                <div className="max-w-xs space-y-1 p-1 text-left">
                  <p className="font-bold text-xs">{t(cat.translationKey)} (AQI {cat.min}–{cat.max})</p>
                  <p className="text-[11px] opacity-90">{t(cat.healthSummaryKey)}</p>
                </div>
              }
              className="w-full"
            >
              <div
                style={{
                  backgroundColor: style.bg,
                  borderColor: isCurrentRange ? style.dot : style.border,
                  color: style.text,
                }}
                tabIndex={0}
                role="article"
                aria-label={`${t(cat.translationKey)}: ${cat.min} to ${cat.max} AQI`}
                className={`w-full p-2.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all cursor-help focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring ${
                  isCurrentRange
                    ? 'ring-2 ring-vayu-focus-ring scale-[1.03] shadow-md font-black'
                    : 'opacity-85 hover:opacity-100 font-bold'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    style={{ backgroundColor: style.dot }}
                    className={`w-2 h-2 rounded-full ${isCurrentRange ? 'animate-pulse' : ''}`}
                    aria-hidden="true"
                  />
                  <span className="text-[11px] leading-tight truncate">
                    {t(cat.translationKey)}
                  </span>
                </div>
                <span className="text-xs font-mono font-black">
                  {cat.min}–{cat.max}
                </span>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

