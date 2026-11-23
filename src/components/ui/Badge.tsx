import React, { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'accent' | 'outline' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  }[size];

  const variantStyles = {
    default: 'bg-vayu-surface-tint text-vayu-text border border-vayu-border',
    primary: 'bg-vayu-primary/30 text-vayu-text border border-vayu-primary',
    accent: 'bg-vayu-accent text-vayu-btn-text border border-vayu-accent',
    outline: 'bg-transparent text-vayu-text border border-vayu-border',
    success: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-full select-none ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
