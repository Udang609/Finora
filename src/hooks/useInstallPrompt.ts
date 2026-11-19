import { useCallback, useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface Window {
    __finoraInstallPrompt?: BeforeInstallPromptEvent;
  }
}

const DISMISS_KEY = 'finora_install_dismissed_v1';

const readStandalone = () => {
  if (typeof window === 'undefined') return false;
  const iosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone;
  return window.matchMedia('(display-mode: standalone)').matches || iosStandalone === true;
};

export const useInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    () => (typeof window === 'undefined' ? null : window.__finoraInstallPrompt ?? null)
  );
  const [isInstalled, setIsInstalled] = useState(readStandalone);
  const [isDismissed, setIsDismissed] = useState(
    () => typeof window !== 'undefined' && localStorage.getItem(DISMISS_KEY) === '1'
  );

  useEffect(() => {
    const onPromptReady = () => {
      setDeferredPrompt(window.__finoraInstallPrompt ?? null);
    };
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      window.__finoraInstallPrompt = event as BeforeInstallPromptEvent;
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      window.__finoraInstallPrompt = undefined;
      localStorage.removeItem(DISMISS_KEY);
    };
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const onDisplayModeChange = () => setIsInstalled(readStandalone());

    window.addEventListener('finora-install-ready', onPromptReady);
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    mediaQuery.addEventListener?.('change', onDisplayModeChange);

    return () => {
      window.removeEventListener('finora-install-ready', onPromptReady);
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
      mediaQuery.removeEventListener?.('change', onDisplayModeChange);
    };
  }, []);

  const install = useCallback(async () => {
    const promptEvent = deferredPrompt ?? window.__finoraInstallPrompt;
    if (!promptEvent) return false;

    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
        window.__finoraInstallPrompt = undefined;
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, '1');
    setIsDismissed(true);
  }, []);

  return {
    canInstall: Boolean(deferredPrompt) && !isInstalled,
    isInstalled,
    isDismissed,
    install,
    dismiss,
  };
};
