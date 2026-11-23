import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/useTheme';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`p-2 rounded-2xl bg-vayu-surface border border-vayu-border text-vayu-text hover:bg-vayu-surface-tint focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring transition-all ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-300" aria-hidden="true" />
      ) : (
        <Moon className="w-4 h-4 text-vayu-text" aria-hidden="true" />
      )}
    </button>
  );
};

