import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ChatDrawer } from '../chat/ChatDrawer';
import { useTranslation } from '../../contexts/LanguageContext';

export const AppShell: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-vayu-bg text-vayu-text">
      {/* Skip to Main Content Link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-2xl focus:bg-vayu-accent focus:text-vayu-btn-text focus:font-bold focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring"
      >
        {t('nav.skipToContent')}
      </a>

      <Header />

      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 focus:outline-none">
        <Outlet />
      </main>

      {/* Persistent In-Browser AI Assistant Floating Access */}
      <ChatDrawer />

      <Footer />
    </div>
  );
};

