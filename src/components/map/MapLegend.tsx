import React from 'react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../contexts/ThemeContext';
import { AQI_CATEGORIES } from '../../constants/aqi';
import { Layers } from 'lucide-react';

export interface MapLegendProps {
  className?: string;
}

export const MapLegend: React.FC<MapLegendProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <div
      role="region"
      aria-label={t('map.legend')}
      className={`bg-vayu-surface/95 dark:bg-vayu-surface/95 backdrop-blur-md border border-vayu-border rounded-2xl p-2.5 sm:p-3 text-xs shadow-xl ${className}`}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-vayu-text-secondary uppercase tracking-wider mb-2">
        <Layers className="w-3.5 h-3.5 text-vayu-primary" aria-hidden="true" />
        <span>{t('map.legend')}</span>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {AQI_CATEGORIES.map((cat) => {
          const style = isDark ? cat.dark : cat.light;
          return (
            <span
              key={cat.level}
              style={{
                backgroundColor: style.bg,
                borderColor: style.border,
                color: style.text,
              }}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] sm:text-[11px] font-bold"
            >
              <span
                style={{ backgroundColor: style.dot }}
                className="w-2 h-2 rounded-full shrink-0"
                aria-hidden="true"
              />
              <span>{t(cat.translationKey)}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};
