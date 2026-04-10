import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../contexts/ThemeContext';

/** Fundos artísticos — `public/dashboard-bg*.png` (mesmo par do Dashboard). */
const DASHBOARD_BG_DARK = '/dashboard-bg.png?v=1';
const DASHBOARD_BG_LIGHT = '/dashboard-bg-light.png?v=1';

const DEFAULT_INNER =
  'relative z-10 space-y-6 px-4 pb-1 animate-in fade-in duration-700 sm:px-6 lg:px-8';

/**
 * Área de módulo com canvas partilhado: `data-bv-dashboard-canvas` para liquid glass em `index.css`.
 * A imagem artística (`public/dashboard-bg*.png`) só é mostrada quando `showDashboardBg` é true (módulo Dashboard).
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
      >
        <div className={innerClassName ?? DEFAULT_INNER}>{children}</div>
      </div>
    </>
  );
}
