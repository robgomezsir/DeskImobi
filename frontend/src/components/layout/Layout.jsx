import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeToggleFloating } from '../ThemeToggleFloating';
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

  return (
    <div className="flex h-screen overflow-hidden">
      <ThemeToggleFloating />
      <Sidebar collapsed={sidebarCollapsed} onToggleSidebar={toggleSidebar} />
      <main
        className={
          sidebarCollapsed
            ? 'flex-1 overflow-y-auto overflow-x-hidden p-8 bg-transparent ml-20 transition-[margin] duration-200 ease-out'
            : 'flex-1 overflow-y-auto overflow-x-hidden p-8 bg-transparent ml-64 transition-[margin] duration-200 ease-out'
        }
      >
        <Outlet />
      </main>
    </div>
  );
}
