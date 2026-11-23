import React from 'react';

export interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
}) => {
  const iconSize = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  const textSize = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Hand-written SVG air-swirl / wind icon */}
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSize} shrink-0`}
        aria-hidden="true"
      >
        <circle cx="16" cy="16" r="15" fill="var(--vayu-primary)" fillOpacity="0.25" stroke="var(--vayu-primary)" strokeWidth="1.5" />
        <path
          d="M6 14C10 14 13 11 16 11C19 11 21 13 21 15C21 17 19.5 18 18 18C16.5 18 15.5 17 15.5 15.5"
          stroke="var(--vayu-text)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 19C11 19 14 17 17 17C20.5 17 23 18.5 23 20.5C23 22 21.5 23 20 23C18.5 23 17.5 22 17.5 20.5"
          stroke="var(--vayu-accent)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 9C12 9 14.5 8 16.5 8C19 8 20.5 9 20.5 10.5C20.5 11.8 19.5 12.5 18.5 12.5"
          stroke="var(--vayu-primary)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <span className={`font-black tracking-tight text-vayu-text ${textSize}`}>
          Vayu
        </span>
      )}
    </div>
  );
};

