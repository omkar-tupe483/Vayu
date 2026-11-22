import React from 'react';
import { Header } from './components/Header';
import { AQICard } from './components/AQICard';
import { useAirQuality } from './hooks/useAirQuality';
import { Wind, ShieldCheck, HeartPulse, Bell } from 'lucide-react';

export const App: React.FC = () => {
  const { city, setCity, data, loading, refresh } = useAirQuality('Delhi');

  const cities = ['Delhi', 'Mumbai', 'Bengaluru', 'Kolkata', 'Chennai'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-semibold">
            <Wind className="w-3.5 h-3.5" />
            Vayu • Urban Air Quality Assistant
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Know your air. <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Breathe smarter.</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Real-time urban air quality insights, pollutant tracking, and actionable health advisories for you and your family.
          </p>

          {/* City Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {cities.map((c) => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  city === c
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Content */}
        {data && <AQICard data={data} loading={loading} onRefresh={refresh} />}

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-5 pt-4">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
            <HeartPulse className="w-6 h-6 text-teal-400" />
            <h3 className="font-semibold text-white">Smart Health Advisories</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Personalized guidance based on real-time AQI thresholds for sensitive individuals, runners, and daily commuters.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <h3 className="font-semibold text-white">Pollutant Breakdown</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track particulate matter (PM2.5, PM10) alongside toxic pollutants like NO2, SO2, and Carbon Monoxide.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
            <Bell className="w-6 h-6 text-emerald-400" />
            <h3 className="font-semibold text-white">Live Alerts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Actionable safety alerts whenever ambient air shifts into unhealthy or hazardous zones in your neighborhood.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>Vayu — Know your air. Breathe smarter. &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;
