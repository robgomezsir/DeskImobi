import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { SetAppToolbarContext } from '../../contexts/AppToolbarContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { ThemeToggleButton } from '../ThemeToggleButton';
import { Sidebar } from './Sidebar';

const STORAGE_KEY = 'bv-sidebar-collapsed';

function readStoredCollapsed() {
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function Layout() {
  const isMdUp = useMediaQuery('(min-width: 768px)');
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(readStoredCollapsed);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [toolbarLeading, setToolbarLeading] = useState(null);
  const setToolbar = useCallback((node) => {
    setToolbarLeading(node);
  }, []);

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
      ? 'flex flex-1 min-w-0 flex-col bg-transparent ml-20 transition-[margin] duration-200 ease-out'
      : 'flex flex-1 min-w-0 flex-col bg-transparent ml-64 transition-[margin] duration-200 ease-out'
    : 'flex min-h-0 w-full min-w-0 flex-1 flex-col bg-transparent';

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {!isMdUp && mobileDrawerOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          aria-label="Fechar menu"
          onClick={() => setMobileDrawerOpen(false)}
        />
      ) : null}

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        isMobileLayout={!isMdUp}
        mobileDrawerOpen={mobileDrawerOpen}
        onCloseMobile={() => setMobileDrawerOpen(false)}
      />
      <div className={mainColClass}>
        <SetAppToolbarContext.Provider value={setToolbar}>
          <header className="flex shrink-0 items-center gap-2 border-b border-[var(--line-subtle)] bg-bv-page/90 px-4 py-3 backdrop-blur-sm sm:gap-3 sm:px-6 lg:px-8">
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
            <div className="flex shrink-0 items-center gap-2">
              <ThemeToggleButton />
            </div>
          </header>
          <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pb-8 sm:pt-6 lg:px-8">
            <Outlet />
          </main>
        </SetAppToolbarContext.Provider>
      </div>
    </div>
  );
}
