import React, { useState } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { ChatPanel } from './ChatPanel';
import { Bot, X, Sparkles } from 'lucide-react';

export const ChatDrawer: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Trigger Button */}
      <aside aria-label="AI Assistant Quick Access" className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="vayu-chat-drawer"
          aria-label={isOpen ? t('chat.close') || 'Close Vayu Assistant' : t('chat.open') || 'Open Vayu Assistant'}
          className="relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-vayu-accent text-vayu-btn-text font-black text-xs sm:text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-vayu-focus-ring group"
        >
          {/* Subtle pulse ring */}
          <span className="absolute -inset-1 rounded-full bg-vayu-accent opacity-30 animate-ping group-hover:opacity-60" aria-hidden="true" />

          {isOpen ? (
            <>
              <X className="w-5 h-5" aria-hidden="true" />
              <span>Close</span>
            </>
          ) : (
            <>
              <Bot className="w-5 h-5" aria-hidden="true" />
              <span>{t('chat.triggerButton') || 'Ask Vayu AI'}</span>
              <Sparkles className="w-3.5 h-3.5 text-vayu-primary animate-pulse" aria-hidden="true" />
            </>
          )}
        </button>
      </aside>

      {/* Floating Assistant Modal / Drawer */}
      {isOpen && (
        <aside
          id="vayu-chat-drawer"
          role="region"
          aria-label="Vayu Conversational Assistant"
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] max-w-[95vw] animate-in fade-in slide-in-from-bottom-6 duration-200"
        >
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close Assistant"
              className="absolute -top-3 -right-3 z-50 p-2 rounded-full bg-vayu-surface-elevated border border-vayu-border text-vayu-text shadow-lg hover:bg-vayu-surface-tint focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring"
            >
              <X className="w-4 h-4" />
            </button>
            <ChatPanel />
          </div>
        </aside>
      )}
    </>
  );
};
