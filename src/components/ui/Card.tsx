import React, { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'tinted' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-vayu-surface border border-vayu-border',
    tinted: 'bg-vayu-surface-tint border border-vayu-border',
    elevated: 'bg-vayu-surface-elevated border border-vayu-border shadow-xl',
  }[variant];

  return (
    <div className={`rounded-3xl p-5 sm:p-6 transition-all ${variantStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => (
  <div className={`pb-3 border-b border-vayu-border-subtle mb-4 ${className}`} {...props} />
);

export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({ className = '', ...props }) => (
  <h3 className={`text-lg sm:text-xl font-black text-vayu-text tracking-tight ${className}`} {...props} />
);

export const CardDescription: React.FC<HTMLAttributes<HTMLParagraphElement>> = ({ className = '', ...props }) => (
  <p className={`text-xs sm:text-sm text-vayu-text-secondary mt-1 ${className}`} {...props} />
);

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => (
  <div className={`space-y-4 ${className}`} {...props} />
);

export const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => (
  <div className={`pt-4 border-t border-vayu-border-subtle mt-4 flex items-center justify-between ${className}`} {...props} />
);

