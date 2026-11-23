import React from 'react';
import { CleanForecastModel, HourlyForecastPoint } from '../../schemas/forecastSchema';
import { getAqiCategory } from '../../constants/aqi';
import { useTheme } from '../../contexts/useTheme';
import { Clock, Sparkles, AlertTriangle } from 'lucide-react';

export interface ForecastTimelineProps {
  forecast: CleanForecastModel;
  bestWindowRange?: {
    startIndex: number;
    endIndex: number;
  } | null;
  className?: string;
}

export const ForecastTimeline: React.FC<ForecastTimelineProps> = ({
  forecast,
  bestWindowRange,
  className = '',
}) => {
  const { isDark } = useTheme();

  return (
    <div className={`p-4 sm:p-5 rounded-3xl bg-vayu-surface-elevated border border-vayu-border shadow-xl space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-vayu-primary" aria-hidden="true" />
          <h4 className="text-sm sm:text-base font-bold text-vayu-text">
            Hourly 24h Timeline Strip
          </h4>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-vayu-text-secondary">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span>Optimal Window</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" aria-hidden="true" />
            <span>Poor Air (AQI ≥ 151)</span>
          </span>
        </div>
      </div>

      {/* Horizontally Scrollable Hourly Strip */}
      <div
        tabIndex={0}
        aria-label="24-hour horizontal forecast timeline"
        className="flex gap-2.5 overflow-x-auto pb-2 pt-1 scroll-smooth focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring rounded-2xl"
      >
        {forecast.hourly.map((point: HourlyForecastPoint, idx: number) => {
          const category = getAqiCategory(point.us_aqi);
          const variant = isDark ? category.dark : category.light;
          const isPoorAir = point.us_aqi >= 151;
          const isInBestWindow =
            bestWindowRange &&
            idx >= bestWindowRange.startIndex &&
            idx <= bestWindowRange.endIndex;

          return (
            <div
              key={point.time}
              style={{
                borderColor: isInBestWindow
                  ? 'var(--vayu-accent)'
                  : isPoorAir
                  ? variant.border
                  : undefined,
              }}
              className={`shrink-0 min-w-[76px] sm:min-w-[84px] p-2.5 rounded-2xl border flex flex-col items-center justify-between text-center transition-all ${
                isInBestWindow
                  ? 'bg-vayu-surface-tint ring-2 ring-vayu-accent/50 shadow-md -translate-y-0.5'
                  : isPoorAir
                  ? 'bg-rose-500/10 dark:bg-rose-950/20'
                  : 'bg-vayu-surface border-vayu-border hover:bg-vayu-surface-tint'
              }`}
            >
              {/* Status Tags */}
              <div className="h-4 flex items-center justify-center">
                {point.isCurrentHour ? (
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-vayu-accent text-vayu-btn-text">
                    NOW
                  </span>
                ) : isInBestWindow ? (
                  <span className="text-[9px] font-bold text-vayu-accent-link flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5 text-vayu-accent" aria-hidden="true" />
                    <span>Best</span>
                  </span>
                ) : isPoorAir ? (
                  <span className="text-[9px] font-bold text-rose-500 flex items-center gap-0.5">
                    <AlertTriangle className="w-2.5 h-2.5" aria-hidden="true" />
                    <span>Poor</span>
                  </span>
                ) : null}
              </div>

              {/* Hour Label */}
              <span className="text-xs font-bold text-vayu-text my-1">
                {point.hourLabel}
              </span>

              {/* AQI Value with Category Dot */}
              <div
                style={{
                  backgroundColor: variant.bg,
                  borderColor: variant.border,
                  color: variant.text,
                }}
                className="w-full py-1 px-1.5 rounded-xl border flex flex-col items-center justify-center gap-0.5 my-1"
              >
                <span className="text-sm font-black leading-none">
                  {point.us_aqi}
                </span>
                <span className="text-[8px] font-bold opacity-80 uppercase leading-none">
                  AQI
                </span>
              </div>

              {/* PM2.5 Micro Reading */}
              <span className="text-[10px] text-vayu-text-secondary font-mono mt-1">
                {point.pm2_5} μg
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
