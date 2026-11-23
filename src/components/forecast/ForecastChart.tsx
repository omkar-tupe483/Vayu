import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  Legend,
} from 'recharts';
import { CleanForecastModel, HourlyForecastPoint } from '../../schemas/forecastSchema';
import { getAqiCategory } from '../../constants/aqi';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../contexts/ThemeContext';
import { ArrowDown, ArrowUp, Activity } from 'lucide-react';

export interface ForecastChartProps {
  forecast: CleanForecastModel;
  className?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
    dataKey: string;
  }>;
  label?: string;
  hourlyPoints: HourlyForecastPoint[];
}

const CustomForecastTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  hourlyPoints,
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  if (!active || !payload || payload.length === 0) return null;

  const currentPoint = hourlyPoints.find((p) => p.hourLabel === label);
  const aqiValue = currentPoint ? currentPoint.us_aqi : payload[0]?.value ?? 0;
  const category = getAqiCategory(aqiValue);
  const variant = isDark ? category.dark : category.light;

  return (
    <div className="bg-vayu-surface-elevated/95 backdrop-blur-md border border-vayu-border rounded-2xl p-3 shadow-2xl text-xs space-y-2 min-w-[210px] z-50">
      <div className="flex items-center justify-between border-b border-vayu-border-subtle pb-1.5 gap-2">
        <span className="font-extrabold text-vayu-text">
          {currentPoint?.fullLabel || label}
        </span>
        <span
          style={{
            backgroundColor: variant.bg,
            borderColor: variant.border,
            color: variant.text,
          }}
          className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
        >
          {t(category.translationKey)}
        </span>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-vayu-text-secondary uppercase text-[10px] font-bold">
          AQI
        </span>
        <span className="text-xl font-black" style={{ color: variant.dot }}>
          {aqiValue}{' '}
          <span className="text-[10px] text-vayu-text-secondary font-medium">USAQI</span>
        </span>
      </div>

      {currentPoint && (
        <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-vayu-border-subtle text-[10px]">
          <div>
            <span className="text-vayu-text-secondary">PM2.5:</span>{' '}
            <span className="font-bold text-vayu-text">{currentPoint.pm2_5} µg/m³</span>
          </div>
          <div>
            <span className="text-vayu-text-secondary">PM10:</span>{' '}
            <span className="font-bold text-vayu-text">{currentPoint.pm10} µg/m³</span>
          </div>
          <div>
            <span className="text-vayu-text-secondary">Ozone:</span>{' '}
            <span className="font-bold text-vayu-text">{currentPoint.ozone} µg/m³</span>
          </div>
          <div>
            <span className="text-vayu-text-secondary">NO₂:</span>{' '}
            <span className="font-bold text-vayu-text">{currentPoint.nitrogen_dioxide} µg/m³</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const ForecastChart: React.FC<ForecastChartProps> = ({ forecast, className = '' }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  // Series visibility state for interactive legend
  const [visibleSeries, setVisibleSeries] = useState({
    us_aqi: true,
    pm2_5: false,
    pm10: false,
    ozone: false,
    nitrogen_dioxide: false,
  });

  const toggleSeries = (dataKey: string) => {
    setVisibleSeries((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey as keyof typeof prev],
    }));
  };

  const chartData = useMemo(() => {
    return forecast.hourly.map((point) => ({
      hourLabel: point.hourLabel,
      us_aqi: point.us_aqi,
      pm2_5: point.pm2_5,
      pm10: point.pm10,
      ozone: point.ozone,
      nitrogen_dioxide: point.nitrogen_dioxide,
      isCurrentHour: point.isCurrentHour,
    }));
  }, [forecast.hourly]);

  const nowLabel = useMemo(() => {
    const nowPt = forecast.hourly.find((p) => p.isCurrentHour);
    return nowPt?.hourLabel || forecast.hourly[0]?.hourLabel;
  }, [forecast.hourly]);

  const maxChartValue = Math.max(200, Math.ceil((forecast.maxAqi + 30) / 50) * 50);

  return (
    <div
      className={`bg-vayu-surface-elevated border border-vayu-border rounded-3xl p-4 sm:p-6 shadow-xl space-y-4 ${className}`}
    >
      {/* Header and Extreme Highlights */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-vayu-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-vayu-surface-tint border border-vayu-border flex items-center justify-center text-vayu-primary">
            <Activity className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-vayu-text">
              {t('forecast.title')}
            </h3>
            <p className="text-xs text-vayu-text-secondary">
              {t('forecast.subtitle')} • {forecast.timezone}
            </p>
          </div>
        </div>

        {/* Lowest & Highest Highlights */}
        <div className="flex items-center gap-2 text-xs">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold">
            <ArrowDown className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
            <span>
              {t('forecast.lowest')}: {forecast.minAqi} ({forecast.minAqiPoint?.hourLabel})
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 font-bold">
            <ArrowUp className="w-3.5 h-3.5 text-rose-500" aria-hidden="true" />
            <span>
              {t('forecast.highest')}: {forecast.maxAqi} ({forecast.maxAqiPoint?.hourLabel})
            </span>
          </div>
        </div>
      </div>

      {/* SVG Multi-Series Area Chart with AQI Bands */}
      <div className="w-full h-64 sm:h-72 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="aqiAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isDark ? '#F4A982' : '#B0E0E6'} stopOpacity={0.4} />
                <stop offset="95%" stopColor={isDark ? '#F4A982' : '#B0E0E6'} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            {/* Subtle AQI Category Background Bands */}
            <ReferenceArea y1={0} y2={50} fill="#10B981" fillOpacity={isDark ? 0.04 : 0.06} />
            <ReferenceArea y1={51} y2={100} fill="#F59E0B" fillOpacity={isDark ? 0.04 : 0.06} />
            <ReferenceArea y1={101} y2={150} fill="#F97316" fillOpacity={isDark ? 0.04 : 0.06} />
            <ReferenceArea y1={151} y2={200} fill="#EF4444" fillOpacity={isDark ? 0.04 : 0.06} />
            {maxChartValue > 200 && (
              <ReferenceArea y1={201} y2={maxChartValue} fill="#8B5CF6" fillOpacity={isDark ? 0.04 : 0.06} />
            )}

            <XAxis
              dataKey="hourLabel"
              interval="preserveStartEnd"
              stroke="var(--vayu-text-secondary)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'var(--vayu-border-subtle)' }}
            />
            <YAxis
              domain={[0, maxChartValue]}
              stroke="var(--vayu-text-secondary)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'var(--vayu-border-subtle)' }}
            />

            <Tooltip
              content={<CustomForecastTooltip hourlyPoints={forecast.hourly} />}
            />

            {/* "Now" reference marker */}
            {nowLabel && (
              <ReferenceLine
                x={nowLabel}
                stroke="var(--vayu-accent)"
                strokeDasharray="3 3"
                strokeWidth={2}
                label={{
                  value: t('forecast.now'),
                  fill: 'var(--vayu-text)',
                  fontSize: 10,
                  position: 'insideTopLeft',
                  fontWeight: 'bold',
                }}
              />
            )}

            {/* Minimum and Maximum AQI horizontal lines */}
            <ReferenceLine
              y={forecast.minAqi}
              stroke="#10B981"
              strokeDasharray="2 2"
              strokeWidth={1}
            />
            <ReferenceLine
              y={forecast.maxAqi}
              stroke="#EF4444"
              strokeDasharray="2 2"
              strokeWidth={1}
            />

            {/* AQI Primary Area */}
            {visibleSeries.us_aqi && (
              <Area
                type="monotone"
                dataKey="us_aqi"
                name="US AQI"
                stroke={isDark ? '#F4A982' : '#0284C7'}
                strokeWidth={2.5}
                fill="url(#aqiAreaGradient)"
                activeDot={{ r: 6, fill: isDark ? '#F4A982' : '#0284C7', stroke: '#ffffff', strokeWidth: 2 }}
              />
            )}

            {/* Optional Pollutant Lines (toggled by clickable legend) */}
            {visibleSeries.pm2_5 && (
              <Line
                type="monotone"
                dataKey="pm2_5"
                name="PM2.5"
                stroke="#EC4899"
                strokeWidth={1.8}
                dot={false}
              />
            )}
            {visibleSeries.pm10 && (
              <Line
                type="monotone"
                dataKey="pm10"
                name="PM10"
                stroke="#8B5CF6"
                strokeWidth={1.8}
                dot={false}
              />
            )}
            {visibleSeries.ozone && (
              <Line
                type="monotone"
                dataKey="ozone"
                name="Ozone"
                stroke="#14B8A6"
                strokeWidth={1.8}
                dot={false}
              />
            )}
            {visibleSeries.nitrogen_dioxide && (
              <Line
                type="monotone"
                dataKey="nitrogen_dioxide"
                name="NO₂"
                stroke="#F97316"
                strokeWidth={1.8}
                dot={false}
              />
            )}

            {/* Clickable Legend */}
            <Legend
              verticalAlign="bottom"
              height={36}
              onClick={(props) => {
                if (props && props.dataKey) {
                  toggleSeries(String(props.dataKey));
                }
              }}
              formatter={(value, entry) => {
                const entryDataKey = (entry as unknown as { dataKey?: string }).dataKey;
                const isVisible = entryDataKey
                  ? visibleSeries[entryDataKey as keyof typeof visibleSeries]
                  : true;
                return (
                  <span
                    className={`cursor-pointer text-xs font-semibold select-none transition ${
                      isVisible ? 'text-vayu-text font-bold' : 'text-vayu-text-secondary/50 line-through'
                    }`}
                  >
                    {value}
                  </span>
                );
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ForecastChart;
