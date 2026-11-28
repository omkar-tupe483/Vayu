import type { JSX } from 'preact';
import { HouseholdMember } from '../../types';
import { getHealthShieldGuidance } from '../../services/ruleEngine';
import { ShieldIcon, MaskIcon, AlertTriangleIcon } from '../common/Icons';

interface HealthShieldViewProps {
  household: HouseholdMember[];
  currentAqi: number;
  onEditHousehold: () => void;
}

export function HealthShieldView({
  household,
  currentAqi,
  onEditHousehold,
}: HealthShieldViewProps): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Overview & Medical Banner */}
      <div class="card card-peach">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <AlertTriangleIcon size={24} className="text-peach" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Emergency Symptoms & Medical Triage</h2>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
          Smog particles can precipitate acute cardiovascular and asthmatic episodes. <strong>Call 108 / 112 / 911 immediately</strong> if anyone experiences:
        </p>
        <ul style={{ fontSize: '0.85rem', color: 'var(--text-main)', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <li>Crushing chest pain, heavy chest pressure, or radiating pain to the jaw/arm.</li>
          <li>Severe respiratory distress: breathing so hard the ribs pull inward (retractions).</li>
          <li>Bluish or pale lips, fingernails, or tongue.</li>
          <li>Asthma attack unresponsive to rescue bronchodilator within 15 minutes.</li>
        </ul>
      </div>

      {/* Mask & Respirator Clinical Guide */}
      <div class="card card-lavender">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <MaskIcon size={22} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Certified Mask & Respirator Guidance</h3>
        </div>
        <div class="grid-2" style={{ marginTop: '0.75rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: '700', color: 'var(--c-blue-primary)', marginBottom: '0.25rem' }}>
              ✓ Certified N95 / FFP2 / KN95
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Filters &gt;95% of fine PM2.5 particulates. Must create a tight perimeter seal over the bridge of the nose and chin without air leaks.
            </p>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: '700', color: 'var(--c-peach-primary)', marginBottom: '0.25rem' }}>
              ⚠️ Cloth & Surgical Masks (Ineffective)
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Cloth bandanas and loose blue surgical masks leak around the edges and do NOT filter microscopic PM2.5 particles deep into lung tissue.
            </p>
          </div>
        </div>
      </div>

      {/* Household Members List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldIcon size={20} /> Protection for Your Household ({household.length})
          </h3>
          <button
            type="button"
            onClick={onEditHousehold}
            class="badge badge-blue"
            style={{ cursor: 'pointer', padding: '0.35rem 0.75rem' }}
          >
            + Edit Members
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {household.map((member) => {
            const guide = getHealthShieldGuidance(member, currentAqi);
            const isSevere = member.riskLevel === 'Severe' || member.riskLevel === 'High';

            return (
              <div key={member.id} class={`card ${isSevere ? 'card-peach' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>
                      {member.role === 'child' ? '👶' : member.role === 'elderly' ? '👵' : member.role === 'pregnant' ? '🤰' : member.role === 'pet' ? '🐾' : '🫁'}
                    </span>
                    <h4 style={{ fontSize: '1rem', fontWeight: '800' }}>{member.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'capitalize' }}>
                      ({member.role})
                    </span>
                  </div>

                  <span class={`badge ${member.riskLevel === 'Severe' ? 'badge-peach' : member.riskLevel === 'High' ? 'badge-lavender' : 'badge-blue'}`}>
                    Risk: {member.riskLevel}
                  </span>
                </div>

                <div class="grid-2" style={{ gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div>
                    <strong style={{ color: 'var(--c-blue-primary)' }}>Outdoor Activity Advice:</strong>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>{guide.outdoorAdvice}</p>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--c-lavender-primary)' }}>Mask & Respirator Fit:</strong>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>{guide.maskAdvice}</p>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--c-peach-primary)' }}>Early Symptoms to Watch:</strong>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>{guide.symptomsToWatch}</p>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--c-peach-primary)' }}>When to Seek Doctor:</strong>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>{guide.whenToSeekDoctor}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
