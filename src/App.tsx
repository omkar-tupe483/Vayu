import { useState, useEffect } from 'preact/hooks';
import type { JSX } from 'preact';
import {
  AirQualityData,
  HouseholdMember,
  LifestyleProfile,
} from './types';
import {
  fetchLiveAirQuality,
  DEMO_SEVERE_SMOG_DATA,
} from './services/airQualityService';
import {
  generateDailyPlan,
  generateIndoorLabHacks,
  generateSustainableSwaps,
} from './services/ruleEngine';
import { Language, getTranslation } from './services/i18n';
import { speakText, stopSpeaking, isSpeechSynthesisSupported } from './services/speech';

// Components
import { WindIcon, SunIcon, MoonIcon, VolumeIcon } from './components/common/Icons';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { LiveAirDashboard } from './components/dashboard/LiveAirDashboard';
import { HealthShieldView } from './components/health/HealthShieldView';
import { DailyPlanView } from './components/plan/DailyPlanView';
import { IndoorAirLabView } from './components/indoor/IndoorAirLabView';
import { SustainableSwapsView } from './components/swaps/SustainableSwapsView';
import { WhatIfSimulatorView } from './components/simulator/WhatIfSimulatorView';
import { AskVayuChatView } from './components/chat/AskVayuChatView';
import { VayuBuddyKidView } from './components/kid/VayuBuddyKidView';
import { TrustPageView } from './components/trust/TrustPageView';

type ActiveTab =
  | 'dashboard'
  | 'shield'
  | 'dailyPlan'
  | 'indoorLab'
  | 'swaps'
  | 'simulator'
  | 'askVayu'
  | 'trust';

const DEFAULT_PROFILE: LifestyleProfile = {
  city: 'Pune',
  latitude: 18.5204,
  longitude: 73.8567,
  commuteMode: 'car_motorcycle',
  cookingFuel: 'lpg_electric',
  heatingMethod: 'none_mild',
  homeType: 'apartment',
  budgetTier: 'flexible',
  hasPurifier: true,
};

const DEFAULT_HOUSEHOLD: HouseholdMember[] = [
  { id: 'm1', name: 'Aarav', role: 'child', riskLevel: 'High' },
  { id: 'm2', name: 'Grandmother', role: 'elderly', hasAsthmaOrHeart: true, riskLevel: 'Severe' },
];

export function App(): JSX.Element {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return document.documentElement.classList.contains('dark');
    } catch {
      return false;
    }
  });

  // Language state
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return (localStorage.getItem('vayu_lang') as Language) || 'en';
    } catch {
      return 'en';
    }
  });

  // Kid mode toggle
  const [isKidMode, setIsKidMode] = useState<boolean>(false);

  // Demo mode toggle (Severe smog day)
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // User Profile & Household
  const [profile, setProfile] = useState<LifestyleProfile>(() => {
    try {
      const saved = localStorage.getItem('vayu_profile');
      return saved ? (JSON.parse(saved) as LifestyleProfile) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [household, setHousehold] = useState<HouseholdMember[]>(() => {
    try {
      const saved = localStorage.getItem('vayu_household');
      return saved ? (JSON.parse(saved) as HouseholdMember[]) : DEFAULT_HOUSEHOLD;
    } catch {
      return DEFAULT_HOUSEHOLD;
    }
  });

  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('vayu_onboarded');
    } catch {
      return false;
    }
  });

  // Air quality data
  const [airData, setAirData] = useState<AirQualityData>(() =>
    isDemoMode ? DEMO_SEVERE_SMOG_DATA : {
      city: profile.city,
      aqi: 145,
      category: 'Unhealthy for Sensitive',
      dominantPollutant: 'PM2.5',
      pollutants: { pm2_5: 58.2, pm10: 95.0, no2: 24.1, o3: 38.0 },
      timestamp: new Date().toISOString(),
      hourly24h: [
        { time: '06:00', aqi: 175, pm2_5: 78 },
        { time: '10:00', aqi: 155, pm2_5: 65 },
        { time: '14:00', aqi: 120, pm2_5: 48, isBestWindow: true },
        { time: '18:00', aqi: 165, pm2_5: 72 },
        { time: '22:00', aqi: 180, pm2_5: 82 },
      ],
      forecast48h: [],
      bestWindow: {
        startTime: '13:00',
        endTime: '15:00',
        estimatedAqi: 120,
        reason: 'Midday thermal dispersion provides lowest particulate density.',
      },
    }
  );

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Sync theme
  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('vayu_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('vayu_theme', 'light');
    }
  };

  // Sync language
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('vayu_lang', lang);
    document.documentElement.lang = lang;
  };

  // Fetch live air data
  const refreshAirData = async (force = false) => {
    if (isDemoMode) {
      setAirData(DEMO_SEVERE_SMOG_DATA);
      return;
    }
    setIsRefreshing(true);
    const data = await fetchLiveAirQuality(profile.city, profile.latitude, profile.longitude, force);
    setAirData(data);
    setIsRefreshing(false);
  };

  useEffect(() => {
    void refreshAirData();
  }, [profile.city, profile.latitude, profile.longitude, isDemoMode]);

  // Handle onboarding completion
  const handleOnboardingComplete = (newProfile: LifestyleProfile, newHousehold: HouseholdMember[]) => {
    setProfile(newProfile);
    setHousehold(newHousehold);
    setShowOnboarding(false);
    try {
      localStorage.setItem('vayu_profile', JSON.stringify(newProfile));
      localStorage.setItem('vayu_household', JSON.stringify(newHousehold));
      localStorage.setItem('vayu_onboarded', 'true');
    } catch {
      // Ignore
    }
  };

  // Wipe all data
  const handleEraseAllData = () => {
    if (window.confirm('Are you sure you want to erase all your saved cities, household members, and preferences from this device?')) {
      try {
        localStorage.clear();
        setProfile(DEFAULT_PROFILE);
        setHousehold(DEFAULT_HOUSEHOLD);
        setShowOnboarding(true);
        setActiveTab('dashboard');
        setIsKidMode(false);
        setIsDemoMode(false);
      } catch {
        // Ignore
      }
    }
  };

  // Speech Read Aloud handler
  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      const summaryText = `Vayu Air Report for ${airData.city}. Current AQI is ${airData.aqi}, rated as ${airData.category}. Dominant pollutant is ${airData.dominantPollutant}. The cleanest window to step outside is between ${airData.bestWindow?.startTime || '1 PM'} and ${airData.bestWindow?.endTime || '3 PM'}.`;
      speakText(summaryText, language);
      setIsSpeaking(true);
    }
  };

  // Derived rule engine outputs
  const dailyPlan = generateDailyPlan(airData, household, profile);
  const indoorHacks = generateIndoorLabHacks(airData, profile);
  const sustainableSwaps = generateSustainableSwaps(profile);

  const t = (path: string) => getTranslation(language, path);

  return (
    <div class="app-layout">
      {/* Top Header */}
      <header class="header">
        <div class="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          {/* Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ color: 'var(--c-blue-primary)', display: 'flex' }}>
              <WindIcon size={28} />
            </span>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
                Vayu <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--c-peach-primary)' }}>वायु</span>
              </h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{t('tagline')}</p>
            </div>
          </div>

          {/* Quick Action Toggles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            {/* Kid Mode Button */}
            <button
              type="button"
              onClick={() => setIsKidMode(!isKidMode)}
              class={isKidMode ? 'badge badge-peach' : 'badge badge-lavender'}
              style={{ cursor: 'pointer', padding: '0.35rem 0.65rem' }}
              aria-pressed={isKidMode}
            >
              {isKidMode ? '★ Kid Mode ON' : '🧒 Kid Mode'}
            </button>

            {/* Demo Smog Scenario Button */}
            <button
              type="button"
              onClick={() => setIsDemoMode(!isDemoMode)}
              class={isDemoMode ? 'badge badge-peach' : 'badge badge-blue'}
              style={{ cursor: 'pointer', padding: '0.35rem 0.65rem' }}
              aria-pressed={isDemoMode}
            >
              {isDemoMode ? '⚠️ Smog Demo Active' : '🧪 Demo Mode'}
            </button>

            {/* Speech Read Aloud Button */}
            {isSpeechSynthesisSupported() && (
              <button
                type="button"
                onClick={toggleSpeech}
                class="badge badge-blue"
                style={{ cursor: 'pointer', padding: '0.35rem 0.65rem' }}
                aria-label={isSpeaking ? 'Stop reading aloud' : 'Read air report aloud'}
              >
                <VolumeIcon size={14} />
                <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
              </button>
            )}

            {/* Language Selector */}
            <select
              aria-label="Select interface language"
              value={language}
              onChange={(e) => changeLanguage((e.target as HTMLSelectElement).value as Language)}
              style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '0.3rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-strong)',
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-main)',
                minHeight: '34px',
                minWidth: '70px',
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
            </select>

            {/* Dark / Light Mode Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              style={{
                padding: '0.4rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                minHeight: '36px',
                minWidth: '36px',
              }}
            >
              {isDark ? <SunIcon size={16} /> : <MoonIcon size={16} />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div class="container">
          <nav class="nav-tabs" aria-label="Main Application Sections">
            {[
              { id: 'dashboard' as const, label: t('nav.dashboard') },
              { id: 'shield' as const, label: t('nav.shield') },
              { id: 'dailyPlan' as const, label: t('nav.dailyPlan') },
              { id: 'indoorLab' as const, label: t('nav.indoorLab') },
              { id: 'swaps' as const, label: t('nav.swaps') },
              { id: 'simulator' as const, label: t('nav.simulator') },
              { id: 'askVayu' as const, label: t('nav.askVayu') },
              { id: 'trust' as const, label: t('nav.trust') },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                class={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" class="container" style={{ padding: '1.5rem 1rem 3rem 1rem' }}>
        {/* Kid Mode Mascot View */}
        {isKidMode && (
          <div style={{ marginBottom: '1.5rem' }}>
            <VayuBuddyKidView aqi={airData.aqi} />
          </div>
        )}

        {/* Active View Render */}
        {activeTab === 'dashboard' && (
          <LiveAirDashboard
            data={airData}
            onRefresh={() => refreshAirData(true)}
            onOpenLocationModal={() => setShowOnboarding(true)}
            isRefreshing={isRefreshing}
          />
        )}

        {activeTab === 'shield' && (
          <HealthShieldView
            household={household}
            currentAqi={airData.aqi}
            onEditHousehold={() => setShowOnboarding(true)}
          />
        )}

        {activeTab === 'dailyPlan' && (
          <DailyPlanView plan={dailyPlan} city={airData.city} aqi={airData.aqi} />
        )}

        {activeTab === 'indoorLab' && (
          <IndoorAirLabView hacks={indoorHacks} currentAqi={airData.aqi} />
        )}

        {activeTab === 'swaps' && <SustainableSwapsView swaps={sustainableSwaps} />}

        {activeTab === 'simulator' && <WhatIfSimulatorView currentAqi={airData.aqi} />}

        {activeTab === 'askVayu' && (
          <AskVayuChatView
            city={airData.city}
            aqi={airData.aqi}
            household={household}
            language={language}
          />
        )}

        {activeTab === 'trust' && <TrustPageView onEraseAllData={handleEraseAllData} />}
      </main>

      {/* Footer & Disclaimer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '2rem 1rem', backgroundColor: 'var(--bg-surface)' }}>
        <div class="container" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
          <p>
            <strong>Medical Disclaimer:</strong> Vayu provides evidence-informed environmental guidance for winter smog and air pollution. Vayu is not a medical device and is not a substitute for clinical diagnosis, personalized medical advice, or physician consultations.
          </p>
          <p>
            Vayu (वायु) • Lightweight Open Environmental Assistant • MIT License • Zero Analytics & No Tracking
          </p>
        </div>
      </footer>

      {/* Onboarding Dialog */}
      {showOnboarding && (
        <OnboardingModal
          initialProfile={profile}
          initialHousehold={household}
          onComplete={handleOnboardingComplete}
          onClose={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
}
