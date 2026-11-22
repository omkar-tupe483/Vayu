import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const sizeMap = {
  sm: { icon: 24, text: 'text-base' },
  md: { icon: 32, text: 'text-xl' },
  lg: { icon: 40, text: 'text-2xl' },
  xl: { icon: 48, text: 'text-3xl' },
};

/**
 * Logo component with an elegant, simple wind/air-swirl motif
 */
export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const { icon, text } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Wind / Air-swirl SVG Icon */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform hover:rotate-6 motion-reduce:transform-none"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="23" className="fill-vayu-surface-tint stroke-vayu-border" strokeWidth="2" />
        {/* Upper Wind Stream */}
        <path
          d="M12 18C18 18 28 17 32 15C34.5 13.5 33 10 30 10C27 10 26 12 28 14"
          className="stroke-vayu-primary"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Middle Main Wind Stream */}
        <path
          d="M10 24C20 24 33 23 37 21C40 19.5 39 16 36 16C33 16 32 18 34 20"
          className="stroke-vayu-accent"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Lower Gentle Breeze Stream */}
        <path
          d="M14 30C22 30 31 31 34 33C36 34.5 35 37 32.5 37C30 37 29.5 35 31 33.5"
          className="stroke-vayu-primary"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-black tracking-tight text-vayu-text ${text}`}>
            Vayu
          </span>
          <span className="text-[10px] font-semibold text-vayu-text-secondary tracking-wider uppercase">
            वायु • वायू
          </span>
        </div>
      )}
    </div>
  );
};
