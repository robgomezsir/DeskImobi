/**
 * Faixa padrão de título + subtítulo + área de ações para o header do layout autenticado.
 * Use dentro de useRegisterAppToolbar(() => <PageToolbar ... />, deps).
 */
export function PageToolbar({
  title,
  subtitle,
  kicker,
  actions,
  constrainWidth = false,
  stackBreakpoint = 'sm',
  rowAlign = 'center',
  className = '',
}) {
  const rowClass =
    stackBreakpoint === 'lg'
      ? rowAlign === 'end'
        ? 'flex w-full min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'
        : 'flex w-full min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'
      : rowAlign === 'end'
        ? 'flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'
        : 'flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between';

  const inner = (
    <div className={rowClass}>
      <div className="min-w-0 text-left">
        {kicker ? <div className="mb-1">{kicker}</div> : null}
        <h1 className="text-left text-xl font-display font-bold tracking-tight text-bv-text sm:text-2xl md:text-3xl">{title}</h1>
        {subtitle != null && subtitle !== '' ? (
          <p className="text-left line-clamp-2 max-w-full text-pretty text-sm text-bv-muted sm:line-clamp-none sm:truncate">{subtitle}</p>
        ) : null}
      </div>
      {actions != null ? actions : null}
    </div>
  );

  if (constrainWidth) {
    return <div className={`mx-auto w-full max-w-6xl min-w-0 ${className}`.trim()}>{inner}</div>;
  }

  return <div className={`w-full min-w-0 ${className}`.trim()}>{inner}</div>;
}
