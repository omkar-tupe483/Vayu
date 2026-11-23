import React, { useState, useCallback } from 'react';
import { ToastContext, ToastItem } from './toastContext';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ title, message, type = 'info', duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = String(Date.now() + Math.random());
      setToasts((prev) => [...prev, { id, title, message, type, duration }]);
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div
        role="region"
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2"
      >
        {toasts.map((toast) => {
          const typeVisuals = {
            info: { icon: Info, border: 'border-vayu-border', text: 'text-vayu-text' },
            success: { icon: CheckCircle, border: 'border-emerald-500/40', text: 'text-emerald-700 dark:text-emerald-300' },
            warning: { icon: AlertTriangle, border: 'border-amber-500/40', text: 'text-amber-700 dark:text-amber-300' },
            error: { icon: AlertCircle, border: 'border-rose-500/40', text: 'text-rose-700 dark:text-rose-300' },
          }[toast.type || 'info'];

          const IconComponent = typeVisuals.icon;

          return (
            <div
              key={toast.id}
              role="status"
              className={`pointer-events-auto p-4 rounded-2xl bg-vayu-surface border ${typeVisuals.border} shadow-2xl flex items-start gap-3 transition-all`}
            >
              <IconComponent className={`w-5 h-5 shrink-0 mt-0.5 ${typeVisuals.text}`} aria-hidden="true" />
              <div className="flex-1 text-xs sm:text-sm">
                {toast.title && <p className="font-bold text-vayu-text">{toast.title}</p>}
                <p className="text-vayu-text-secondary leading-snug">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss notification"
                className="p-1 rounded-lg text-vayu-text-secondary hover:text-vayu-text focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

