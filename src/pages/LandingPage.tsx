import React, { useState, lazy, Suspense } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/useTheme';
import { useAirQuality } from '../hooks/useAirQuality';
import { DEFAULT_CITY } from '../constants/cities';
import { AQI_CATEGORIES, getAqiCategory } from '../constants/aqi';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

const AirQualityMap = lazy(() => import('../components/map/AirQualityMap'));
import {
  Activity,
  Compass,
  HeartPulse,
  ArrowRight,
  ShieldCheck,
  Wind,
  Sparkles,
  MapPin,
  Bot,
  Layers,
  ChevronDown,
  Baby,
  User,
  Car,
  Clock,
  HelpCircle,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  // Live Pune Preview Data
  const { data: puneData, isLoading: isPuneLoading } = useAirQuality(DEFAULT_CITY);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const puneCategory = puneData ? getAqiCategory(puneData.us_aqi) : null;
  const puneStyle = puneCategory ? (isDark ? puneCategory.dark : puneCategory.light) : null;

  const faqs = [
    {
      q: 'Where does the air quality data come from?',
      a: 'All atmospheric and pollutant metrics are modelled estimates provided by Open-Meteo. These are high-resolution numerical atmospheric simulations combining satellite and ground assimilation models, honest and transparent without claiming to be direct ground sensors.',
    },
    {
      q: 'How does WebLLM run without a backend server or API key?',
      a: 'Vayu utilizes WebLLM to run language models directly on your device via client-side WebGPU acceleration. When you enable AI, model weights run 100% locally inside your browser memory with zero network API roundtrips and zero telemetry tracking.',
    },
    {
      q: 'Can I trust the health advice?',
      a: 'Health guidelines in Vayu are rule-based, designed from standard WHO and EPA air quality health advisories tailored to physiological vulnerability tiers (runners, elderly, children, asthma). It provides general wellness guidance only and never provides clinical medical diagnosis or prescriptions.',
    },
    {
      q: 'Is Vayu free and private?',
      a: 'Yes, Vayu is completely free, open-source under the MIT license, and frontend-only. There are no databases, accounts, logins, cookies, or remote tracking. All your preferences and saved locations stay strictly in your browser localStorage.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-8">
      {/* Hero Section with Air-Swirl & Live Pune Preview */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-12 lg:p-16 border border-vayu-border bg-gradient-to-br from-vayu-surface via-vayu-surface-tint to-vayu-primary/20 shadow-xl">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-vayu-accent/30 border border-vayu-accent text-xs font-black text-vayu-text">
              <Wind className="w-3.5 h-3.5 text-vayu-text" aria-hidden="true" />
              <span>Know your air. Breathe smarter.</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-vayu-text tracking-tight leading-tight">
              Know your air.{' '}
              <span className="text-vayu-accent-link underline decoration-vayu-accent decoration-wavy decoration-2">
                Breathe smarter.
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-vayu-text-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Vayu is your frontend-only urban atmospheric copilot: live AQI monitoring, 24-hour predictive forecast windows, cleanest route navigation, and private in-browser AI guidance.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <NavLink to="/app">
                <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  {t('landing.ctaExplore')}
                </Button>
              </NavLink>
              <NavLink to="/routes">
                <Button size="lg" variant="outline" leftIcon={<Compass className="w-4 h-4" />}>
                  Clean Routes
                </Button>
              </NavLink>
            </div>
          </div>

          {/* Right Side: Air Swirl SVG + Live Pune Preview Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
            {/* Animated Wind Swirl SVG Graphic */}
            <div className="relative flex items-center justify-center w-40 h-40 sm:w-48 sm:h-48">
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full text-vayu-primary animate-pulse"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="3" strokeDasharray="6 8" opacity="0.4" />
                <path
                  d="M30 100 C 60 70, 90 70, 120 100 S 170 130, 190 100"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path
                  d="M40 75 C 70 50, 100 50, 130 75 S 165 95, 180 80"
                  stroke="#FFCBA4"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M50 125 C 80 145, 110 145, 140 125 S 165 110, 175 120"
                  stroke="#E6E6FA"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Live Pune AQI Mini Preview Card */}
            <NavLink
              to="/app"
              className="w-full max-w-sm p-4 sm:p-5 rounded-3xl bg-vayu-surface-elevated/90 backdrop-blur-md border border-vayu-border shadow-2xl hover:scale-[1.02] transition-transform block"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-vayu-text-secondary">
                  <MapPin className="w-3.5 h-3.5 text-vayu-accent" aria-hidden="true" />
                  <span>Pune, Maharashtra (Live)</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-vayu-text-secondary">
                  Modelled Estimate
                </span>
              </div>

              {isPuneLoading ? (
                <div className="h-12 w-full animate-pulse bg-vayu-surface-tint rounded-xl" />
              ) : puneData && puneStyle && puneCategory ? (
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-3xl sm:text-4xl font-black font-mono text-vayu-text">
                      {puneData.us_aqi}
                    </span>
                    <span className="text-xs text-vayu-text-secondary ml-1.5 font-bold">US AQI</span>
                  </div>

                  <span
                    style={{
                      backgroundColor: puneStyle.bg,
                      borderColor: puneStyle.border,
                      color: puneStyle.text,
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border"
                  >
                    <span style={{ backgroundColor: puneStyle.dot }} className="w-2 h-2 rounded-full" />
                    <span>{t(puneCategory.translationKey)}</span>
                  </span>
                </div>
              ) : (
                <span className="text-xs text-vayu-text-secondary">Live data preview available in Dashboard</span>
              )}
            </NavLink>
          </div>
        </div>
      </section>

      {/* Live Interactive Air Quality Map Preview */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-vayu-border-subtle">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-vayu-accent/20 text-vayu-accent-link">
              <MapPin className="w-5 h-5 text-vayu-accent" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-vayu-text">
                Live Interactive Air Quality Map
              </h2>
              <p className="text-xs sm:text-sm text-vayu-text-secondary">
                Explore atmospheric indices and live pollutant concentrations across urban regions
              </p>
            </div>
          </div>

          <NavLink to="/app" className="inline-flex items-center gap-1.5 text-xs font-bold text-vayu-accent-link hover:underline">
            <span>Open Full Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>

        {puneData ? (
          <Suspense fallback={<Skeleton className="h-[360px] sm:h-[440px] w-full rounded-3xl" />}>
            <AirQualityMap data={puneData} />
          </Suspense>
        ) : (
          <Skeleton className="h-[360px] sm:h-[440px] w-full rounded-3xl" />
        )}
      </section>

      {/* How Vayu Works (Track, Plan, Protect) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-vayu-text">How Vayu Works</h2>
          <p className="text-xs sm:text-sm text-vayu-text-secondary">
            Three simple steps to safeguard your respiratory health in the modern urban environment
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <Card variant="elevated">
            <CardHeader>
              <div className="w-10 h-10 rounded-2xl bg-vayu-primary/30 text-vayu-text flex items-center justify-center font-black text-base mb-2">
                1
              </div>
              <CardTitle>Track Atmospheric Pulse</CardTitle>
              <CardDescription>
                Search any city globally or geolocate your position. Receive live estimates for PM2.5, PM10, Ozone, and NO2 without requiring ground stations.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <div className="w-10 h-10 rounded-2xl bg-vayu-accent/40 text-vayu-text flex items-center justify-center font-black text-base mb-2">
                2
              </div>
              <CardTitle>Plan Cleanest Windows</CardTitle>
              <CardDescription>
                Inspect 24-hour predictive trendlines and let Vayu compute your optimal outdoor workout window or navigate cleanest transit routes with lower exposure.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <div className="w-10 h-10 rounded-2xl bg-vayu-secondary/50 text-vayu-text flex items-center justify-center font-black text-base mb-2">
                3
              </div>
              <CardTitle>Protect Your Airway</CardTitle>
              <CardDescription>
                Tailored health rules for kids, elderly, and runners. Actionable N95 respirator advice with transparent limitations and prompt emergency warnings.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* 6-Core Feature Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-vayu-text">Engineered for Urban Living</h2>
          <p className="text-xs sm:text-sm text-vayu-text-secondary">
            Comprehensive atmospheric intelligence running 100% client-side in your web browser
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl bg-vayu-surface-elevated border border-vayu-border space-y-3">
            <div className="p-3 rounded-2xl bg-vayu-primary/20 text-vayu-text w-fit">
              <Activity className="w-6 h-6 text-vayu-primary" />
            </div>
            <h4 className="text-base font-black text-vayu-text">Real-Time AQI & Pollutants</h4>
            <p className="text-xs text-vayu-text-secondary leading-relaxed">
              Zod-validated Open-Meteo current conditions across 6 primary pollutants with clear health impact definitions.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-vayu-surface-elevated border border-vayu-border space-y-3">
            <div className="p-3 rounded-2xl bg-vayu-accent/20 text-vayu-text w-fit">
              <Clock className="w-6 h-6 text-vayu-accent" />
            </div>
            <h4 className="text-base font-black text-vayu-text">24-Hour Predictive Forecast</h4>
            <p className="text-xs text-vayu-text-secondary leading-relaxed">
              Pure hand-written SVG interactive chart and timeline strip calculating the best continuous safe outdoor window.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-vayu-surface-elevated border border-vayu-border space-y-3">
            <div className="p-3 rounded-2xl bg-vayu-secondary/30 text-vayu-text w-fit">
              <Compass className="w-6 h-6 text-vayu-secondary" />
            </div>
            <h4 className="text-base font-black text-vayu-text">Cleanest Route Navigator</h4>
            <p className="text-xs text-vayu-text-secondary leading-relaxed">
              Public OSRM routing with distance-weighted exposure analysis comparing highway corridors vs greenway paths.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-vayu-surface-elevated border border-vayu-border space-y-3">
            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-600 dark:text-purple-300 w-fit">
              <Bot className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-vayu-text">In-Browser AI (WebLLM)</h4>
            <p className="text-xs text-vayu-text-secondary leading-relaxed">
              Client-side WebGPU local AI model execution with an instant multilingual rule engine fallback in Hindi and Marathi.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-vayu-surface-elevated border border-vayu-border space-y-3">
            <div className="p-3 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 w-fit">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-vayu-text">Personalized Health Advisor</h4>
            <p className="text-xs text-vayu-text-secondary leading-relaxed">
              Five sensitivity profiles, N95 respirator advice with stated limits, ventilation tips, and emergency alerts.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-vayu-surface-elevated border border-vayu-border space-y-3">
            <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 w-fit">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-vayu-text">Saved Locations & Alerts</h4>
            <p className="text-xs text-vayu-text-secondary leading-relaxed">
              Quick city chips, custom threshold sliders, Web Notification triggers, and reduce-motion accessibility.
            </p>
          </div>
        </div>
      </section>

      {/* Persona Showcase */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-vayu-text">Tailored for Every City Resident</h2>
          <p className="text-xs sm:text-sm text-vayu-text-secondary">
            Because a 120 AQI affects a marathon runner differently than a child or senior
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-vayu-surface border border-vayu-border space-y-2.5">
            <div className="p-2.5 rounded-2xl bg-vayu-accent/20 text-vayu-accent-link w-fit">
              <Activity className="w-5 h-5 text-vayu-accent" />
            </div>
            <h4 className="text-sm font-black text-vayu-text">Endurance Runners</h4>
            <p className="text-xs text-vayu-text-secondary leading-relaxed">
              High ventilation rates multiply PM2.5 inhalation. Vayu highlights safe early-morning tempo windows and warns when to use the treadmill.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-vayu-surface border border-vayu-border space-y-2.5">
            <div className="p-2.5 rounded-2xl bg-vayu-primary/20 text-vayu-text w-fit">
              <Baby className="w-5 h-5 text-vayu-primary" />
            </div>
            <h4 className="text-sm font-black text-vayu-text">Parents & Kids</h4>
            <p className="text-xs text-vayu-text-secondary leading-relaxed">
              Children breathe faster and have developing airways. Know when outdoor playground recess is healthy or when to move games indoors.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-vayu-surface border border-vayu-border space-y-2.5">
            <div className="p-2.5 rounded-2xl bg-vayu-secondary/30 text-vayu-text w-fit">
              <User className="w-5 h-5 text-vayu-secondary" />
            </div>
            <h4 className="text-sm font-black text-vayu-text">Seniors & Heart Health</h4>
            <p className="text-xs text-vayu-text-secondary leading-relaxed">
              Air pollution triggers cardiopulmonary strain. Timely alerts help seniors pace morning strolls and ensure HEPA air cleaning.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-vayu-surface border border-vayu-border space-y-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 w-fit">
              <Car className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-vayu-text">Urban Commuters</h4>
            <p className="text-xs text-vayu-text-secondary leading-relaxed">
              Avoid toxic tailpipe corridors. Choose the cleanest pedestrian or cycling commute route with up to 30% lower particulate exposure.
            </p>
          </div>
        </div>
      </section>

      {/* Standard AQI Scale Tiers Reference */}
      <section>
        <Card variant="tinted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-vayu-primary" aria-hidden="true" />
              <span>{t('landing.aqiTiersTitle')}</span>
            </CardTitle>
            <CardDescription>{t('landing.aqiTiersSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {AQI_CATEGORIES.map((cat) => {
                const style = isDark ? cat.dark : cat.light;
                return (
                  <div
                    key={cat.level}
                    style={{
                      backgroundColor: style.bg,
                      borderColor: style.border,
                      color: style.text,
                    }}
                    className="p-3.5 rounded-2xl border flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        style={{ backgroundColor: style.dot }}
                        className="w-3 h-3 rounded-full shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-xs sm:text-sm font-bold">
                        {t(cat.translationKey)}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-black opacity-80">
                      {cat.min} - {cat.max}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Accordion Section */}
      <section className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vayu-surface border border-vayu-border text-xs font-bold text-vayu-text-secondary">
            <HelpCircle className="w-3.5 h-3.5 text-vayu-primary" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-vayu-text">Clear Answers & Transparency</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-vayu-border bg-vayu-surface-elevated overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-vayu-text focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-vayu-text-secondary shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-vayu-text-secondary leading-relaxed border-t border-vayu-border-subtle">
                    <p className="mt-2 font-medium">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-vayu-primary/10 via-vayu-surface to-vayu-accent/15 border border-vayu-border space-y-4">
        <div className="inline-flex p-3 rounded-2xl bg-vayu-accent/20 text-vayu-accent-link">
          <Sparkles className="w-6 h-6 text-vayu-accent" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-vayu-text">Start Breathing Smarter Today</h3>
        <p className="text-xs sm:text-sm text-vayu-text-secondary max-w-md mx-auto">
          Explore real-time air quality, forecast trends, and customized sensitivity recommendations for your city.
        </p>
        <div className="pt-2">
          <NavLink to="/app">
            <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Open Vayu Dashboard
            </Button>
          </NavLink>
        </div>
      </section>
    </div>
  );
};
