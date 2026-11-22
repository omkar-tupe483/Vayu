import React, { useEffect, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  position?: 'left' | 'right';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
}) => {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const slideVariants = {
    left: { x: '-100%' },
    right: { x: '100%' },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          <motion.div
            initial={slideVariants[position]}
            animate={{ x: 0 }}
            exit={slideVariants[position]}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`relative ${
              position === 'right' ? 'ml-auto' : 'mr-auto'
            } w-full max-w-md h-full bg-vayu-surface border-vayu-border ${
              position === 'right' ? 'border-l' : 'border-r'
            } p-6 shadow-2xl z-10 flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-vayu-border-subtle">
                <h3 className="text-lg font-bold text-vayu-text">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close drawer"
                  className="p-1.5 rounded-full text-vayu-text-secondary hover:text-vayu-text hover:bg-vayu-surface-tint transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-vayu-focus-ring"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <div className="py-4">{children}</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

