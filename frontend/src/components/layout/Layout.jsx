import { useState } from 'react';
import { Outlet } from 'react-router-dom';
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
        <header className="flex shrink-0 items-center justify-end gap-2 border-b border-[var(--line-subtle)] bg-bv-page/90 px-8 py-3 backdrop-blur-sm">
          <ThemeToggleButton />
        </header>
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-8 pb-8 pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
