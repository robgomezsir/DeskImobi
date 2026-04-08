import { Link, useLocation } from 'react-router-dom';
import { useSwipeToClose } from '../../hooks/useSwipeToClose';
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
 * @param {{
 *   collapsed: boolean;
 *   onToggleSidebar: () => void;
 *   isMobileLayout?: boolean;
 *   mobileDrawerOpen?: boolean;
 *   onCloseMobile?: () => void;
 * }} props
 */
export function Sidebar({
  collapsed,
  onToggleSidebar,
  isMobileLayout = false,
  mobileDrawerOpen = false,
  onCloseMobile,
}) {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const effectiveCollapsed = isMobileLayout ? false : collapsed;

  const handleLogoClick = () => {
    if (isMobileLayout) {
      onCloseMobile?.();
      return;
    }
    onToggleSidebar();
  };

  const swipeCloseRef = useSwipeToClose({
    onClose: onCloseMobile,
    enabled: Boolean(isMobileLayout && mobileDrawerOpen && onCloseMobile),
  });

  return (
    <aside
      ref={swipeCloseRef}
      id="app-sidebar-nav"
      className={cn(
        'glass fixed left-0 top-0 z-50 flex h-[100dvh] flex-col border-r border-[var(--line)] transition-[width,transform] duration-200 ease-out motion-reduce:transition-none motion-reduce:duration-0',
        isMobileLayout
          ? cn(
              'w-[min(16rem,calc(100vw-1.5rem))] max-w-[85vw] p-4 pt-[max(1rem,env(safe-area-inset-top))]',
              mobileDrawerOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full pointer-events-none'
            )
          : cn('translate-x-0', effectiveCollapsed ? 'w-20 p-2' : 'w-64 p-4')
      )}
    >
      <div className={cn('mb-8 mt-2 shrink-0', effectiveCollapsed ? 'px-0' : 'px-2')}>
        <button
          type="button"
          onClick={handleLogoClick}
          className={cn(
            'flex w-full items-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bv-green/50',
            effectiveCollapsed ? 'justify-center p-2 hover:bg-[var(--hover-surface)]' : 'justify-start px-2 py-2 -m-2 hover:bg-[var(--hover-surface)]'
          )}
          aria-expanded={!effectiveCollapsed}
          aria-label={
            isMobileLayout
              ? 'Fechar menu'
              : effectiveCollapsed
                ? 'Expandir menu lateral'
                : 'Recolher menu lateral'
          }
        >
          {effectiveCollapsed ? (
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

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto overflow-x-hidden pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={effectiveCollapsed ? item.officialName : undefined}
              aria-label={item.officialName}
              onClick={() => isMobileLayout && onCloseMobile?.()}
              className={cn(
                'flex items-center rounded-lg transition-all group',
                effectiveCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5',
                isActive
                  ? 'bg-bv-green/10 text-bv-green border border-bv-green/20'
                  : 'text-bv-muted hover:text-bv-text hover:bg-[var(--hover-surface)] border border-transparent'
              )}
            >
              <item.icon
                size={20}
                className={cn('shrink-0', isActive ? 'text-bv-green' : 'group-hover:text-bv-text')}
              />
              <span className={cn('min-w-0 font-medium truncate', effectiveCollapsed && 'sr-only')}>{item.officialName}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto shrink-0 space-y-3 border-t border-[var(--line-subtle)] pt-4">
        <Link
          to="/settings"
          title={effectiveCollapsed ? 'Configurações' : undefined}
          aria-label="Configurações"
          onClick={() => isMobileLayout && onCloseMobile?.()}
          className={cn(
            'flex rounded-lg text-bv-muted transition-all hover:text-bv-text',
            effectiveCollapsed ? 'justify-center px-2 py-2' : 'items-center gap-3 px-3 py-2',
            location.pathname === '/settings' && 'bg-bv-green/10 text-bv-green'
          )}
        >
          <Settings size={20} className="shrink-0" />
          <span className={cn('font-medium', effectiveCollapsed && 'sr-only')}>Configurações</span>
        </Link>

        <button
          type="button"
          onClick={signOut}
          title={effectiveCollapsed ? 'Sair' : undefined}
          aria-label="Sair"
          className={cn(
            'flex w-full rounded-lg text-left text-red-400 transition-all hover:bg-red-400/10',
            effectiveCollapsed ? 'justify-center px-2 py-2' : 'items-center gap-3 px-3 py-2'
          )}
        >
          <LogOut size={20} className="shrink-0" />
          <span className={cn('font-medium', effectiveCollapsed && 'sr-only')}>Sair</span>
        </button>

        <div
          className={cn(
            'flex rounded-xl border border-[var(--line-subtle)] bg-bv-surface-muted',
            effectiveCollapsed ? 'justify-center p-2' : 'items-center gap-3 px-2 py-3'
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bv-green text-xs font-bold text-black">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div className={cn('min-w-0 overflow-hidden', effectiveCollapsed && 'sr-only')}>
            <p className="text-sm font-medium text-bv-text truncate">{user?.email}</p>
            <p className="text-[10px] text-bv-green uppercase tracking-wider font-bold">SOVEREIGN PRO</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
