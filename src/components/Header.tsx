import React from 'react';
import { Wind } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-teal-500/20">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Vayu
            </h1>
            <p className="text-xs text-slate-400">Urban Air Quality Assistant</p>
          </div>
        </div>
        <div className="hidden sm:inline-flex text-xs font-medium px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-teal-400">
          Know your air. Breathe smarter.
        </div>
      </div>
    </header>
  );
};

