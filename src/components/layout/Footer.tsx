import React from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { Logo } from '../ui/Logo';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-vayu-surface border-t border-vayu-border mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-vayu-border-subtle">
          <div className="flex flex-col items-center md:items-start gap-1">
            <Logo size="sm" />
            <p className="text-xs text-vayu-text-secondary font-medium">
              {t('brand.tagline')}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-vayu-text-secondary">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-vayu-accent" aria-hidden="true" />
              <span>{t('footer.attribution')}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400" aria-hidden="true" />
              <span>Zero-Barrier & Privacy-First</span>
            </span>
          </div>
        </div>

        {/* Transparent disclosures & health notices */}
        <div className="space-y-2 text-[11px] text-vayu-text-secondary max-w-4xl mx-auto text-center md:text-left">
          <p className="flex items-start gap-1.5 justify-center md:justify-start">
            <ShieldCheck className="w-3.5 h-3.5 text-vayu-primary shrink-0 mt-0.5" aria-hidden="true" />
            <span>{t('footer.modelledNote')}</span>
          </p>
          <p className="opacity-80">
            {t('footer.healthNote')}
          </p>
        </div>
      </div>
    </footer>
  );
};

