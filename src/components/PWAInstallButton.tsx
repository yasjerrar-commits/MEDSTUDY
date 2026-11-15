import React, { useEffect, useState } from 'react';
import { Download, Smartphone, WifiOff, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F2744] dark:bg-teal-600 px-3 py-2 text-xs font-medium text-white hover:bg-[#173961] dark:hover:bg-teal-500 transition-colors whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer"
        title="Installer l’application MEDSTUDY"
      >
        <Download className="w-4 h-4 shrink-0" />
        {!compact && <span>Installer l’app</span>}
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer"
        >
          <Smartphone className="w-4 h-4 shrink-0" />
          {!compact && <span>Installer (iOS)</span>}
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Installer MEDSTUDY sur iPhone / iPad
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  aria-label="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ol className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-slate-300 list-decimal pl-5">
                <li>
                  Appuyez sur le bouton <strong>Partager</strong> dans la barre de Safari.
                </li>
                <li>
                  Faites défiler vers le bas puis sélectionnez{' '}
                  <strong>Sur l’écran d’accueil</strong>.
                </li>
                <li>Confirmez en appuyant sur <strong>Ajouter</strong>.</li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-lg bg-[#0F2744] dark:bg-teal-600 py-2.5 text-sm font-medium text-white hover:bg-[#173961] transition-colors cursor-pointer"
              >
                Compris
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-amber-600 px-3 py-2 text-xs font-medium text-white shadow-lg">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>Mode hors ligne — Données locales actives</span>
    </div>
  );
};
