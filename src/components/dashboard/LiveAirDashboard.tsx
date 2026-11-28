import type { JSX } from 'preact';
import { AirQualityData } from '../../types';
import { AQISeverityBadge, getAQIBandInfo } from '../common/AQISeverityBadge';
import { ForecastSvgChart } from './ForecastSvgChart';
import { WindIcon } from '../common/Icons';

interface LiveAirDashboardProps {
  data: AirQualityData;
  onRefresh: () => void;
  onOpenLocationModal: () => void;
  isRefreshing?: boolean;
}

export function LiveAirDashboard({
  data,
  onRefresh,
  onOpenLocationModal,
  isRefreshing = false,
}: LiveAirDashboardProps): JSX.Element {
  const band = getAQIBandInfo(data.aqi);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner & City Switcher */}
      <div
        class="card card-blue"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '1.4rem' }}>📍</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>{data.city}</h2>
            {data.isDemo && (
              <span class="badge badge-peach" style={{ fontSize: '0.7rem' }}>
                DEMO SMOG SCENARIO
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
            Updated: {new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Data: Open-Meteo Atmospheric Model
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={onOpenLocationModal}
            class="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
          >
            Change City
          </button>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            class="btn-primary"
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
          >
            {isRefreshing ? 'Refreshing...' : '↻ Refresh'}
          </button>
        </div>
      </div>

      {/* Hero AQI Gauge & Dominant Pollutant */}
      <div class="grid-2">
        {/* Main AQI Gauge Card */}
        <div
          class="card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '2rem 1.5rem',
            position: 'relative',
          }}
        >
          <div style={{ marginBottom: '0.75rem' }}>
            <AQISeverityBadge aqi={data.aqi} showDetails />
          </div>

          <div
            style={{
              fontSize: '4.25rem',
              fontWeight: '900',
              lineHeight: '1',
              letterSpacing: '-0.03em',
              color: 'var(--text-main)',
              marginBottom: '0.5rem',
            }}
            aria-label={`Current AQI value is ${data.aqi}`}
          >
            {data.aqi}
          </div>

          <p style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--c-blue-primary)', marginBottom: '0.25rem' }}>
            {band.label}
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '340px' }}>
            {band.headline}
          </p>

          <div
            style={{
              marginTop: '1.25rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-elevated)',
              fontSize: '0.8rem',
              fontWeight: '600',
              color: 'var(--text-subtle)',
            }}
          >
            Dominant Atmospheric Driver: <strong>{data.dominantPollutant}</strong>
          </div>
        </div>

        {/* Best Time Window Card */}
        <div class="card card-peach" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>⏰</span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Best Window to Step Out</h3>
            </div>

            {data.bestWindow ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--c-peach-primary)' }}>
                    {data.bestWindow.startTime} – {data.bestWindow.endTime}
                  </span>
                  <span class="badge badge-peach">Avg AQI ~{data.bestWindow.estimatedAqi}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {data.bestWindow.reason}
                </p>
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Pollution levels are uniformly high throughout the cycle. Minimize outdoor stays.
              </p>
            )}
          </div>

          <div
            style={{
              marginTop: '1.25rem',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              fontSize: '0.8rem',
              color: 'var(--text-subtle)',
            }}
          >
            💡 <strong>Why timing matters:</strong> Midday thermal boundary expansion breaks up surface inversion smog, reducing particle density up to 30%.
          </div>
        </div>
      </div>

      {/* 24-Hour Forecast SVG Chart */}
      <ForecastSvgChart hourly={data.hourly24h} title="Next 24-Hour Smog & Particulate Forecast" />

      {/* Pollutant Breakdown Grid */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <WindIcon size={18} /> Detailed Pollutant Breakdown
        </h3>

        <div class="grid-3">
          {[
            {
              name: 'PM2.5 (Fine Particles)',
              val: `${data.pollutants.pm2_5} µg/m³`,
              whoLimit: '15 µg/m³ (WHO 24h limit)',
              desc: 'Microscopic particles smaller than 2.5 µm that penetrate deep into lung alveoli and bloodstream.',
              status: data.pollutants.pm2_5 > 60 ? 'High' : data.pollutants.pm2_5 > 35 ? 'Moderate' : 'Good',
            },
            {
              name: 'PM10 (Coarse Particles)',
              val: `${data.pollutants.pm10} µg/m³`,
              whoLimit: '45 µg/m³ (WHO 24h limit)',
              desc: 'Inhalable road dust, pollen, and combustion ash that irritate the upper throat and bronchial tubes.',
              status: data.pollutants.pm10 > 100 ? 'High' : data.pollutants.pm10 > 50 ? 'Moderate' : 'Good',
            },
            {
              name: 'NO₂ (Nitrogen Dioxide)',
              val: `${data.pollutants.no2} µg/m³`,
              whoLimit: '25 µg/m³ (WHO 24h limit)',
              desc: 'Toxic reddish-brown gas from vehicle exhausts and power generation. Inflames airways.',
              status: data.pollutants.no2 > 40 ? 'High' : 'Moderate',
            },
            {
              name: 'O₃ (Surface Ozone)',
              val: `${data.pollutants.o3} µg/m³`,
              whoLimit: '100 µg/m³ (WHO 8h limit)',
              desc: 'Secondary smog formed when vehicle fumes react with intense sunlight.',
              status: data.pollutants.o3 > 80 ? 'High' : 'Good',
            },
          ].map((item) => (
            <div key={item.name} class="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '700' }}>{item.name}</h4>
                <span class={`badge ${item.status === 'High' ? 'badge-peach' : item.status === 'Moderate' ? 'badge-lavender' : 'badge-blue'}`}>
                  {item.status}
                </span>
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                {item.val}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--c-blue-primary)', marginBottom: '0.5rem' }}>
                {item.whoLimit}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', lineHeight: '1.4' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
