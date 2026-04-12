import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calculator,
  Lightbulb,
  Share2,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BV_MODULE_KEYS, BV_MODULES } from '../../constants/brandModules';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Rótulos curtos para caber na barra inferior em ecrãs estreitos */
const BOTTOM_LABEL = {
  dashboard: 'Dashboard',
  crm: 'CRM',
  calc: 'Calculadora',
  insights: 'Insights',
  integrations: 'Integrações',
};

const navIcons = {
  dashboard: LayoutDashboard,
  crm: Users,
  calc: Calculator,
  insights: Lightbulb,
  integrations: Share2,
};

const navItems = BV_MODULE_KEYS.map((key) => ({
  ...BV_MODULES[key],
  icon: navIcons[key],
  bottomLabel: BOTTOM_LABEL[key],
}));

/**
 * Navegação principal: barra flutuante horizontal fixa na parte inferior.
 */
export function BottomNav() {
  const location = useLocation();
  const { signOut, user } = useAuth();

  return (
    <nav
      id="app-sidebar-nav"
      aria-label="Navegação principal"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2"
    >
      <div
        className={cn(
          'pointer-events-auto mx-auto flex max-w-5xl items-stretch gap-1 rounded-card-3xl border border-[var(--line)]',
          'bg-bv-page/95 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] backdrop-blur-md',
          'dark:shadow-[0_-4px_32px_rgba(0,0,0,0.45)]',
          'px-1.5 py-2 sm:gap-2 sm:px-3'
        )}
      >
        <div className="flex min-w-0 flex-1 items-stretch justify-between gap-0.5 sm:justify-evenly sm:gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-label={item.officialName}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'bv-sidebar-nav-link group relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-lg px-1 py-1.5 transition-all sm:px-2',
                  '[&>svg]:relative [&>svg]:z-[1] [&>span]:relative [&>span]:z-[1]',
                  isActive
                    ? 'border border-bv-card bg-bv-card-fill text-bv-green'
                    : 'border border-transparent text-bv-muted hover:bg-[var(--hover-surface)] hover:text-bv-text'
                )}
              >
                <Icon
                  size={20}
                  strokeWidth={2}
                  className={cn('shrink-0', isActive ? 'text-bv-green' : 'text-bv-muted group-hover:text-bv-text')}
                />
                <span className="max-w-full truncate text-center text-[9px] font-medium leading-tight tracking-tight sm:text-[10px]">
                  {item.bottomLabel}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-0.5 border-l border-[var(--line-subtle)] pl-2 sm:gap-1 sm:pl-3">
          <Link
            to="/settings"
            aria-label="Configurações"
            aria-current={location.pathname === '/settings' ? 'page' : undefined}
            className={cn(
              'bv-sidebar-nav-link group relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg transition-all',
              '[&>svg]:relative [&>svg]:z-[1]',
              location.pathname === '/settings'
                ? 'border border-bv-card bg-bv-card-fill text-bv-green'
                : 'border border-transparent text-bv-muted hover:bg-[var(--hover-surface)] hover:text-bv-text'
            )}
          >
            <Settings
              size={20}
              strokeWidth={2}
              className={cn(
                location.pathname === '/settings' ? 'text-bv-green' : 'text-bv-muted group-hover:text-bv-text'
              )}
            />
          </Link>

          <button
            type="button"
            onClick={signOut}
            aria-label="Sair"
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-red-400 transition-all hover:bg-red-400/10"
          >
            <LogOut size={20} strokeWidth={2} />
          </button>

          <div
            className="hidden h-9 max-w-[7rem] items-center gap-2 rounded-lg border border-[var(--line-subtle)] bg-bv-surface-muted px-2 sm:flex"
            title={user?.email ?? ''}
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bv-green text-[10px] font-bold text-black">
              {user?.email?.[0]?.toUpperCase() ?? '—'}
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="truncate text-[10px] font-medium leading-tight text-bv-text">{user?.email}</p>
              <p className="text-[9px] font-bold leading-tight text-bv-green">Sovereign Pro</p>
            </div>
          </div>

          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--line-subtle)] bg-bv-surface-muted sm:hidden"
            title={user?.email ?? ''}
          >
            <span className="text-xs font-bold text-bv-green">{user?.email?.[0]?.toUpperCase() ?? '—'}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
