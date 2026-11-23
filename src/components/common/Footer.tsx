import React from 'react';
import { useTranslation } from '../../i18n';
import { ShieldCheck, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 text-center space-y-4">
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Honest Disclosures */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 text-left space-y-2">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{t('disclaimer.modelled')}</span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{t('disclaimer.health')}</span>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          {t('brand.name')} — {t('footer.copyright')} &copy; {new Date().getFullYear()}
        </p>

        <p className="text-[11px] text-slate-600">
          {t('footer.poweredBy')}
        </p>
      </div>
    </footer>
  );
};

