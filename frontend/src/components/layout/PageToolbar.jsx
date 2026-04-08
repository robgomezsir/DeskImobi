/**
 * Faixa padrão de título + subtítulo + área de ações para o header do layout autenticado.
 * Em mobile (abaixo de md): só o título (uma linha, truncado); kicker e subtítulo ocultos.
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
      <div className="min-w-0 flex-1 text-left">
        {kicker ? <div className="mb-1 hidden md:block">{kicker}</div> : null}
        <h1 className="max-w-full truncate text-left font-display text-base font-bold uppercase leading-tight tracking-[0.06em] text-bv-text md:text-2xl md:leading-normal lg:text-3xl">
          {title}
        </h1>
        {subtitle != null && subtitle !== '' ? (
          <p className="mt-0.5 hidden max-w-full text-pretty text-sm text-bv-muted md:mt-1 md:block md:truncate">
            {subtitle}
          </p>
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
