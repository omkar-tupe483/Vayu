import type { JSX } from 'preact';
import { ShieldIcon } from '../common/Icons';

interface TrustPageViewProps {
  onEraseAllData: () => void;
}

export function TrustPageView({ onEraseAllData }: TrustPageViewProps): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div class="card card-blue">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <ShieldIcon size={24} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>How Vayu Estimates Air & Health Guidance</h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          We believe environmental guidance must be 100% transparent. Here is the exact scientific methodology, data sources, physics formulas, and confidence framework behind every number in Vayu.
        </p>
      </div>

      {/* Sources Card */}
      <div class="card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--c-blue-primary)' }}>
          1. Data Sources & Mathematical Models
        </h3>
        <ul style={{ fontSize: '0.85rem', color: 'var(--text-main)', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: '1.5' }}>
          <li>
            <strong>Open-Meteo Air Quality API:</strong> Integrates Copernicus Atmosphere Monitoring Service (CAMS) and NOAA GFS-Chem atmospheric chemical transport models at 11 km horizontal grid resolution.
          </li>
          <li>
            <strong>United States EPA AQI Standard:</strong> Calculated using standard linear piecewise interpolation across official particulate breakpoints for PM2.5, PM10, NO2, and Ozone.
          </li>
          <li>
            <strong>World Health Organization (WHO 2021):</strong> Health thresholds reference the 2021 WHO Global Air Quality Guidelines (annual PM2.5 target 5 µg/m³, 24-hour target 15 µg/m³).
          </li>
          <li>
            <strong>Corsi-Rosenthal Box Fan CADR:</strong> DIY purifier performance benchmarks are derived from published peer-reviewed studies (UC Davis, EPA ORD testing) documenting 60-75% particulate filtration efficiency.
          </li>
        </ul>
      </div>

      {/* Meaning of Confidence Labels */}
      <div class="card card-lavender">
        <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          2. Meaning of Confidence Labels
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          <div style={{ padding: '0.65rem 0.85rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
            <span class="badge badge-blue" style={{ marginBottom: '0.2rem' }}>High Confidence</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Directly grounded in peer-reviewed aerosol physics or official clinical consensus (e.g., N95 filter filtration media, smoke dangers of biomass, thermal night inversions).
            </p>
          </div>
          <div style={{ padding: '0.65rem 0.85rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
            <span class="badge badge-lavender" style={{ marginBottom: '0.2rem' }}>Medium Confidence</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Subject to real-world user variance: facial seal leakage on respirators (10-15%), building draft leakage, or microclimate differences across city streets.
            </p>
          </div>
          <div style={{ padding: '0.65rem 0.85rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
            <span class="badge badge-peach" style={{ marginBottom: '0.2rem' }}>Low Confidence</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Directional heuristics (e.g., generalized estimates for cooking grease without specific range hood CFM specifications).
            </p>
          </div>
        </div>
      </div>

      {/* Scientific Limitations & Medical Disclaimer */}
      <div class="card card-peach">
        <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          3. Limitations & Strict Non-Medical Status
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.5', marginBottom: '0.5rem' }}>
          Atmospheric models calculate regional grid averages. If your neighbor is burning garbage or your street is congested with diesel idling, local hyper-local concentrations can be 2x to 3x higher than regional averages.
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
          <strong>Legal & Medical Notice:</strong> Vayu is an informational environmental awareness tool. It is not an FDA/CDSCO medical device and does not diagnose, treat, or cure asthma, COPD, or cardiovascular diseases. Always follow your licensed healthcare provider’s treatment plan.
        </p>
      </div>

      {/* Data Privacy & Erase Everything */}
      <div class="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Local Data & Privacy Controls</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
            Your city, household members, and preferences are stored exclusively on your device.
          </p>
        </div>
        <button
          type="button"
          onClick={onEraseAllData}
          class="btn-peach"
          style={{ fontSize: '0.85rem' }}
        >
          🗑️ Erase All My Data
        </button>
      </div>
    </div>
  );
}
