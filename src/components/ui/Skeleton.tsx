import React, { HTMLAttributes } from 'react';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-vayu-border/30 dark:bg-vayu-border/20 rounded-2xl ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
};
