import React, { useState, ReactNode, useId } from 'react';

export interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();

  const posClass =
    position === 'top'
      ? 'bottom-full left-1/2 -translate-x-1/2 mb-2'
      : 'top-full left-1/2 -translate-x-1/2 mt-2';

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      <div aria-describedby={isVisible ? tooltipId : undefined}>{children}</div>
      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`absolute ${posClass} z-50 px-3 py-1.5 text-xs font-semibold bg-vayu-surface-elevated text-vayu-text border border-vayu-border rounded-xl shadow-xl whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150`}
        >
          {content}
        </div>
      )}
    </div>
  );
};
