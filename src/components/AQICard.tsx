import React from 'react';
import { AirQualityData } from '../types/airQuality';
import { getAQIStatus } from '../utils/aqiUtils';
import { ShieldAlert, RefreshCw, Activity, MapPin } from 'lucide-react';

interface AQICardProps {
  data: AirQualityData;
  loading: boolean;
  onRefresh: () => void;
}

export const AQICard: React.FC<AQICardProps> = ({ data, loading, onRefresh }) => {
  const { status, colorClass, badgeBg, recommendation } = getAQIStatus(data.aqi);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-slate-300">
          <MapPin className="w-4 h-4 text-teal-400" />
          <span className="font-semibold text-white">{data.city}</span>
          <span className="text-xs text-slate-500">Updated {data.lastUpdated}</span>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-50"
          title="Refresh AQI"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Air Quality Index</span>
          <div className="flex items-baseline gap-3 mt-2">
            <span className={`text-6xl md:text-7xl font-black ${colorClass}`}>{data.aqi}</span>
            <span className={`text-xs md:text-sm font-semibold px-3 py-1 rounded-full border ${badgeBg}`}>
              {status}
            </span>
          </div>
          <p className="mt-4 text-sm text-slate-300 flex items-start gap-2 bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
            <ShieldAlert className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />
            <span>{recommendation}</span>
          </p>
        </div>

        <div className="bg-slate-950/70 rounded-xl p-5 border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            <Activity className="w-4 h-4 text-teal-400" />
            Pollutant Concentrations (&mu;g/m&sup3;)
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">PM2.5</div>
              <div className="text-base font-bold text-slate-100 mt-1">{data.pollutants.pm25}</div>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">PM10</div>
              <div className="text-base font-bold text-slate-100 mt-1">{data.pollutants.pm10}</div>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">NO2</div>
              <div className="text-base font-bold text-slate-100 mt-1">{data.pollutants.no2}</div>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">SO2</div>
              <div className="text-base font-bold text-slate-100 mt-1">{data.pollutants.so2}</div>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">O3</div>
              <div className="text-base font-bold text-slate-100 mt-1">{data.pollutants.o3}</div>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">CO (ppm)</div>
              <div className="text-base font-bold text-slate-100 mt-1">{data.pollutants.co}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

