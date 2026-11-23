import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'primary-blue' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  // Peach accent for primary buttons (navy text for 6.8:1+ WCAG AA contrast)
  primary:
    'bg-vayu-accent text-vayu-accent-text hover:bg-vayu-accent-hover font-bold shadow-md shadow-vayu-accent/20 active:scale-[0.98]',
  // Soft lavender secondary
  secondary:
    'bg-vayu-secondary text-vayu-text hover:bg-vayu-secondary-hover font-semibold border border-vayu-border-subtle active:scale-[0.98]',
  // Powder blue primary
  'primary-blue':
    'bg-vayu-primary text-vayu-text hover:bg-vayu-primary-hover font-bold border border-vayu-border active:scale-[0.98]',
  // Outline
  outline:
    'bg-transparent text-vayu-text hover:bg-vayu-surface-tint border border-vayu-border font-semibold active:scale-[0.98]',
  // Ghost
  ghost:
    'bg-transparent text-vayu-text hover:bg-vayu-surface-tint font-medium',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-2xl gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-vayu-focus-ring disabled:opacity-50 disabled:cursor-not-allowed motion-reduce:transform-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
