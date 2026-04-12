import { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Modal CRM em portal (`document.body`): no mobile, `main.bv-scroll-root` usa `translateZ(0)` e
 * quebra `position:fixed` relativo ao viewport — o portal evita o painel cortado ou fora do ecrã.
 *
 * Mobile: painel a `100dvh`, conteúdo com scroll interno e respeito a safe-area.
 * Desktop (`sm:`): cartão centrado com altura máxima.
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
      className="fixed inset-0 z-[120] flex flex-col sm:items-center sm:justify-center sm:p-4 sm:pt-[max(1rem,env(safe-area-inset-top))] sm:pb-[max(1rem,env(safe-area-inset-bottom))]"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#141414]/88 backdrop-blur-[2px] animate-in fade-in duration-200 sm:bg-[#141414]/80 sm:backdrop-blur-md"
        aria-label="Fechar"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        className="relative z-[1] flex h-[100dvh] w-full max-w-lg flex-col overflow-hidden rounded-none border border-[var(--line)] border-x-0 border-b-0 shadow-2xl animate-in slide-in-from-bottom duration-300 sm:h-auto sm:max-h-[min(90dvh,800px)] sm:rounded-card-3xl sm:border sm:shadow-2xl sm:zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-blur flex min-h-0 flex-1 flex-col overflow-hidden sm:max-h-[min(90dvh,800px)] sm:rounded-card-3xl">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
