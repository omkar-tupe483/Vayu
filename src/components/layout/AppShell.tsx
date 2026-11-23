import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../contexts/LanguageContext';
import { ShieldCheck, Info } from 'lucide-react';

export interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: t('nav.home') || 'Landing' },
    { path: '/app', label: t('nav.dashboard') || 'Dashboard' },
    { path: '/settings', label: t('nav.settings') || 'Settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-vayu-bg text-vayu-text">
      {/* Skip to Main Content Link for Screen Readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-50 px-4 py-2 bg-vayu-accent text-vayu-accent-text font-bold rounded-xl shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-vayu-focus-ring"
      >
        {t('nav.skipToContent')}
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-vayu-border-subtle bg-vayu-surface/90 backdrop-blur-md transition-colors">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-vayu-focus-ring rounded-xl p-1 shrink-0"
            aria-label="Vayu Home"
          >
            <Logo size="md" />
          </Link>

          {/* Nav & Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4">
            <nav aria-label="Main Navigation" className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-vayu-focus-ring ${
                      isActive
                        ? 'bg-vayu-surface-tint text-vayu-text border border-vayu-border shadow-sm'
                        : 'text-vayu-text-secondary hover:text-vayu-text hover:bg-vayu-surface-tint'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2 border-l border-vayu-border-subtle">
              <LanguageSelector />
              <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-vayu-border-subtle bg-vayu-surface py-8 px-4 text-center space-y-4 transition-colors">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="p-4 rounded-3xl bg-vayu-surface-tint border border-vayu-border text-xs text-vayu-text-secondary text-left space-y-2">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-vayu-primary shrink-0 mt-0.5" aria-hidden="true" />
              <span>{t('disclaimer.modelled')}</span>
            </div>
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-vayu-accent shrink-0 mt-0.5" aria-hidden="true" />
              <span>{t('disclaimer.health')}</span>
            </div>
          </div>

          <p className="text-xs text-vayu-text-secondary">
            {t('brand.name')} — {t('brand.tagline')} &copy; {new Date().getFullYear()}
          </p>

          <p className="text-[11px] text-vayu-text-secondary/80">
            {t('footer.poweredBy')}
          </p>
        </div>
      </footer>
    </div>
  );
};
