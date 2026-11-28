import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import { HourlyForecastPoint } from '../../types';

interface ForecastSvgChartProps {
  hourly: HourlyForecastPoint[];
  title?: string;
}

export function ForecastSvgChart({ hourly, title = '24-Hour Air Quality Forecast' }: ForecastSvgChartProps): JSX.Element {
  const [showTable, setShowTable] = useState(false);

  if (!hourly || hourly.length === 0) {
    return <div class="card">No forecast data available.</div>;
  }

  // Calculate scales for SVG (600w x 180h)
  const width = 600;
  const height = 180;
  const paddingX = 40;
  const paddingY = 30;

  const aqiValues = hourly.map((p) => p.aqi);
  const maxAqi = Math.max(300, ...aqiValues) + 20;
  const minAqi = 0;

  const points = hourly.map((p, idx) => {
    const x = paddingX + (idx / (hourly.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((p.aqi - minAqi) / (maxAqi - minAqi)) * (height - 2 * paddingY);
    return { ...p, x, y };
  });

  const polylinePoints = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <div class="card" style={{ overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>{title}</h3>
        <button
          type="button"
          onClick={() => setShowTable(!showTable)}
          class="badge badge-lavender"
          style={{ cursor: 'pointer', fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
          aria-expanded={showTable}
          aria-controls="forecast-table"
        >
          {showTable ? 'View Chart' : 'View Data Table'}
        </button>
      </div>

      {!showTable ? (
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{ width: '100%', height: 'auto', minWidth: '380px', display: 'block' }}
            role="img"
            aria-label={`Line chart showing ${title} with AQI fluctuating from ${Math.min(...aqiValues)} to ${Math.max(...aqiValues)}`}
          >
            {/* Horizontal Grid Threshold Lines */}
            {[50, 100, 200, 300].map((threshold) => {
              const y = height - paddingY - ((threshold - minAqi) / (maxAqi - minAqi)) * (height - 2 * paddingY);
              return (
                <g key={threshold}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={width - paddingX}
                    y2={y}
                    stroke="var(--border-subtle)"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 3}
                    textAnchor="end"
                    fill="var(--text-subtle)"
                    fontSize="9"
                    fontWeight="600"
                  >
                    {threshold}
                  </text>
                </g>
              );
            })}

            {/* Gradient Area Fill */}
            <defs>
              <linearGradient id="aqiFillGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--c-peach-soft)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--c-blue-soft)" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Area path */}
            <polygon
              points={`${points[0]?.x},${height - paddingY} ${polylinePoints} ${points[points.length - 1]?.x},${height - paddingY}`}
              fill="url(#aqiFillGrad)"
            />

            {/* Trend Polyline */}
            <polyline
              points={polylinePoints}
              fill="none"
              stroke="var(--c-peach-primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points */}
            {points.map((pt) => (
              <g key={pt.time}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={pt.isBestWindow ? 5.5 : 4}
                  fill={pt.isBestWindow ? 'var(--c-blue-primary)' : 'var(--c-peach-primary)'}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                >
                  <title>{`${pt.time}: AQI ${pt.aqi} (PM2.5: ${pt.pm2_5} µg/m³)${pt.isBestWindow ? ' [Best Window]' : ''}`}</title>
                </circle>

                {/* Hour label */}
                <text
                  x={pt.x}
                  y={height - 8}
                  textAnchor="middle"
                  fill={pt.isBestWindow ? 'var(--c-blue-primary)' : 'var(--text-subtle)'}
                  fontSize="10"
                  fontWeight={pt.isBestWindow ? '700' : '500'}
                >
                  {pt.time}
                </text>
              </g>
            ))}
          </svg>
        </div>
      ) : (
        /* Accessible Data Table Fallback */
        <div id="forecast-table" style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <caption class="sr-only">Hourly Air Quality Index and PM2.5 particulate values</caption>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-strong)', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Time</th>
                <th style={{ padding: '0.5rem' }}>AQI</th>
                <th style={{ padding: '0.5rem' }}>PM2.5 (µg/m³)</th>
                <th style={{ padding: '0.5rem' }}>Window Assessment</th>
              </tr>
            </thead>
            <tbody>
              {hourly.map((pt) => (
                <tr key={pt.time} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.5rem', fontWeight: '600' }}>{pt.time}</td>
                  <td style={{ padding: '0.5rem' }}>{pt.aqi}</td>
                  <td style={{ padding: '0.5rem' }}>{pt.pm2_5}</td>
                  <td style={{ padding: '0.5rem' }}>
                    {pt.isBestWindow ? (
                      <span class="badge badge-blue">Best Cleanest Window</span>
                    ) : (
                      'Normal'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
