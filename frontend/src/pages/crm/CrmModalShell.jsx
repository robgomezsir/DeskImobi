import { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Modal CRM em portal (`document.body`): no mobile, `main.bv-scroll-root` usa `translateZ(0)` e
 * quebra `position:fixed` relativo ao viewport — o portal evita o painel cortado ou fora do ecrã.
 *
 * Mobile e desktop: cartão flutuante (margem ao ecrã), cantos arredondados, fundo ~90% opaco
 * (sem liquid glass). Conteúdo com scroll interno e safe-area.
 */
export function CrmModalShell({ open, onClose, children, ariaLabelledBy }) {
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#141414]/80 backdrop-blur-[3px] animate-in fade-in duration-200 sm:bg-[#141414]/75 sm:backdrop-blur-md"
        aria-label="Fechar"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        className="relative z-[1] flex h-auto max-h-[min(calc(100dvh-1.5rem),800px)] w-full max-w-lg flex-col overflow-hidden rounded-card-3xl border border-[var(--line)] shadow-2xl ring-1 ring-black/10 animate-in slide-in-from-bottom-4 zoom-in-95 duration-300 dark:ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fundo ~90% opaco (sem liquid glass) — cartão flutuante com margem ao ecrã */}
        <div className="flex min-h-0 max-h-[inherit] flex-1 flex-col overflow-hidden rounded-card-3xl bg-[color-mix(in_srgb,var(--bv-card-mold-bg)_90%,transparent)]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
