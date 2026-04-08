import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calculator,
  Sparkles,
  Settings,
  LogOut,
  Zap,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import logoWhite from '../../assets/logo-white.png';
import logoHorizontalDark from '../../assets/logo-horizontal-dark.png';
import { BV_MODULE_KEYS, BV_MODULES } from '../../constants/brandModules';
import { BRAND_ICON_URLS } from '../../constants/brandIconUrls';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navIcons = {
  dashboard: LayoutDashboard,
  crm: Users,
  calc: Calculator,
  finance: Wallet,
  flow: Zap,
  insights: Sparkles,
};

const navItems = BV_MODULE_KEYS.map((key) => ({
  ...BV_MODULES[key],
  icon: navIcons[key],
}));

/**
 * @param {{ collapsed: boolean, onToggleSidebar: () => void }} props
 */
export function Sidebar({ collapsed, onToggleSidebar }) {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <aside
      className={cn(
        'glass border-r border-[var(--line)] h-screen fixed left-0 top-0 flex flex-col z-50 transition-[width] duration-200 ease-out',
        collapsed ? 'w-20 p-2' : 'w-64 p-4'
      )}
    >
      <div className={cn('mb-8 mt-2 shrink-0', collapsed ? 'px-0' : 'px-2')}>
        <button
          type="button"
          onClick={onToggleSidebar}
          className={cn(
            'flex w-full items-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bv-green/50',
            collapsed ? 'justify-center p-2 hover:bg-[var(--hover-surface)]' : 'justify-start px-2 py-2 -m-2 hover:bg-[var(--hover-surface)]'
          )}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
        >
          {collapsed ? (
            <img
              src={BRAND_ICON_URLS.symbolGreen32}
              alt=""
              className="h-8 w-8 shrink-0"
              width={32}
              height={32}
              aria-hidden
            />
          ) : isDark ? (
            <img src={logoWhite} alt="BrokerVision" className="h-8 w-auto max-w-[180px]" />
          ) : (
            <img src={logoHorizontalDark} alt="BrokerVision" className="h-8 w-auto max-w-[180px]" />
          )}
        </button>
      </div>

      <nav className="flex-1 min-h-0 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.officialName : undefined}
              aria-label={item.officialName}
              className={cn(
                'flex items-center rounded-lg transition-all group',
                collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5',
                isActive
                  ? 'bg-bv-green/10 text-bv-green border border-bv-green/20'
                  : 'text-bv-muted hover:text-bv-text hover:bg-[var(--hover-surface)] border border-transparent'
              )}
            >
              <item.icon
                size={20}
                className={cn('shrink-0', isActive ? 'text-bv-green' : 'group-hover:text-bv-text')}
              />
              <span className={cn('font-medium truncate', collapsed && 'sr-only')}>{item.officialName}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 pt-4 border-t border-[var(--line-subtle)] shrink-0">
        <Link
          to="/settings"
          title={collapsed ? 'Configurações' : undefined}
          aria-label="Configurações"
          className={cn(
            'flex rounded-lg text-bv-muted hover:text-bv-text transition-all',
            collapsed ? 'justify-center px-2 py-2' : 'items-center gap-3 px-3 py-2',
            location.pathname === '/settings' && 'text-bv-green bg-bv-green/10'
          )}
        >
          <Settings size={20} className="shrink-0" />
          <span className={cn('font-medium', collapsed && 'sr-only')}>Configurações</span>
        </Link>

        <button
          type="button"
          onClick={signOut}
          title={collapsed ? 'Sair' : undefined}
          aria-label="Sair"
          className={cn(
            'flex rounded-lg text-red-400 hover:bg-red-400/10 transition-all w-full',
            collapsed ? 'justify-center px-2 py-2' : 'items-center gap-3 px-3 py-2 text-left'
          )}
        >
          <LogOut size={20} className="shrink-0" />
          <span className={cn('font-medium', collapsed && 'sr-only')}>Sair</span>
        </button>

        <div
          className={cn(
            'flex rounded-xl border border-[var(--line-subtle)] bg-bv-surface-muted',
            collapsed ? 'justify-center p-2' : 'items-center gap-3 px-2 py-3'
          )}
        >
          <div className="w-8 h-8 rounded-full bg-bv-green flex items-center justify-center text-xs font-bold text-black shrink-0">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div className={cn('overflow-hidden min-w-0', collapsed && 'sr-only')}>
            <p className="text-sm font-medium text-bv-text truncate">{user?.email}</p>
            <p className="text-[10px] text-bv-green uppercase tracking-wider font-bold">SOVEREIGN PRO</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
