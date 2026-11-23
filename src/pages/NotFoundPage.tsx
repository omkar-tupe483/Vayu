import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-16 space-y-4 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 text-teal-400 flex items-center justify-center mx-auto shadow-2xl">
        <AlertCircle className="w-8 h-8" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold text-white">Page Not Found</h1>
      <p className="text-xs text-slate-400">
        The requested page could not be located.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>{t('nav.home')}</span>
      </Link>
    </div>
  );
};

