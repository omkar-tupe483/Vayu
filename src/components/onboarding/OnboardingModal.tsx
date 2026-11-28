import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import { HouseholdMember, LifestyleProfile } from '../../types';
import { PRESET_CITIES, searchCities } from '../../services/airQualityService';
import { CheckIcon } from '../common/Icons';

interface OnboardingModalProps {
  initialProfile: LifestyleProfile;
  initialHousehold: HouseholdMember[];
  onComplete: (profile: LifestyleProfile, household: HouseholdMember[]) => void;
  onClose: () => void;
}

export function OnboardingModal({
  initialProfile,
  initialHousehold,
  onComplete,
  onClose,
}: OnboardingModalProps): JSX.Element {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [profile, setProfile] = useState<LifestyleProfile>(initialProfile);
  const [household, setHousehold] = useState<HouseholdMember[]>(initialHousehold);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityOptions, setCityOptions] = useState(PRESET_CITIES);
  const [isLocating, setIsLocating] = useState(false);
  const [locateError, setLocateError] = useState('');

  const handleCitySearch = async (val: string) => {
    setSearchQuery(val);
    const results = await searchCities(val);
    setCityOptions(results);
  };

  const selectCity = (c: { name: string; lat: number; lon: number }) => {
    setProfile((prev) => ({ ...prev, city: c.name, latitude: c.lat, longitude: c.lon }));
    setSearchQuery('');
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocateError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setLocateError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setProfile((prev) => ({
          ...prev,
          city: 'My Location',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
      },
      (err) => {
        setIsLocating(false);
        setLocateError(`Location access denied or timed out (${err.message}). Choose city manually.`);
      },
      { timeout: 8000 }
    );
  };

  const toggleHouseholdRole = (role: HouseholdMember['role']) => {
    setHousehold((prev) => {
      const exists = prev.find((m) => m.role === role);
      if (exists) {
        return prev.filter((m) => m.role !== role);
      }
      const risk =
        role === 'respiratory' || role === 'pregnant'
          ? 'Severe'
          : role === 'elderly' || role === 'child'
          ? 'High'
          : 'Low';

      return [
        ...prev,
        {
          id: `member-${Date.now()}-${role}`,
          name: role === 'child' ? 'Child' : role === 'elderly' ? 'Senior' : role === 'pregnant' ? 'Pregnant' : role === 'respiratory' ? 'Asthma/Respiratory' : 'Pet',
          role,
          hasAsthmaOrHeart: role === 'respiratory',
          riskLevel: risk,
        },
      ];
    });
  };

  const finish = () => {
    onComplete(profile, household);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        class="card"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        {/* Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--c-blue-primary)', textTransform: 'uppercase' }}>
            Step {step} of 3
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Skip onboarding"
            style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', textDecoration: 'underline' }}
          >
            Skip for now
          </button>
        </div>

        {/* Step 1: Location */}
        {step === 1 && (
          <div>
            <h2 id="onboarding-title" style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              Where do you live?
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Air pollution varies dramatically across regions. Select your city to receive real-time atmospheric data.
            </p>

            <button
              type="button"
              onClick={detectLocation}
              disabled={isLocating}
              class="btn-secondary"
              style={{ width: '100%', marginBottom: '1rem', gap: '0.5rem' }}
            >
              {isLocating ? 'Detecting GPS...' : '📍 Use My Current Location'}
            </button>
            {locateError && (
              <p style={{ color: 'var(--c-peach-primary)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                {locateError}
              </p>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="city-search" style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.35rem' }}>
                Or search city:
              </label>
              <input
                id="city-search"
                type="text"
                class="input"
                placeholder="e.g. Pune, Delhi, Mumbai..."
                value={searchQuery}
                onInput={(e) => handleCitySearch((e.target as HTMLInputElement).value)}
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {cityOptions.slice(0, 6).map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => selectCity(c)}
                  class={`badge ${profile.city.toLowerCase() === c.name.toLowerCase() ? 'badge-blue' : 'badge-lavender'}`}
                  style={{ cursor: 'pointer', padding: '0.4rem 0.75rem' }}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--c-blue-primary)', marginBottom: '1.5rem' }}>
              Active City: {profile.city}
            </p>

            <button type="button" onClick={() => setStep(2)} class="btn-primary" style={{ width: '100%' }}>
              Next: Household Members →
            </button>
          </div>
        )}

        {/* Step 2: Household Members */}
        {step === 2 && (
          <div>
            <h2 id="onboarding-title" style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              Who lives in your home?
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Vulnerable lungs require protective thresholds. Select all that apply to calibrate health alerts.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { role: 'child' as const, label: '👶 Young Children (under 12)', desc: 'Higher breathing rate relative to body size.' },
                { role: 'elderly' as const, label: '👵 Seniors / Elderly (65+)', desc: 'Increased cardiopulmonary strain.' },
                { role: 'pregnant' as const, label: '🤰 Pregnant People', desc: 'Fine particles cross placental barrier.' },
                { role: 'respiratory' as const, label: '🫁 Asthma / COPD / Heart Condition', desc: 'Acute sensitivity to PM2.5 bronchospasms.' },
                { role: 'pet' as const, label: '🐾 Pets (Dogs/Cats/Birds)', desc: 'Close to floor-level dust.' },
              ].map((item) => {
                const isSelected = household.some((m) => m.role === item.role);
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => toggleHouseholdRole(item.role)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${isSelected ? 'var(--c-blue-primary)' : 'var(--border-subtle)'}`,
                      backgroundColor: isSelected ? 'var(--c-blue-light)' : 'var(--bg-elevated)',
                      textAlign: 'left',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>{item.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{item.desc}</div>
                    </div>
                    {isSelected && <CheckIcon size={18} className="text-blue" />}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={() => setStep(1)} class="btn-secondary" style={{ flex: 1 }}>
                ← Back
              </button>
              <button type="button" onClick={() => setStep(3)} class="btn-primary" style={{ flex: 2 }}>
                Next: Lifestyle Habits →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Lifestyle Profile */}
        {step === 3 && (
          <div>
            <h2 id="onboarding-title" style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              Your Lifestyle & Home
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Indoor emissions and transit habits shape your daily exposure.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label htmlFor="commute-select" style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.25rem' }}>
                  Primary Commute Method:
                </label>
                <select
                  id="commute-select"
                  class="input"
                  value={profile.commuteMode}
                  onChange={(e) => setProfile({ ...profile, commuteMode: (e.target as HTMLSelectElement).value as LifestyleProfile['commuteMode'] })}
                >
                  <option value="walk">Walking / Foot Commute</option>
                  <option value="bicycle">Bicycle / Cycle</option>
                  <option value="metro_bus">Metro, Bus, or Shared Public Transit</option>
                  <option value="car_motorcycle">Car or Motorcycle</option>
                </select>
              </div>

              <div>
                <label htmlFor="cooking-select" style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.25rem' }}>
                  Primary Cooking Fuel:
                </label>
                <select
                  id="cooking-select"
                  class="input"
                  value={profile.cookingFuel}
                  onChange={(e) => setProfile({ ...profile, cookingFuel: (e.target as HTMLSelectElement).value as LifestyleProfile['cookingFuel'] })}
                >
                  <option value="lpg_electric">LPG Gas Cylinder or Electric Induction</option>
                  <option value="piped_gas">Piped Natural Gas (PNG)</option>
                  <option value="biomass_wood_coal">Biomass, Wood, or Coal Chulha</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
                <input
                  id="has-purifier"
                  type="checkbox"
                  checked={profile.hasPurifier}
                  onChange={(e) => setProfile({ ...profile, hasPurifier: (e.target as HTMLInputElement).checked })}
                  style={{ width: '20px', height: '20px' }}
                />
                <label htmlFor="has-purifier" style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                  I own an indoor HEPA air purifier
                </label>
              </div>
            </div>

            {/* Privacy Guarantee */}
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--c-lavender-light)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--c-lavender-primary)' }}>
                🔒 <strong>Privacy Assurance:</strong> Your selections are saved purely in your browser’s localStorage. No personal tracking, no cloud accounts, and zero advertising cookies.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={() => setStep(2)} class="btn-secondary" style={{ flex: 1 }}>
                ← Back
              </button>
              <button type="button" onClick={finish} class="btn-peach" style={{ flex: 2 }}>
                Complete & View Air Plan ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
