import React from 'react';
import { Wind } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl bg-vayu-surface-tint border border-vayu-border-subtle space-y-3 ${className}`}
    >
      <div className="p-3.5 rounded-2xl bg-vayu-primary/20 text-vayu-text mb-1" aria-hidden="true">
        {icon || <Wind className="w-8 h-8" />}
      </div>
      <h4 className="text-base sm:text-lg font-black text-vayu-text">{title}</h4>
      {description && (
        <p className="text-xs sm:text-sm text-vayu-text-secondary max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
