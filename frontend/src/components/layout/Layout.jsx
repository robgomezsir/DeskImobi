import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { SetAppToolbarContext } from '../../contexts/AppToolbarContext';
import { SetAppFabContext } from '../../contexts/AppFabContext';
import { useAuth } from '../../contexts/AuthContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { ThemeToggleButton } from '../ThemeToggleButton';
import { Sidebar } from './Sidebar';

function displayNameFromUser(user) {
  if (!user) return '';
  const meta = user.user_metadata || {};
  const raw = String(meta.name || meta.full_name || '').trim();
  if (raw) return raw;
  const email = user.email || '';
  const local = email.split('@')[0];
  return local || '—';
}

const STORAGE_KEY = 'bv-sidebar-collapsed';

function readStoredCollapsed() {
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function Layout() {
  const { user } = useAuth();
  const isMdUp = useMediaQuery('(min-width: 768px)');
  const location = useLocation();
  const dashboardGreeting = useMemo(() => displayNameFromUser(user), [user]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(readStoredCollapsed);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [toolbarLeading, setToolbarLeading] = useState(null);
  const setToolbar = useCallback((node) => {
    setToolbarLeading(node);
  }, []);

  const [fabSlot, setFabSlot] = useState(null);
  const setFab = useCallback((node) => {
    setFabSlot(node);
  }, []);

  const closeMobileDrawer = useCallback(() => setMobileDrawerOpen(false), []);

  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      } catch {
        /* storage indisponível */
      }
      return next;
    });
  };

  const mainColClass = isMdUp
    ? sidebarCollapsed
      ? 'flex flex-1 min-w-0 flex-col bg-transparent ml-20 transition-[margin] duration-200 ease-out motion-reduce:transition-none motion-reduce:duration-0'
      : 'flex flex-1 min-w-0 flex-col bg-transparent ml-64 transition-[margin] duration-200 ease-out motion-reduce:transition-none motion-reduce:duration-0'
    : 'flex min-h-0 w-full min-w-0 flex-1 flex-col bg-transparent';

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {!isMdUp && mobileDrawerOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[#141414]/70 backdrop-blur-none md:hidden"
          aria-label="Fechar menu"
          onClick={closeMobileDrawer}
        />
      ) : null}

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        isMobileLayout={!isMdUp}
        mobileDrawerOpen={mobileDrawerOpen}
        onCloseMobile={closeMobileDrawer}
      />
      <div className={mainColClass}>
        <SetAppToolbarContext.Provider value={setToolbar}>
          <SetAppFabContext.Provider value={setFab}>
          <header className="flex shrink-0 items-center gap-2 border-b border-[var(--line-subtle)] bg-bv-page px-4 py-3 backdrop-blur-none sm:gap-3 sm:bg-bv-page/90 sm:px-6 sm:backdrop-blur-sm lg:px-8">
            {!isMdUp ? (
              <button
                type="button"
                className="-ml-1 shrink-0 rounded-xl p-2.5 text-bv-muted transition-colors hover:bg-[var(--hover-surface)] hover:text-bv-text focus:outline-none focus-visible:ring-2 focus-visible:ring-bv-green/50"
                aria-expanded={mobileDrawerOpen}
                aria-controls="app-sidebar-nav"
                aria-label="Abrir menu de navegação"
                onClick={() => setMobileDrawerOpen(true)}
              >
                <Menu size={22} strokeWidth={2} />
              </button>
            ) : null}
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
                ? 'bv-scroll-root min-h-0 flex-1 touch-pan-y overflow-y-auto overflow-x-hidden px-4 pb-[max(5.5rem,calc(1.5rem+env(safe-area-inset-bottom)))] pt-4 sm:px-6 sm:pb-[max(6rem,env(safe-area-inset-bottom))] sm:pt-6 lg:px-8'
                : 'bv-scroll-root min-h-0 flex-1 touch-pan-y overflow-y-auto overflow-x-hidden px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pb-8 sm:pt-6 lg:px-8'
            }
          >
            <Outlet />
          </main>
          {fabSlot && !(isMdUp === false && mobileDrawerOpen) ? (
            <div className="pointer-events-none fixed bottom-0 right-0 z-[45] p-4 pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1rem,env(safe-area-inset-bottom))] pl-4 pt-2">
              <div className="pointer-events-auto flex flex-col items-end gap-2">{fabSlot}</div>
            </div>
          ) : null}
          </SetAppFabContext.Provider>
        </SetAppToolbarContext.Provider>
      </div>
    </div>
  );
}
