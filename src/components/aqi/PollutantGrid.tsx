import React from 'react';
import { useTranslation } from '../../i18n';
import { CleanAirQualityModel } from '../../schemas/airQualitySchema';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Flame, Wind, Factory, Sun } from 'lucide-react';

export interface PollutantGridProps {
  data: CleanAirQualityModel;
}

interface PollutantMetric {
  key: 'pm2_5' | 'pm10' | 'nitrogen_dioxide' | 'ozone';
  nameKey: string;
  fullNameKey: string;
  descKey: string;
  value: number;
  unit: string;
  maxScale: number;
  icon: React.ElementType;
}

export const PollutantGrid: React.FC<PollutantGridProps> = ({ data }) => {
  const { t } = useTranslation();

  const metrics: PollutantMetric[] = [
    {
      key: 'pm2_5',
      nameKey: 'pollutants.pm2_5.name',
      fullNameKey: 'pollutants.pm2_5.fullName',
      descKey: 'pollutants.pm2_5.description',
      value: data.pollutants.pm2_5,
      unit: data.units.pm2_5,
      maxScale: 150,
      icon: Flame,
    },
    {
      key: 'pm10',
      nameKey: 'pollutants.pm10.name',
      fullNameKey: 'pollutants.pm10.fullName',
      descKey: 'pollutants.pm10.description',
      value: data.pollutants.pm10,
      unit: data.units.pm10,
      maxScale: 250,
      icon: Wind,
    },
    {
      key: 'nitrogen_dioxide',
      nameKey: 'pollutants.nitrogen_dioxide.name',
      fullNameKey: 'pollutants.nitrogen_dioxide.fullName',
      descKey: 'pollutants.nitrogen_dioxide.description',
      value: data.pollutants.nitrogen_dioxide,
      unit: data.units.nitrogen_dioxide,
      maxScale: 120,
      icon: Factory,
    },
    {
      key: 'ozone',
      nameKey: 'pollutants.ozone.name',
      fullNameKey: 'pollutants.ozone.fullName',
      descKey: 'pollutants.ozone.description',
      value: data.pollutants.ozone,
      unit: data.units.ozone,
      maxScale: 180,
      icon: Sun,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-vayu-text">
            {t('pollutants.title')}
          </h3>
          <p className="text-xs text-vayu-text-secondary">
            {t('pollutants.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((item) => {
          const Icon = item.icon;
          const percentage = Math.min(100, Math.max(5, (item.value / item.maxScale) * 100));

          return (
            <Card key={item.key} variant="default" className="flex flex-col justify-between">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="w-8 h-8 rounded-xl bg-vayu-surface-tint border border-vayu-border flex items-center justify-center text-vayu-primary">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="text-[11px] font-mono text-vayu-text-secondary">
                    {item.unit}
                  </span>
                </div>

                <CardTitle className="text-base flex items-baseline gap-1.5">
                  <span>{t(item.nameKey)}</span>
                  <span className="text-[11px] font-normal text-vayu-text-secondary truncate">
                    ({t(item.fullNameKey)})
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-vayu-text tracking-tight">
                    {item.value}
                  </span>
                  <span className="text-xs font-semibold text-vayu-text-secondary">
                    {item.unit}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full bg-vayu-surface-tint h-2 rounded-full overflow-hidden border border-vayu-border-subtle">
                    <div
                      className="h-full bg-vayu-primary rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-vayu-text-secondary leading-snug line-clamp-2">
                  {t(item.descKey)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

