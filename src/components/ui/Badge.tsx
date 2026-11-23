import React, { HTMLAttributes } from 'react';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'accent' | 'outline';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'bg-vayu-surface-tint border-vayu-border text-vayu-text',
  primary: 'bg-vayu-primary/30 border-vayu-border text-vayu-text font-bold',
  secondary: 'bg-vayu-secondary/50 border-vayu-border-subtle text-vayu-text font-semibold',
  accent: 'bg-vayu-accent/40 border-vayu-accent text-vayu-accent-text font-bold',
  outline: 'bg-transparent border-vayu-border text-vayu-text font-medium',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  dot = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs tracking-wide transition-colors ${badgeVariants[variant]} ${className}`}
      {...props}
    >
      {dot && <span className="w-2 h-2 rounded-full bg-current shrink-0" aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
};

