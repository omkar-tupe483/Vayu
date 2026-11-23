import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try Again',
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`p-6 sm:p-8 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-center flex flex-col items-center space-y-3 ${className}`}
    >
      <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-600 dark:text-rose-400" aria-hidden="true">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h4 className="text-base sm:text-lg font-black text-rose-700 dark:text-rose-300">
        {title}
      </h4>
      <p className="text-xs sm:text-sm text-rose-800 dark:text-rose-200 max-w-md leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-4 h-4" aria-hidden="true" />}
          >
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

