import React, { HTMLAttributes } from 'react';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '', ...props }) => {
  const sizeClass = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2.5',
    lg: 'w-9 h-9 border-3',
  }[size];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-block border-vayu-primary border-t-transparent rounded-full animate-spin ${sizeClass} ${className}`}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

