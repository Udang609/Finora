import React from 'react';
import { Download, X } from 'lucide-react';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';

export const InstallBanner: React.FC = () => {
  const { canInstall, isDismissed, install, dismiss } = useInstallPrompt();

  if (!canInstall || isDismissed) return null;

  return (
    <div className="lg:hidden fixed bottom-[76px] left-3 right-3 z-40">
      <div className="flex items-center gap-3 rounded-2xl card shadow-soft-lg border border-finora-border/50 p-3 bg-finora-bgSecondary/95 backdrop-blur-sm">
        <img
          src="./pwa-192x192.png"
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 rounded-xl flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-finora-textPrimary">Pasang Finora di HP</p>
          <p className="text-[11px] leading-snug text-finora-textSecondary">
            Akses cepat dari layar utama, tanpa tab browser.
          </p>
        </div>
        <button
          type="button"
          onClick={install}
          className="flex items-center gap-1.5 btn-primary text-xs px-3 py-2 flex-shrink-0"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          Pasang
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Tutup tawaran pasang aplikasi"
          className="p-1.5 text-finora-textMuted hover:text-finora-textPrimary rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-finora-primary flex-shrink-0"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};