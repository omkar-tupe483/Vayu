import type { JSX } from 'preact';
import { RoomHack } from '../../types';
import { HomeIcon } from '../common/Icons';

interface IndoorAirLabViewProps {
  hacks: RoomHack[];
  currentAqi: number;
}

export function IndoorAirLabView({ hacks, currentAqi }: IndoorAirLabViewProps): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div class="card card-lavender">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <HomeIcon size={24} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Indoor Air Lab & Room Strategies</h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          Indoor air is frequently 2x to 5x more polluted than outdoor air during winter due to trapped cooking smoke, indoor dust, and chemical cleaning aerosols. Use room-by-room zoning to protect your family.
        </p>
      </div>

      {/* Room by Room Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {hacks.map((item) => (
          <div key={item.id} class="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.3rem' }}>
                  {item.room === 'Bedroom' ? '🛏️' : item.room === 'Kitchen' ? '🍳' : item.room === 'Living Room' ? '🛋️' : '🚪'}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>{item.room}: {item.title}</h3>
              </div>
              <span class="badge badge-lavender">{item.confidence} Confidence</span>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
              {item.guidance}
            </p>

            <div class="grid-2" style={{ gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ padding: '0.65rem 0.85rem', backgroundColor: 'var(--c-blue-light)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--c-blue-primary)', marginBottom: '0.2rem' }}>
                  VENTILATION TIMING (OUTDOOR AQI {currentAqi})
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{item.ventilationTiming}</div>
              </div>

              <div style={{ padding: '0.65rem 0.85rem', backgroundColor: 'var(--c-lavender-light)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--c-lavender-primary)', marginBottom: '0.2rem' }}>
                  PURIFIER POSITIONING & CARE
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{item.purifierTip}</div>
              </div>
            </div>

            {/* Honest DIY Note */}
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.9rem' }}>🛠️</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--c-peach-primary)' }}>
                  DIY OPTION: {item.diyOption.description}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                <strong>Honest Effectiveness:</strong> {item.diyOption.honestEffectiveness}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Honest Buying Guide (No Brands) */}
      <div class="card card-peach">
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Purifier & Filter Buying Guide (Unbiased, No Brands)
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          When buying an air purifier, ignore marketing buzzwords and verify these 4 laboratory specifications:
        </p>

        <ul style={{ fontSize: '0.85rem', color: 'var(--text-main)', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <li>
            <strong>1. True HEPA (H13/H14) Filter:</strong> Mechanically captures 99.97% of particles down to 0.3 µm. Avoid filters vaguely labeled "HEPA-type" without class certifications.
          </li>
          <li>
            <strong>2. Clean Air Delivery Rate (CADR):</strong> Ensure the CADR (m³/h) matches your room volume. A bedroom of 150 sq ft needs at least 200 m³/h CADR to achieve 4 to 5 complete air changes per hour (ACH).
          </li>
          <li>
            <strong>3. Activated Carbon Layer:</strong> Essential if you have traffic fumes or cooking gas odors (traps VOCs and NO2 that HEPA cannot capture).
          </li>
          <li>
            <strong>4. Absolutely Avoid Ozone Generators or Ionizers:</strong> Electric needlepoint ionizers produce ozone gas, a potent lung irritant that damages asthma patients. Choose pure mechanical filtration only.
          </li>
        </ul>
      </div>
    </div>
  );
}
