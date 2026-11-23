import React, { useState } from 'react';
import { CleanForecastModel, HourlyForecastPoint } from '../../schemas/forecastSchema';
import { getAqiCategory } from '../../constants/aqi';
import { useTranslation } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/useTheme';
import { TrendingUp, Info } from 'lucide-react';

export interface ForecastChartProps {
  forecast: CleanForecastModel;
  className?: string;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ forecast, className = '' }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  // Active pollutant overlay toggles
  const [visiblePollutants, setVisiblePollutants] = useState<{
    pm2_5: boolean;
    pm10: boolean;
    ozone: boolean;
    no2: boolean;
  }>({
    pm2_5: true,
    pm10: false,
    ozone: false,
    no2: false,
  });

  const [activePoint, setActivePoint] = useState<HourlyForecastPoint | null>(null);

  const togglePollutant = (key: keyof typeof visiblePollutants) => {
    setVisiblePollutants((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const points = forecast.hourly;
  if (!points || points.length === 0) return null;

  // Chart dimensions & scaling
  const width = 800;
  const height = 300;
  const padLeft = 40;
  const padRight = 30;
  const padTop = 35;
  const padBottom = 45;

  const innerWidth = width - padLeft - padRight;
  const innerHeight = height - padTop - padBottom;

  const maxVal = Math.max(160, Math.ceil((forecast.maxAqi + 20) / 50) * 50);
  const minVal = 0;

  const getX = (index: number) => padLeft + (index / (points.length - 1)) * innerWidth;
  const getY = (val: number) => padTop + innerHeight - ((val - minVal) / (maxVal - minVal)) * innerHeight;

  // Generate SVG path for AQI line & smooth area fill
  const aqiCoords = points.map((p, i) => ({ x: getX(i), y: getY(p.us_aqi), p }));
  let pathD = `M ${aqiCoords[0]?.x} ${aqiCoords[0]?.y}`;
  for (let i = 1; i < aqiCoords.length; i++) {
    const prev = aqiCoords[i - 1]!;
    const cur = aqiCoords[i]!;
    const cpX = (prev.x + cur.x) / 2;
    pathD += ` C ${cpX} ${prev.y}, ${cpX} ${cur.y}, ${cur.x} ${cur.y}`;
  }

  const areaD = `${pathD} L ${aqiCoords[aqiCoords.length - 1]?.x} ${padTop + innerHeight} L ${aqiCoords[0]?.x} ${padTop + innerHeight} Z`;

  // Secondary pollutant lines
  const buildLinePath = (getter: (p: HourlyForecastPoint) => number) => {
    if (points.length === 0) return '';
    let d = `M ${getX(0)} ${getY(getter(points[0]!))}`;
    for (let i = 1; i < points.length; i++) {
      const prevX = getX(i - 1);
      const prevY = getY(getter(points[i - 1]!));
      const curX = getX(i);
      const curY = getY(getter(points[i]!));
      const cpX = (prevX + curX) / 2;
      d += ` C ${cpX} ${prevY}, ${cpX} ${curY}, ${curX} ${curY}`;
    }
    return d;
  };

  const pm25Path = buildLinePath((p) => p.pm2_5);
  const pm10Path = buildLinePath((p) => p.pm10);
  const ozonePath = buildLinePath((p) => p.ozone);
  const no2Path = buildLinePath((p) => p.nitrogen_dioxide);

  const activeCategory = activePoint ? getAqiCategory(activePoint.us_aqi) : null;
  const activeStyle = activeCategory ? (isDark ? activeCategory.dark : activeCategory.light) : null;

  return (
    <div className={`p-5 sm:p-6 rounded-3xl bg-vayu-surface-elevated border border-vayu-border shadow-xl space-y-4 ${className}`}>
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-vayu-border-subtle">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-vayu-primary" aria-hidden="true" />
          <h3 className="text-base sm:text-lg font-black text-vayu-text">
            24-Hour Atmospheric Forecast
          </h3>
        </div>

        {/* Cleanest vs Peak Air Highlights */}
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            <span>Cleanest: {forecast.minAqiPoint.hourLabel} (AQI {forecast.minAqi})</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-300 font-bold border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" aria-hidden="true" />
            <span>Peak: {forecast.maxAqiPoint.hourLabel} (AQI {forecast.maxAqi})</span>
          </span>
        </div>
      </div>

      {/* Interactive Pollutant Legend Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-vayu-text-secondary flex items-center gap-1">
          <Info className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Toggle pollutant curves:</span>
        </span>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-xl bg-vayu-primary text-vayu-text font-black text-[11px] shadow-sm">
            AQI (USAQI)
          </span>

          <button
            type="button"
            onClick={() => togglePollutant('pm2_5')}
            className={`px-2.5 py-1 rounded-xl font-bold text-[11px] border transition-all ${
              visiblePollutants.pm2_5
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                : 'bg-vayu-surface text-vayu-text-secondary border-vayu-border opacity-70'
            }`}
          >
            PM2.5 (μg)
          </button>

          <button
            type="button"
            onClick={() => togglePollutant('pm10')}
            className={`px-2.5 py-1 rounded-xl font-bold text-[11px] border transition-all ${
              visiblePollutants.pm10
                ? 'bg-cyan-500 text-white border-cyan-500 shadow-sm'
                : 'bg-vayu-surface text-vayu-text-secondary border-vayu-border opacity-70'
            }`}
          >
            PM10 (μg)
          </button>

          <button
            type="button"
            onClick={() => togglePollutant('ozone')}
            className={`px-2.5 py-1 rounded-xl font-bold text-[11px] border transition-all ${
              visiblePollutants.ozone
                ? 'bg-purple-500 text-white border-purple-500 shadow-sm'
                : 'bg-vayu-surface text-vayu-text-secondary border-vayu-border opacity-70'
            }`}
          >
            O₃ (μg)
          </button>

          <button
            type="button"
            onClick={() => togglePollutant('no2')}
            className={`px-2.5 py-1 rounded-xl font-bold text-[11px] border transition-all ${
              visiblePollutants.no2
                ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                : 'bg-vayu-surface text-vayu-text-secondary border-vayu-border opacity-70'
            }`}
          >
            NO₂ (μg)
          </button>
        </div>
      </div>

      {/* Hand-Written SVG Forecast Chart Container */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[340px]"
          onMouseLeave={() => setActivePoint(null)}
        >
          <defs>
            {/* AQI Area Gradient */}
            <linearGradient id="vayuAqiGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--vayu-primary)" stopOpacity="0.45" />
              <stop offset="60%" stopColor="var(--vayu-accent)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--vayu-accent)" stopOpacity="0.0" />
            </linearGradient>

            {/* Threshold reference band colors */}
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Grid lines */}
          <rect x={padLeft} y={padTop} width={innerWidth} height={innerHeight} fill="url(#gridPattern)" />

          {/* Horizontal Reference Tiers */}
          {[50, 100, 150].map((tier) => {
            if (tier > maxVal) return null;
            const y = getY(tier);
            return (
              <g key={tier} className="opacity-40">
                <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" />
                <text x={padLeft - 6} y={y + 3} textAnchor="end" fontSize="10" fill="currentColor" fontFamily="monospace">
                  {tier}
                </text>
              </g>
            );
          })}

          {/* Smooth AQI Area Fill */}
          <path d={areaD} fill="url(#vayuAqiGradient)" />

          {/* Secondary pollutant lines (if enabled) */}
          {visiblePollutants.pm10 && <path d={pm10Path} fill="none" stroke="#06B6D4" strokeWidth="1.8" strokeDasharray="3 3" opacity="0.85" />}
          {visiblePollutants.ozone && <path d={ozonePath} fill="none" stroke="#A855F7" strokeWidth="1.8" strokeDasharray="3 3" opacity="0.85" />}
          {visiblePollutants.no2 && <path d={no2Path} fill="none" stroke="#F43F5E" strokeWidth="1.8" strokeDasharray="3 3" opacity="0.85" />}
          {visiblePollutants.pm2_5 && <path d={pm25Path} fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.9" />}

          {/* Primary AQI Smooth Curve */}
          <path d={pathD} fill="none" stroke="var(--vayu-accent-link)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Now marker line on current hour */}
          <g>
            <line
              x1={getX(0)}
              y1={padTop}
              x2={getX(0)}
              y2={padTop + innerHeight}
              stroke="var(--vayu-accent)"
              strokeWidth="2"
              strokeDasharray="2 2"
            />
            <rect x={getX(0) - 18} y={padTop - 18} width="36" height="15" rx="7" fill="var(--vayu-accent)" />
            <text x={getX(0)} y={padTop - 7} textAnchor="middle" fontSize="9" fontWeight="900" fill="var(--vayu-btn-text)">
              NOW
            </text>
          </g>

          {/* Peak Point Pulsing Dot */}
          {forecast.maxAqiPoint && (
            <g>
              <circle
                cx={getX(points.indexOf(forecast.maxAqiPoint))}
                cy={getY(forecast.maxAqiPoint.us_aqi)}
                r="5"
                fill="#EF4444"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Cleanest Point Pulsing Dot */}
          {forecast.minAqiPoint && (
            <g>
              <circle
                cx={getX(points.indexOf(forecast.minAqiPoint))}
                cy={getY(forecast.minAqiPoint.us_aqi)}
                r="5"
                fill="#10B981"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Interactive Tap/Hover Zones */}
          {points.map((pt, i) => {
            const x = getX(i);
            const y = getY(pt.us_aqi);
            const isHovered = activePoint === pt;

            return (
              <g
                key={pt.time}
                onMouseEnter={() => setActivePoint(pt)}
                onClick={() => setActivePoint(pt)}
                className="cursor-pointer"
              >
                {/* Hit test area */}
                <rect x={x - 14} y={padTop} width="28" height={innerHeight} fill="transparent" />

                {/* Visible hover line & dot */}
                {isHovered && (
                  <g>
                    <line x1={x} y1={padTop} x2={x} y2={padTop + innerHeight} stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx={x} cy={y} r="6" fill="var(--vayu-focus-ring)" stroke="#FFFFFF" strokeWidth="2.5" />
                  </g>
                )}

                {/* X-axis hour labels (every 4 hours) */}
                {i % 4 === 0 && (
                  <text x={x} y={padTop + innerHeight + 18} textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" opacity="0.75">
                    {pt.hourLabel}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Active Point Tooltip */}
        {activePoint && activeStyle && (
          <div
            style={{
              backgroundColor: activeStyle.bg,
              borderColor: activeStyle.border,
              color: activeStyle.text,
            }}
            className="absolute top-2 left-1/2 -translate-x-1/2 p-3 rounded-2xl border shadow-2xl text-xs space-y-1 z-30 pointer-events-none transition-all"
          >
            <div className="flex items-center justify-between gap-4 font-bold pb-1 border-b border-black/10 dark:border-white/10">
              <span className="font-black text-sm">{activePoint.hourLabel}</span>
              <span className="font-mono text-sm font-black">AQI {activePoint.us_aqi} ({t(activeCategory?.translationKey || '')})</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-[10px] font-mono pt-1">
              <span>PM2.5: {activePoint.pm2_5}</span>
              <span>PM10: {activePoint.pm10}</span>
              <span>O₃: {activePoint.ozone}</span>
              <span>NO₂: {activePoint.nitrogen_dioxide}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForecastChart;
