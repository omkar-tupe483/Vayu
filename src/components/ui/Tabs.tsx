import React, { createContext, useContext, ReactNode, useState, useId } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (val: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (val: string) => void;
  children: ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value,
  onValueChange,
  children,
  className = '',
}) => {
  const [uncontrolledTab, setUncontrolledTab] = useState(defaultValue);
  const baseId = useId();

  const activeTab = value !== undefined ? value : uncontrolledTab;
  const setActiveTab = (newTab: string) => {
    if (value === undefined) {
      setUncontrolledTab(newTab);
    }
    onValueChange?.(newTab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, baseId }}>
      <div className={`w-full space-y-4 ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabList: React.FC<{ children: ReactNode; className?: string; 'aria-label': string }> = ({
  children,
  className = '',
  'aria-label': ariaLabel,
}) => (
  <div
    role="tablist"
    aria-label={ariaLabel}
    className={`inline-flex items-center gap-1.5 p-1.5 bg-vayu-surface-tint border border-vayu-border rounded-2xl ${className}`}
  >
    {children}
  </div>
);

export const Tab: React.FC<{ value: string; children: ReactNode; className?: string }> = ({
  value,
  children,
  className = '',
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');

  const isSelected = context.activeTab === value;

  return (
    <button
      role="tab"
      id={`${context.baseId}-tab-${value}`}
      aria-controls={`${context.baseId}-panel-${value}`}
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      type="button"
      onClick={() => context.setActiveTab(value)}
      className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-vayu-focus-ring ${
        isSelected
          ? 'bg-vayu-accent text-vayu-accent-text shadow-sm'
          : 'text-vayu-text-secondary hover:text-vayu-text hover:bg-vayu-surface'
      } ${className}`}
    >
      {children}
    </button>
  );
};

export const TabPanel: React.FC<{ value: string; children: ReactNode; className?: string }> = ({
  value,
  children,
  className = '',
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within Tabs');

  const isSelected = context.activeTab === value;
  if (!isSelected) return null;

  return (
    <div
      role="tabpanel"
      id={`${context.baseId}-panel-${value}`}
      aria-labelledby={`${context.baseId}-tab-${value}`}
      tabIndex={0}
      className={`focus:outline-none ${className}`}
    >
      {children}
    </div>
  );
};
