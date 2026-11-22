import React, { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
        className={`relative w-full ${maxWidthClass} card rounded-t-2xl sm:rounded-card shadow-soft-lg border border-finora-border overflow-hidden z-10 max-h-[92vh] sm:max-h-[88vh] flex flex-col transform transition-all`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-finora-border bg-finora-bgSecondary sticky top-0 z-10">
          <div>
            <h3 id="modal-headline" className="text-lg font-semibold text-finora-textPrimary">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-finora-textSecondary mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-finora-textSecondary hover:text-finora-textPrimary hover:bg-finora-bgTeritary transition-colors focus:outline-none focus:ring-2 focus:ring-finora-primary"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="px-6 py-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};