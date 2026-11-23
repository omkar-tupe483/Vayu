import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const DataFreshnessIndicator: React.FC<{ timestamp: string; isFetching?: boolean }> = ({
  timestamp,
  isFetching = false,
}) => {
  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-vayu-surface-tint border border-vayu-border-subtle text-xs text-vayu-text-secondary">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
        <span className="font-bold text-vayu-text">Data Freshness:</span>
        <span>Atmospheric projection valid for {formattedTime}</span>
      </div>

      <div className="flex items-center gap-3">
        {isFetching ? (
          <span className="flex items-center gap-1 text-vayu-accent-link font-bold">
            <Sparkles className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
            <span>Updating...</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Live Sync Active</span>
          </span>
        )}
      </div>
    </div>
  );
};
