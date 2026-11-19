import React, { useState } from 'react';
import { CheckCircle2, Download, Share, Smartphone } from 'lucide-react';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';
import { Button } from './Button';

const detectIos = () => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const isIpad = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  return /iPhone|iPad|iPod/.test(ua) || isIpad;
};

export const InstallCard: React.FC = () => {
  const { canInstall, isInstalled, install } = useInstallPrompt();
  const [isIos] = useState(detectIos);
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    setIsInstalling(true);
    await install();
    setIsInstalling(false);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-finora-lightBlue text-finora-primary flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-finora-textPrimary">
              Pasang Finora di Perangkat
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {isInstalled
                ? 'Aplikasi berjalan penuh dari layar utama.'
                : 'Buka layar penuh tanpa tab browser, data tetap tersimpan di perangkat.'}
            </p>
          </div>
        </div>

        {isInstalled ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            Terpasang
          </span>
        ) : canInstall ? (
          <Button
            type="button"
            variant="primary"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            isLoading={isInstalling}
            onClick={handleInstall}
            className="self-start sm:self-auto"
          >
            Pasang Aplikasi
          </Button>
        ) : null}
      </div>

      {!isInstalled && !canInstall && isIos && (
        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
          <p className="flex items-center gap-1.5 font-medium text-finora-textPrimary">
            <Share className="w-3.5 h-3.5 text-finora-primary" aria-hidden="true" />
            Lewat Safari:
          </p>
          <p>1. Ketuk tombol Bagikan di toolbar Safari.</p>
          <p>2. Pilih Tambah ke Layar Utama, lalu ketuk Tambah.</p>
        </div>
      )}

      {!isInstalled && !canInstall && !isIos && (
        <p className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
          Buka menu browser, pilih Pasang aplikasi, lalu konfirmasi. Jika opsi itu belum muncul,
          muat ulang halaman ini.
        </p>
      )}
    </div>
  );
};
