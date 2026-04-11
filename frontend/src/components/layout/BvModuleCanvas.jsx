import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../contexts/ThemeContext';

/** Fundos artísticos do Dashboard — `public/dashboard-bg*.png` (escuro: `logo/22.png`, claro: `logo/claro.png`). */
const DASHBOARD_BG_DARK = '/dashboard-bg.png?v=3';
const DASHBOARD_BG_LIGHT = '/dashboard-bg-light.png?v=2';

const DEFAULT_INNER =
  'relative z-10 space-y-6 px-4 pb-1 animate-in fade-in duration-700 sm:px-6 lg:px-8';

/**
 * Área de módulo partilhada: `data-bv-dashboard-canvas` em todos os módulos.
 * `data-bv-dashboard-immersive` só quando `showDashboardBg` (página Dashboard) — liquid glass + fundo artístico em `index.css`.
 * Módulos sem immersive usam o molde de cartão escuro (fora do Dashboard).
 */
export function BvModuleCanvas({ children, innerClassName, showDashboardBg = false }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const dashboardBgUrl = isLight ? DASHBOARD_BG_LIGHT : DASHBOARD_BG_DARK;
  const canvasRef = useRef(null);
  const [mainViewport, setMainViewport] = useState(null);

  useLayoutEffect(() => {
    if (!showDashboardBg) {
      setMainViewport(null);
      return undefined;
    }
    const el = canvasRef.current;
    if (!el) return undefined;
    const main = el.closest('main');
    if (!main || !(main instanceof HTMLElement)) return undefined;

    const sync = () => {
      const r = main.getBoundingClientRect();
      setMainViewport({
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
      });
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(main);
    window.addEventListener('resize', sync);
    window.visualViewport?.addEventListener('resize', sync);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', sync);
      window.visualViewport?.removeEventListener('resize', sync);
    };
  }, [showDashboardBg]);

  const fixedBackdrop =
    showDashboardBg && mainViewport != null ? (
      <>
        <div
          className="pointer-events-none fixed z-0 bg-cover bg-center bg-no-repeat"
          style={{
            top: mainViewport.top,
            left: mainViewport.left,
            width: mainViewport.width,
            height: mainViewport.height,
            backgroundImage: `url(${dashboardBgUrl})`,
          }}
          aria-hidden
        />
        <div
          className={
            isLight
              ? 'pointer-events-none fixed z-[1] bg-gradient-to-b from-white/35 via-transparent to-white/40'
              : 'pointer-events-none fixed z-[1] bg-gradient-to-b from-black/25 via-transparent to-black/50'
          }
          style={{
            top: mainViewport.top,
            left: mainViewport.left,
            width: mainViewport.width,
            height: mainViewport.height,
          }}
          aria-hidden
        />
      </>
    ) : null;

  return (
    <>
      {typeof document !== 'undefined' && fixedBackdrop
        ? createPortal(fixedBackdrop, document.body)
        : null}
      <div
        ref={canvasRef}
        className="relative -mx-4 min-w-0 sm:-mx-6 lg:-mx-8"
        data-bv-dashboard-canvas
        {...(showDashboardBg ? { 'data-bv-dashboard-immersive': '' } : {})}
      >
        <div className={innerClassName ?? DEFAULT_INNER}>{children}</div>
      </div>
    </>
  );
}
