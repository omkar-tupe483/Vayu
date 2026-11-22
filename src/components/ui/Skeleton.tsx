import React, { HTMLAttributes } from 'react';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'rounded';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rounded',
  className = '',
  ...props
}) => {
  const variantClass =
    variant === 'circular'
      ? 'rounded-full'
      : variant === 'rectangular'
      ? 'rounded-none'
      : 'rounded-2xl';

  return (
    <div
      role="status"
      aria-label="Loading content..."
      className={`bg-vayu-surface-tint border border-vayu-border-subtle animate-pulse ${variantClass} ${className}`}
      {...props}
    />
  );
};

