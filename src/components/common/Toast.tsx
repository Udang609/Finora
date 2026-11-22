import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useFinance();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border shadow-soft-lg card transition-all transform animate-in slide-in-from-bottom-3 duration-200 ${
              isSuccess
                ? 'border-finora-green/30'
                : isError
                ? 'border-finora-red/30'
                : 'border-finora-primary/30'
            }`}
          >
            <div className="flex items-center gap-3">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-finora-green flex-shrink-0" />}
              {isError && <AlertCircle className="w-5 h-5 text-finora-red flex-shrink-0" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-finora-primary flex-shrink-0" />}
              <span className="text-xs sm:text-sm font-medium text-finora-textPrimary">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-finora-textMuted hover:text-finora-textPrimary p-1 rounded-md transition-colors ml-2"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};