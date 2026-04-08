/**
 * Botão circular padrão para ações primárias no FAB do layout.
 */
export function ModuleFabButton({ children, 'aria-label': ariaLabel, title, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title ?? ariaLabel}
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00F5A0] to-[#00A854] text-black shadow-lg shadow-bv-green/25 transition-[transform,filter] hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-bv-green/60"
    >
      {children}
    </button>
  );
}
