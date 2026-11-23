import React from 'react';
import { AQI_CATEGORIES } from '../../constants/aqi';
import { useTranslation } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/useTheme';

export const MapLegend: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <div
      className={`p-2.5 rounded-2xl bg-vayu-surface/90 backdrop-blur-md border border-vayu-border shadow-lg text-xs space-y-1.5 ${className}`}
    >
      <div className="font-bold text-[11px] text-vayu-text uppercase tracking-wider">
        AQI Scale
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
        {AQI_CATEGORIES.map((cat) => {
          const style = isDark ? cat.dark : cat.light;
          return (
            <div
              key={cat.level}
              style={{ backgroundColor: style.bg, borderColor: style.border, color: style.text }}
              className="px-1.5 py-0.5 rounded-lg border text-[10px] font-bold text-center flex items-center justify-center gap-1"
            >
              <span style={{ backgroundColor: style.dot }} className="w-1.5 h-1.5 rounded-full shrink-0" aria-hidden="true" />
              <span className="truncate">{t(cat.translationKey)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

