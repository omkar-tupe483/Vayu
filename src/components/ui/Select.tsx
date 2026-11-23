import { forwardRef, SelectHTMLAttributes } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, children, className = '', ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-bold uppercase tracking-wider text-vayu-text-secondary">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full py-2.5 px-4 rounded-2xl bg-vayu-surface text-vayu-text border border-vayu-border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring cursor-pointer ${
            error ? 'border-rose-500' : 'hover:border-vayu-primary'
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

