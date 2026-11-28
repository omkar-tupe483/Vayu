import type { JSX } from 'preact';
import { DailyPlanItem } from '../../types';

interface DailyPlanViewProps {
  plan: DailyPlanItem[];
  city: string;
  aqi: number;
}

export function DailyPlanView({ plan, city, aqi }: DailyPlanViewProps): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header card */}
      <div class="card card-blue">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Your Smog-Smart Daily Plan</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Tailored for {city} (AQI {aqi}) from morning temperature inversion to nighttime bedroom protection.
            </p>
          </div>
          <span class="badge badge-blue">Deterministic + GenAI Grounded</span>
        </div>
      </div>

      {/* Plan list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {plan.map((item) => (
          <div key={item.id} class="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--c-blue-primary)', textTransform: 'uppercase' }}>
                {item.timeSlot}
              </span>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <span class="badge badge-lavender" style={{ fontSize: '0.7rem' }}>
                  Effort: {item.effort}
                </span>
                <span class="badge badge-peach" style={{ fontSize: '0.7rem' }}>
                  Cost: {item.cost}
                </span>
              </div>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              {item.action}
            </h3>

            <div style={{ padding: '0.65rem 0.85rem', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-subtle)', marginBottom: '0.2rem' }}>
                WHY THIS MATTERS
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {item.whyThisMatters}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--c-peach-primary)' }}>
                  ESTIMATED EXPOSURE IMPACT:
                </span>
                <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginTop: '0.1rem' }}>
                  {item.estimatedImpact}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Confidence:</span>
                <span
                  class={`badge ${item.confidence === 'High' ? 'badge-blue' : item.confidence === 'Medium' ? 'badge-lavender' : 'badge-peach'}`}
                  style={{ fontSize: '0.7rem' }}
                >
                  {item.confidence} Confidence
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Honesty note */}
      <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
        ⚖️ <strong>Scientific Transparency:</strong> Impact percentages are estimates based on aerosol dispersion physics, building infiltration modeling, and respiratory volume rates. They are environmental benchmarks to inform lifestyle pacing, never individualized clinical facts.
      </div>
    </div>
  );
}
