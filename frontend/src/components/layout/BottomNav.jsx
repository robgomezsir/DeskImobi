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

/** Rótulos curtos na barra inferior (mobile). */
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
 * Navegação principal: barra inferior horizontal (mobile) ou rail vertical à esquerda (lg+), só ícones no web com etiqueta ao hover.
 */
export function BottomNav() {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <nav
      id="app-sidebar-nav"
      aria-label="Navegação principal"
      className={cn(
        'pointer-events-none fixed z-50',
        'inset-x-0 bottom-0 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2',
        'lg:inset-x-auto lg:bottom-0 lg:left-0 lg:right-auto lg:top-[var(--bv-app-header-height,4rem)] lg:h-[calc(100dvh-var(--bv-app-header-height,4rem))] lg:translate-y-0',
        'lg:flex lg:min-h-0 lg:flex-col lg:box-border lg:px-0 lg:pt-2',
        'lg:pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:pl-[max(0.75rem,env(safe-area-inset-left))] lg:pr-2'
      )}
    >
      <div
        className={cn(
          'pointer-events-auto mx-auto flex max-w-5xl flex-row items-stretch gap-1 rounded-card-3xl border border-[var(--line)]',
          'bg-bv-page/95 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] backdrop-blur-sm',
          'dark:shadow-[0_-2px_13px_rgba(0,0,0,0.18)]',
          'px-1.5 py-2 sm:gap-2 sm:px-3',
          'lg:mx-0 lg:flex lg:min-h-0 lg:flex-1 lg:max-w-none lg:min-w-[3.25rem] lg:flex-col lg:justify-between lg:gap-0 lg:overflow-visible lg:px-2 lg:py-3',
          'lg:shadow-[2px_0_10px_rgba(0,0,0,0.06)] lg:backdrop-blur-sm',
          'dark:lg:shadow-[2px_0_13px_rgba(0,0,0,0.18)]'
        )}
      >
        <div className="flex min-w-0 flex-1 items-stretch justify-between gap-0.5 sm:justify-evenly sm:gap-1 lg:min-h-0 lg:flex-none lg:flex-col lg:items-center lg:justify-start lg:gap-1 lg:overflow-visible lg:pt-0">
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
                    'bv-sidebar-nav-link group relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 overflow-visible rounded-lg px-1 py-1.5 transition-all sm:px-2',
                    'lg:h-11 lg:w-11 lg:flex-none lg:justify-center lg:gap-0 lg:px-0 lg:py-0',
                    '[&>svg]:relative [&>svg]:z-[1]',
                    isActive
                      ? 'border-0 border-transparent bg-[var(--hover-surface)] text-bv-green'
                      : 'border-0 border-transparent text-bv-muted hover:bg-[var(--hover-surface)] hover:text-bv-text'
                  )}
                >
                  <Icon
                    size={20}
                    strokeWidth={2}
                    className={cn('shrink-0', isActive ? 'text-bv-green' : 'text-bv-muted group-hover:text-bv-text')}
                  />
                  <span className="max-w-full truncate text-center text-[9px] font-medium leading-tight tracking-tight sm:text-[10px] lg:hidden">
                    {item.bottomLabel}
                  </span>
                  <span
                    className={cn(
                      'bv-nav-tooltip pointer-events-none absolute left-full top-1/2 z-[100] ml-2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-[var(--line)]',
                      'bg-[var(--bv-card-mold-bg)] px-2.5 py-1.5 text-xs font-medium text-bv-text shadow-md ring-1 ring-black/5',
                      'dark:ring-white/10',
                      'opacity-0 transition-opacity duration-150',
                      'lg:block lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100'
                    )}
                    aria-hidden
                  >
                    {item.officialName}
                  </span>
                </Link>
            );
          })}
        </div>

        <div
          className={cn(
            'flex shrink-0 items-center gap-0.5 border-l border-[var(--line-subtle)] pl-2 sm:gap-1 sm:pl-3',
            'lg:flex-col lg:items-center lg:gap-1 lg:border-l-0 lg:border-t lg:border-[var(--line-subtle)] lg:pl-0 lg:pt-3'
          )}
        >
          <Link
            to="/settings"
            aria-label="Configurações"
            aria-current={location.pathname === '/settings' ? 'page' : undefined}
            className={cn(
              'bv-sidebar-nav-link group relative flex h-10 w-10 shrink-0 items-center justify-center overflow-visible rounded-lg transition-all',
              '[&>svg]:relative [&>svg]:z-[1]',
              location.pathname === '/settings'
                ? 'border-0 border-transparent bg-[var(--hover-surface)] text-bv-green'
                : 'border-0 border-transparent text-bv-muted hover:bg-[var(--hover-surface)] hover:text-bv-text'
            )}
          >
            <Settings
              size={20}
              strokeWidth={2}
              className={cn(
                location.pathname === '/settings' ? 'text-bv-green' : 'text-bv-muted group-hover:text-bv-text'
              )}
            />
            <span
              className={cn(
                'bv-nav-tooltip pointer-events-none absolute left-full top-1/2 z-[100] ml-2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-[var(--line)]',
                'bg-[var(--bv-card-mold-bg)] px-2.5 py-1.5 text-xs font-medium text-bv-text shadow-md ring-1 ring-black/5',
                'dark:ring-white/10',
                'opacity-0 transition-opacity duration-150',
                'lg:block lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100'
              )}
              aria-hidden
            >
              Configurações
            </span>
          </Link>

          <button
            type="button"
            onClick={signOut}
            aria-label="Sair"
            className="group relative flex h-10 w-10 shrink-0 items-center justify-center overflow-visible rounded-lg text-red-400 transition-all hover:bg-red-400/10"
          >
            <LogOut size={20} strokeWidth={2} />
            <span
              className={cn(
                'bv-nav-tooltip pointer-events-none absolute left-full top-1/2 z-[100] ml-2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-[var(--line)]',
                'bg-[var(--bv-card-mold-bg)] px-2.5 py-1.5 text-xs font-medium text-red-300 shadow-md ring-1 ring-black/5',
                'dark:ring-white/10',
                'opacity-0 transition-opacity duration-150',
                'lg:block lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100'
              )}
              aria-hidden
            >
              Sair
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
