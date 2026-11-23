import React from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from '../../contexts/LanguageContext';
import { Activity, Compass, HeartPulse, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  const { t } = useTranslation();

  const navLinks = [
    { to: '/app', label: t('nav.dashboard'), icon: Activity },
    { to: '/routes', label: t('nav.routes'), icon: Compass },
    { to: '/health', label: t('nav.health'), icon: HeartPulse },
    { to: '/settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-vayu-surface/85 backdrop-blur-md border-b border-vayu-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-vayu-focus-ring rounded-2xl p-1"
          aria-label="Vayu Home"
        >
          <Logo size="md" />
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-vayu-focus-ring ${
                    isActive
                      ? 'bg-vayu-accent text-vayu-btn-text shadow-sm'
                      : 'text-vayu-text-secondary hover:text-vayu-text hover:bg-vayu-surface-tint'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right Controls: Theme & Language */}
        <div className="flex items-center gap-2.5">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
