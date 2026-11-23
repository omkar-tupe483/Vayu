import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  className = '',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const posClass = position === 'right' ? 'right-0' : 'left-0';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Panel'}
    >
      <div
        className={`fixed top-0 bottom-0 ${posClass} w-full max-w-md bg-vayu-surface border-l border-vayu-border p-6 shadow-2xl flex flex-col justify-between overflow-y-auto ${className}`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-vayu-border-subtle">
            {title && <h3 className="text-lg font-black text-vayu-text">{title}</h3>}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className="p-1.5 rounded-xl text-vayu-text-secondary hover:text-vayu-text hover:bg-vayu-surface-tint focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring ml-auto"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};
