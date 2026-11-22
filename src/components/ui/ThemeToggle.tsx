import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDark,
  onToggle,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      className={`p-2 rounded-xl bg-vayu-surface border border-vayu-border text-vayu-text hover:bg-vayu-surface-tint transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-vayu-focus-ring ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-vayu-accent" aria-hidden="true" />
      ) : (
        <Moon className="w-4 h-4 text-vayu-text" aria-hidden="true" />
      )}
    </button>
  );
};
