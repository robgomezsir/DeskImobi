import { useCallback, useEffect, useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import { motion as Motion, useReducedMotion } from 'framer-motion';
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
 * Cartão flutuante de instalação PWA (estilo toast). Mostra ao entrar na app
 * (por sessão do separador) até instalar ou dispensar. Oculto em modo standalone.
 */
export function PwaInstallBanner() {
  const [installed, setInstalled] = useState(() => isStandaloneDisplay());
  const [dismissed, setDismissed] = useState(
    () => typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SESSION_DISMISS_KEY) === '1'
  );
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installing, setInstalling] = useState(false);
  const reduceMotion = useReducedMotion();

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
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[400] flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2"
      role="region"
      aria-label="Instalar BrokerVision"
    >
      <Motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={
          reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 28 }
        }
        className="pointer-events-auto w-full max-w-[min(26rem,calc(100vw-2rem))]"
      >
        <div
          className={cn(
            'rounded-[1.25rem] border px-4 py-4 shadow-[0_22px_48px_-12px_rgba(0,0,0,0.18)] sm:px-5 sm:py-4',
            'border-black/[0.06] bg-white',
            'dark:border-white/10 dark:bg-[#1c1c1c] dark:shadow-[0_22px_48px_-12px_rgba(0,0,0,0.55)]'
          )}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
            <div className="flex min-w-0 flex-1 items-start gap-3.5">
              <div
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-md',
                  'bg-gradient-to-br from-[var(--bv-accent)] to-[var(--bv-accent-deep)]',
                  'text-[#0a0a0a]'
                )}
                aria-hidden
              >
                {showIosHint ? (
                  <Smartphone size={22} strokeWidth={2.25} className="drop-shadow-sm" />
                ) : (
                  <Download size={22} strokeWidth={2.25} className="drop-shadow-sm" />
                )}
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="text-base font-bold leading-tight tracking-tight text-[#111] dark:text-white">
                  Instalar BrokerVision
                </p>
                {showIosHint ? (
                  <p className="mt-1.5 text-sm leading-snug text-[#6b7280] dark:text-zinc-400">
                    No Safari, toque em <span className="font-semibold text-[#374151] dark:text-zinc-300">Partilhar</span>{' '}
                    e depois em <span className="font-semibold text-[#374151] dark:text-zinc-300">Adicionar ao ecrã principal</span>.
                  </p>
                ) : (
                  <p className="mt-1.5 text-sm leading-snug text-[#6b7280] dark:text-zinc-400">
                    Acesso rápido no ecrã inicial, funciona offline.
                  </p>
                )}
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={dismiss}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium text-[#6b7280] outline-none',
                  'transition-colors hover:text-[#374151] focus-visible:ring-2 focus-visible:ring-[var(--bv-accent)]/40',
                  'dark:text-zinc-400 dark:hover:text-zinc-200'
                )}
              >
                Agora não
              </button>
              {showInstallButton ? (
                <button
                  type="button"
                  onClick={handleInstall}
                  disabled={installing}
                  className={cn(
                    'rounded-xl px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] shadow-md',
                    'bg-gradient-to-br from-[var(--bv-accent)] to-[var(--bv-accent-deep)]',
                    'outline-none transition-[filter,opacity] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[var(--bv-accent)]/50',
                    'disabled:cursor-wait disabled:opacity-70'
                  )}
                >
                  {installing ? 'A instalar…' : 'Instalar'}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </Motion.div>
    </div>
  );
}
