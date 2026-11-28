import { useState, useMemo } from 'preact/hooks';
import type { JSX } from 'preact';
import { WhatIfInputs } from '../../types';
import { calculateWhatIfImpact } from '../../services/ruleEngine';

interface WhatIfSimulatorViewProps {
  currentAqi: number;
}

export function WhatIfSimulatorView({ currentAqi }: WhatIfSimulatorViewProps): JSX.Element {
  const [inputs, setInputs] = useState<WhatIfInputs>({
    skipCarTripKm: 5,
    switchCookingToClean: true,
    runPurifierHours: 8,
    ventilateCleanestHour: true,
    wearN95Commute: true,
  });

  const result = useMemo(() => calculateWhatIfImpact(inputs, currentAqi), [inputs, currentAqi]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div class="card card-blue">
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.35rem' }}>
          "What If?" Exposure & Impact Simulator
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Toggle habits to calculate real-time estimated reduction in your personal lung exposure and avoided neighborhood emissions.
        </p>
      </div>

      {/* Interactive Controls & Live Meter */}
      <div class="grid-2">
        {/* Controls Card */}
        <div class="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Adjust Your Actions</h3>

          {/* Slider 1: Skip car trips */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <label htmlFor="car-km-slider" style={{ fontWeight: '700' }}>
                🚗 Skip or Combine Car Trips:
              </label>
              <span class="badge badge-peach">{inputs.skipCarTripKm} km / week</span>
            </div>
            <input
              id="car-km-slider"
              type="range"
              min="0"
              max="30"
              step="1"
              value={inputs.skipCarTripKm}
              onInput={(e) => setInputs({ ...inputs, skipCarTripKm: Number((e.target as HTMLInputElement).value) })}
              style={{ width: '100%', accentColor: 'var(--c-peach-primary)' }}
            />
          </div>

          {/* Slider 2: Purifier hours */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <label htmlFor="purifier-hours-slider" style={{ fontWeight: '700' }}>
                💨 Run Bedroom HEPA Purifier:
              </label>
              <span class="badge badge-blue">{inputs.runPurifierHours} hours / day</span>
            </div>
            <input
              id="purifier-hours-slider"
              type="range"
              min="0"
              max="24"
              step="1"
              value={inputs.runPurifierHours}
              onInput={(e) => setInputs({ ...inputs, runPurifierHours: Number((e.target as HTMLInputElement).value) })}
              style={{ width: '100%', accentColor: 'var(--c-blue-primary)' }}
            />
          </div>

          {/* Toggle: Wear N95 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>😷 Wear Sealed N95 on Commute</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Filters 95%+ of traffic exhaust particulates</div>
            </div>
            <input
              type="checkbox"
              checked={inputs.wearN95Commute}
              onChange={(e) => setInputs({ ...inputs, wearN95Commute: (e.target as HTMLInputElement).checked })}
              style={{ width: '22px', height: '22px' }}
            />
          </div>

          {/* Toggle: Clean Cooking */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>🍳 Use Clean Fuel & Range Hood</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Eliminates indoor cooking smoke build-up</div>
            </div>
            <input
              type="checkbox"
              checked={inputs.switchCookingToClean}
              onChange={(e) => setInputs({ ...inputs, switchCookingToClean: (e.target as HTMLInputElement).checked })}
              style={{ width: '22px', height: '22px' }}
            />
          </div>

          {/* Toggle: Ventilate during cleanest hour */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>⏰ Time Window Cross-Ventilation</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Open windows only during the cleanest midday hour</div>
            </div>
            <input
              type="checkbox"
              checked={inputs.ventilateCleanestHour}
              onChange={(e) => setInputs({ ...inputs, ventilateCleanestHour: (e.target as HTMLInputElement).checked })}
              style={{ width: '22px', height: '22px' }}
            />
          </div>
        </div>

        {/* Live Impact Results Card */}
        <div class="card card-lavender" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Simulated Impact</h3>
              <span class="badge badge-lavender">{result.confidence} Confidence</span>
            </div>

            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{ fontSize: '3.75rem', fontWeight: '900', color: 'var(--c-blue-primary)', lineHeight: 1 }}>
                -{result.personalExposureReductionPct}%
              </div>
              <p style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.5rem' }}>
                Estimated Personal Exposure Reduction
              </p>
            </div>

            <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--c-peach-primary)' }}>
                COMMUNITY EMISSIONS AVOIDED:
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                ~{result.communityEmissionAvoidedGrams} grams CO₂ / pollutants avoided
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              {result.explanation}
            </p>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            📐 <strong>Formula Transparency:</strong> Exposure reduction formula assumes 8 hours in bedroom, 2 hours commuting in traffic, and 14 hours indoor daytime living. Modeled based on EPA air infiltration equations and certified respirator filtering rates.
          </div>
        </div>
      </div>
    </div>
  );
}
