import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  ariaLabel = 'Navigation tabs',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    }

    if (nextIndex !== index) {
      const nextTab = tabs[nextIndex]?.id;
      if (nextTab) {
        onChange(nextTab);
        const nextButton = document.getElementById(`tab-btn-${nextTab}`);
        nextButton?.focus();
      }
    }
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`flex items-center gap-1.5 p-1 rounded-2xl bg-vayu-surface border border-vayu-border ${className}`}
    >
      {tabs.map((tab, idx) => {
        const isSelected = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`tab-btn-${tab.id}`}
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring ${
              isSelected
                ? 'bg-vayu-accent text-vayu-btn-text shadow-sm'
                : 'text-vayu-text-secondary hover:text-vayu-text hover:bg-vayu-surface-tint'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
