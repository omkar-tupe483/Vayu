import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import { Wind, Globe, ShieldAlert } from 'lucide-react';
import { Language } from '../../i18n/types';

export const Header: React.FC = () => {
  const { t, language, setLanguage, languages } = useTranslation();
  const location = useLocation();

  const navLinks = [
    { path: '/', labelKey: 'nav.home' },
    { path: '/health', labelKey: 'nav.health' },
    { path: '/about', labelKey: 'nav.about' },
  ];

  return (
    <>
      {/* Skip to Main Content Link for Screen Readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-50 px-4 py-2 bg-teal-500 text-slate-950 font-bold rounded-lg shadow-2xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        {t('nav.skipToContent')}
      </a>

      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-xl p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform motion-reduce:transform-none">
              <Wind className="w-5 h-5 text-slate-950 stroke-[2.5]" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">{t('brand.name')}</span>
                <span className="hidden sm:inline text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300">
                  {t('brand.subtitle')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">{t('brand.tagline')}</p>
            </div>
          </Link>

          {/* Navigation & Language Controls */}
          <div className="flex items-center gap-3 md:gap-6">
            <nav aria-label={t('nav.home')} className="flex items-center gap-1 sm:gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                      isActive
                        ? 'bg-slate-800 text-teal-300 border border-slate-700/80'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    {t(link.labelKey)}
                  </Link>
                );
              })}
            </nav>

            {/* Language Switcher */}
            <div className="relative flex items-center gap-1.5 pl-2 border-l border-slate-800">
              <Globe className="w-4 h-4 text-teal-400 shrink-0" aria-hidden="true" />
              <label htmlFor="language-select" className="sr-only">
                {t('nav.selectLanguage')}
              </label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-slate-900 border border-slate-700/80 text-slate-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-100">
                    {lang.nativeLabel}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Global Notice Bar: Modelled Estimates & General Guidance */}
        <div className="bg-slate-900/60 border-t border-slate-800/60 px-4 py-1.5 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-teal-400 shrink-0" aria-hidden="true" />
            <span>{t('disclaimer.modelled')}</span>
          </p>
        </div>
      </header>
    </>
  );
};

