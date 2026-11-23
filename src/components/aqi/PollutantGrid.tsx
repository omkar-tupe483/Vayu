import React from 'react';
import { CleanAirQualityModel } from '../../schemas/airQualitySchema';
import { PollutantCard } from './PollutantCard';
import { Layers } from 'lucide-react';

export const PollutantGrid: React.FC<{ data: CleanAirQualityModel; className?: string }> = ({
  data,
  className = '',
}) => {
  const pollutantList = [
    data.pollutants.pm2_5,
    data.pollutants.pm10,
    data.pollutants.ozone,
    data.pollutants.nitrogen_dioxide,
    data.pollutants.carbon_monoxide,
    data.pollutants.sulphur_dioxide,
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 pb-1 border-b border-vayu-border-subtle">
        <Layers className="w-5 h-5 text-vayu-primary" aria-hidden="true" />
        <h3 className="text-base sm:text-lg font-black text-vayu-text">
          Atmospheric Pollutants Breakdown
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {pollutantList.map((p) => (
          <PollutantCard key={p.key} pollutant={p} />
        ))}
      </div>
    </div>
  );
};
