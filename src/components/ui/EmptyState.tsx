import React, { ReactNode } from 'react';
import { Wind } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => {
  return (
    <div className="p-8 text-center bg-vayu-surface border border-vayu-border rounded-3xl space-y-4 max-w-md mx-auto shadow-md">
      <div className="w-14 h-14 rounded-2xl bg-vayu-surface-tint border border-vayu-border flex items-center justify-center mx-auto text-vayu-primary">
        {icon || <Wind className="w-7 h-7" aria-hidden="true" />}
      </div>
      <div>
        <h4 className="text-base font-bold text-vayu-text">{title}</h4>
        <p className="text-xs text-vayu-text-secondary mt-1 leading-relaxed">
          {description}
        </p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

