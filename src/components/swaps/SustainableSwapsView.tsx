import type { JSX } from 'preact';
import { SustainableSwap } from '../../types';
import { LeafIcon } from '../common/Icons';

interface SustainableSwapsViewProps {
  swaps: SustainableSwap[];
}

export function SustainableSwapsView({ swaps }: SustainableSwapsViewProps): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div class="card card-peach">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <LeafIcon size={24} className="text-peach" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Sustainable Community Swaps</h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          Urban smog is not an act of nature—it is produced by millions of micro-actions: vehicle cold starts, biomass burning, and leaf fires. Here is how your household can reduce collective community emissions.
        </p>
      </div>

      {/* Swaps Grid */}
      <div class="grid-2">
        {swaps.map((item) => (
          <div key={item.id} class="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span class="badge badge-peach" style={{ fontSize: '0.75rem' }}>
                  {item.category}
                </span>
                <span class="badge badge-lavender" style={{ fontSize: '0.7rem' }}>
                  Effort: {item.effort}
                </span>
              </div>

              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textDecoration: 'line-through' }}>
                  Current: {item.currentHabit}
                </span>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--c-blue-primary)', marginTop: '0.2rem' }}>
                  ⇄ Swap: {item.betterSwap}
                </h3>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                {item.whyThisMatters}
              </p>
            </div>

            <div style={{ padding: '0.65rem 0.85rem', backgroundColor: 'var(--c-blue-light)', borderRadius: 'var(--radius-md)', marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--c-blue-primary)', textTransform: 'uppercase' }}>
                YOUR 1-WEEK IMPACT IF YOU DO THIS:
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.15rem' }}>
                {item.weeklyImpact}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
