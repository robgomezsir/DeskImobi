import { useCallback, useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { SetAppToolbarContext } from '../../contexts/AppToolbarContext';
import { SetAppFabContext } from '../../contexts/AppFabContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeToggleButton } from '../ThemeToggleButton';
import { BottomNav } from './BottomNav';
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

/** Espaço reservado para a barra inferior flutuante + safe area */
const MAIN_PAD_BOTTOM = 'pb-[max(6.25rem,calc(0.75rem+env(safe-area-inset-bottom)))]';
const MAIN_PAD_BOTTOM_FAB =
  'pb-[max(10.5rem,calc(4.75rem+env(safe-area-inset-bottom)))]';

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
    <div className="flex h-[100dvh] overflow-hidden">
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col bg-transparent">
        <SetAppToolbarContext.Provider value={setToolbar}>
          <SetAppFabContext.Provider value={setFab}>
            <header className="flex shrink-0 items-center gap-3 border-b border-[var(--line-subtle)] bg-bv-page px-4 py-3 backdrop-blur-none sm:gap-4 sm:bg-bv-page/90 sm:px-6 sm:backdrop-blur-sm lg:px-8">
              <Link
                to="/dashboard"
                className="group shrink-0 rounded-lg outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-bv-green/50"
                aria-label="BrokerVision — ir para o Dashboard"
              >
                <img
                  src={isDark ? logoHorizontalBranca : logonamePreta}
                  alt="BrokerVision"
                  className="h-7 w-auto max-w-[140px] sm:h-8 sm:max-w-[180px]"
                  width={180}
                  height={32}
                />
              </Link>
              <div className="flex min-h-11 min-w-0 flex-1 items-center gap-2 sm:gap-3">{toolbarLeading}</div>
              <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
                {location.pathname === '/dashboard' && dashboardGreeting ? (
                  <p
                    className="max-w-[min(46vw,8.75rem)] truncate text-right text-[10px] leading-tight text-bv-muted sm:max-w-[14rem] sm:text-sm sm:leading-normal"
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
                  ? `bv-scroll-root min-h-0 flex-1 touch-pan-y overflow-y-auto overflow-x-hidden px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 ${MAIN_PAD_BOTTOM_FAB}`
                  : `bv-scroll-root min-h-0 flex-1 touch-pan-y overflow-y-auto overflow-x-hidden px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 ${MAIN_PAD_BOTTOM}`
              }
            >
              <Outlet />
            </main>
            {fabSlot ? (
              <div className="pointer-events-none fixed right-0 z-[45] p-4 pr-[max(1rem,env(safe-area-inset-right))] pl-4 pt-2 bottom-[calc(5rem+env(safe-area-inset-bottom,0px))]">
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
