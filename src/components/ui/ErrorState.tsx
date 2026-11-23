import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Data',
  message,
  onRetry,
  retryLabel = 'Try Again',
}) => {
  return (
    <div
      role="alert"
      className="p-6 md:p-8 text-center bg-vayu-surface border border-rose-300 dark:border-rose-900 rounded-3xl space-y-4 max-w-md mx-auto shadow-xl"
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
        <AlertTriangle className="w-6 h-6" aria-hidden="true" />
      </div>
      <div>
        <h4 className="text-base font-bold text-vayu-text">{title}</h4>
        <p className="text-xs text-vayu-text-secondary mt-1 leading-relaxed">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button
          variant="primary"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-4 h-4" aria-hidden="true" />}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

