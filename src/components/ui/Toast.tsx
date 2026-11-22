import React, { useState, ReactNode, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { ToastContext, ToastItem, ToastType } from './toastContext';

const iconMap = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
};

const borderMap = {
  success: 'border-emerald-500',
  warning: 'border-amber-500',
  error: 'border-rose-500',
  info: 'border-vayu-border',
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, message, type = 'info' }: { title: string; message?: string; type?: ToastType }) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, title, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((item) => {
            const Icon = iconMap[item.type];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto flex items-start gap-3 p-4 bg-vayu-surface-elevated text-vayu-text border-l-4 ${borderMap[item.type]} border border-vayu-border rounded-2xl shadow-2xl`}
                role={item.type === 'error' ? 'alert' : 'status'}
              >
                <Icon className="w-5 h-5 text-vayu-accent shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-vayu-text">{item.title}</div>
                  {item.message && (
                    <div className="text-xs text-vayu-text-secondary mt-0.5">{item.message}</div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(item.id)}
                  aria-label="Close notification"
                  className="p-1 rounded-full text-vayu-text-secondary hover:text-vayu-text hover:bg-vayu-surface-tint"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

