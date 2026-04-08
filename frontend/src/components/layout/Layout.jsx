import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SetAppToolbarContext } from '../../contexts/AppToolbarContext';
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(readStoredCollapsed);
  const [toolbarLeading, setToolbarLeading] = useState(null);
  const setToolbar = useCallback((node) => {
    setToolbarLeading(node);
  }, []);

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

  const mainColClass =
    sidebarCollapsed
      ? 'flex flex-1 min-w-0 flex-col bg-transparent ml-20 transition-[margin] duration-200 ease-out'
      : 'flex flex-1 min-w-0 flex-col bg-transparent ml-64 transition-[margin] duration-200 ease-out';

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} onToggleSidebar={toggleSidebar} />
      <div className={mainColClass}>
        <SetAppToolbarContext.Provider value={setToolbar}>
          <header className="flex shrink-0 items-center gap-3 border-b border-[var(--line-subtle)] bg-bv-page/90 px-8 py-3 backdrop-blur-sm">
            <div className="flex min-h-11 min-w-0 flex-1 items-center gap-3">{toolbarLeading}</div>
            <div className="flex shrink-0 items-center gap-2">
              {/* Reservado: notificações, idioma — mesmo gap-2 do tema */}
              <ThemeToggleButton />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto overflow-x-hidden px-8 pb-8 pt-6">
            <Outlet />
          </main>
        </SetAppToolbarContext.Provider>
      </div>
    </div>
  );
}
