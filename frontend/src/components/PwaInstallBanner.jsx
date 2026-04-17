import { useCallback, useEffect, useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const SESSION_DISMISS_KEY = 'bv-pwa-install-dismiss-session';

function isStandaloneDisplay() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  if (window.matchMedia('(display-mode: minimal-ui)').matches) return true;
  if (typeof navigator !== 'undefined' && navigator.standalone === true) return true;
  return false;
}

function isIosDevice() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}

/**
 * Banner de instalação PWA: mostra ao entrar na app (por sessão do separador)
 * até o utilizador instalar ou dispensar. Não aparece em modo standalone (já instalada).
 */
export function PwaInstallBanner() {
  const [installed, setInstalled] = useState(() => isStandaloneDisplay());
  const [dismissed, setDismissed] = useState(
    () => typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SESSION_DISMISS_KEY) === '1'
  );
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const syncStandalone = () => setInstalled(isStandaloneDisplay());
    syncStandalone();

    const mq = window.matchMedia('(display-mode: standalone)');
    mq.addEventListener('change', syncStandalone);

    const onBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const onAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);
    return () => {
      mq.removeEventListener('change', syncStandalone);
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
    setDismissed(true);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } finally {
      setInstalling(false);
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  if (installed || dismissed) return null;

  const showIosHint = isIosDevice() && !deferredPrompt;
  const showInstallButton = Boolean(deferredPrompt);

  return (
    <div
      id="pwa-install-banner"
      role="region"
      aria-label="Instalar BrokerVision"
      className={cn(
        'pointer-events-auto fixed bottom-0 left-0 right-0 z-[400]',
        'border-t border-[var(--line-subtle)] bg-bv-page/95 shadow-[0_-8px_32px_rgba(0,0,0,0.1)] backdrop-blur-md',
        'dark:shadow-[0_-8px_32px_rgba(0,0,0,0.35)]',
        'px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6'
      )}
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex min-w-0 flex-1 gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--line-subtle)] bg-bv-surface-strong text-bv-green"
            aria-hidden
          >
            {showIosHint ? <Smartphone size={20} strokeWidth={2} /> : <Download size={20} strokeWidth={2} />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-bv-text">Instalar BrokerVision</p>
            {showIosHint ? (
              <p className="mt-0.5 text-xs leading-relaxed text-bv-muted">
                No Safari, toque em <span className="font-medium text-bv-text">Partilhar</span> e escolha{' '}
                <span className="font-medium text-bv-text">Adicionar ao ecrã principal</span> para abrir como
                aplicação.
              </p>
            ) : (
              <p className="mt-0.5 text-xs leading-relaxed text-bv-muted">
                Instale a aplicação para acesso rápido, ícone no ecrã inicial e experiência em ecrã inteiro.
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:justify-end">
          {showInstallButton ? (
            <button
              type="button"
              onClick={handleInstall}
              disabled={installing}
              className={cn(
                'inline-flex items-center justify-center rounded-lg bg-bv-green px-4 py-2 text-sm font-semibold text-[#0a0a0a]',
                'outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-bv-green/50',
                'disabled:cursor-wait disabled:opacity-70'
              )}
            >
              {installing ? 'A instalar…' : 'Instalar'}
            </button>
          ) : null}
          <button
            type="button"
            onClick={dismiss}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--line-subtle)] px-3 py-2 text-sm font-medium text-bv-muted',
              'outline-none transition-colors hover:bg-[var(--hover-surface)] hover:text-bv-text focus-visible:ring-2 focus-visible:ring-bv-green/40'
            )}
          >
            <X size={16} strokeWidth={2} aria-hidden />
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
}
