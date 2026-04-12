import { useCallback, useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { SetAppToolbarContext } from '../../contexts/AppToolbarContext';
import { SetAppFabContext } from '../../contexts/AppFabContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeToggleButton } from '../ThemeToggleButton';
import { BottomNav } from './BottomNav';
import { BRAND_ICON_URLS } from '../../constants/brandIconUrls';
import logoHorizontalBranca from '../../assets/logo-horizontal-branca.svg';
import logonamePreta from '../../assets/logoname-preta.svg';

function displayNameFromUser(user) {
  if (!user) return '';
  const meta = user.user_metadata || {};
  const raw = String(meta.name || meta.full_name || '').trim();
  if (raw) return raw;
  const email = user.email || '';
  const local = email.split('@')[0];
  return local || '—';
}

/** Desktop (lg): afastamento do rail vertical (~3,5rem) + folga antes do conteúdo */
const RAIL_INSET_LG =
  'lg:pl-[max(6rem,calc(1.25rem+env(safe-area-inset-left)+3.75rem))]';

/** Espaço: mobile = barra inferior; desktop = rail à esquerda + margem inferior */
const MAIN_PAD_NAV = ['max-lg:pb-[max(6.25rem,calc(0.75rem+env(safe-area-inset-bottom)))]', 'lg:pb-4', RAIL_INSET_LG].join(
  ' '
);

const MAIN_PAD_NAV_FAB = [
  'max-lg:pb-[max(10.5rem,calc(4.75rem+env(safe-area-inset-bottom)))]',
  'lg:pb-[max(1.25rem,env(safe-area-inset-bottom))]',
  RAIL_INSET_LG,
].join(' ');

export function Layout() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();
  const dashboardGreeting = useMemo(() => displayNameFromUser(user), [user]);
  const [toolbarLeading, setToolbarLeading] = useState(null);
  const setToolbar = useCallback((node) => {
    setToolbarLeading(node);
  }, []);

  const [fabSlot, setFabSlot] = useState(null);
  const setFab = useCallback((node) => {
    setFabSlot(node);
  }, []);

  return (
    <div className="flex h-[100dvh] overflow-hidden [--bv-app-header-height:4rem]">
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col bg-transparent">
        <SetAppToolbarContext.Provider value={setToolbar}>
          <SetAppFabContext.Provider value={setFab}>
            <header className="flex shrink-0 items-center border-b border-[var(--line-subtle)] bg-bv-page px-4 py-3 backdrop-blur-none sm:bg-bv-page/90 sm:px-6 sm:backdrop-blur-sm lg:px-8">
              <Link
                to="/dashboard"
                className="group flex shrink-0 items-center rounded-lg pr-3 outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-bv-green/50 sm:pr-4"
                aria-label="BrokerVision — ir para o Dashboard"
              >
                <img
                  src={BRAND_ICON_URLS.symbolSvg}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 shrink-0 sm:hidden"
                  aria-hidden
                />
                <img
                  src={isDark ? logoHorizontalBranca : logonamePreta}
                  alt="BrokerVision"
                  width={180}
                  height={32}
                  className="hidden h-7 w-auto max-w-[140px] sm:block sm:h-8 sm:max-w-[180px]"
                />
              </Link>
              <div className="flex min-h-11 min-w-0 flex-1 items-center gap-2 border-l border-[var(--line-subtle)] pl-3 sm:gap-3 sm:pl-4">
                {toolbarLeading}
              </div>
              <div className="flex min-w-0 shrink-0 items-center gap-2 pl-2 sm:gap-3 sm:pl-3">
                {location.pathname === '/dashboard' && dashboardGreeting ? (
                  <p
                    className="hidden max-w-[14rem] truncate text-right text-sm leading-normal text-bv-muted sm:block"
                    title={`Bem-vindo, ${dashboardGreeting}`}
                  >
                    Bem-vindo,{' '}
                    <span className="font-semibold text-bv-text">{dashboardGreeting}</span>!
                  </p>
                ) : null}
                <ThemeToggleButton />
              </div>
            </header>
            <main
              data-bv-page={location.pathname}
              className={
                fabSlot
                  ? `bv-scroll-root min-h-0 flex-1 touch-pan-y overflow-y-auto overflow-x-hidden px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 ${MAIN_PAD_NAV_FAB}`
                  : `bv-scroll-root min-h-0 flex-1 touch-pan-y overflow-y-auto overflow-x-hidden px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 ${MAIN_PAD_NAV}`
              }
            >
              <Outlet />
            </main>
            {fabSlot ? (
              <div className="pointer-events-none fixed right-0 z-[45] max-lg:bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] max-lg:p-4 max-lg:pr-[max(1rem,env(safe-area-inset-right))] max-lg:pl-4 max-lg:pt-2 lg:bottom-6 lg:p-6 lg:pr-[max(1.5rem,env(safe-area-inset-right))]">
                <div className="pointer-events-auto flex flex-col items-end gap-2">{fabSlot}</div>
              </div>
            ) : null}
          </SetAppFabContext.Provider>
        </SetAppToolbarContext.Provider>
      </div>
      <BottomNav />
    </div>
  );
}
