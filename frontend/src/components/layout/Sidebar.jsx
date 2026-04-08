import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calculator, 
  Sparkles,
  Settings, 
  LogOut,
  Zap,
  Wallet
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import logoWhite from '../../assets/logo-white.png';
import { BV_MODULE_KEYS, BV_MODULES } from '../../constants/brandModules';

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

export function Sidebar() {
  const location = useLocation();
  const { signOut, user } = useAuth();

  return (
    <aside className="w-64 glass border-r border-white/10 h-screen fixed left-0 top-0 flex flex-col p-4 z-50">
      <div className="flex items-center gap-3 px-2 mb-10 mt-2">
        <img src={logoWhite} alt="BrokerVision" className="h-8 w-auto" />
      </div>

      <nav className="flex-1 min-h-0 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                isActive 
                  ? "bg-bv-green/10 text-bv-green border border-bv-green/20" 
                  : "text-bv-white-ghost hover:text-bv-white hover:bg-white/5"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-bv-green" : "group-hover:text-white")} />
              <span className="font-medium">{item.officialName}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 pt-4 border-t border-white/5">
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white transition-all",
            location.pathname === '/settings' && "text-primary-400 bg-primary-600/10"
          )}
        >
          <Settings size={20} />
          <span className="font-medium">Configurações</span>
        </Link>
        
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-all w-full text-left"
        >
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>

        <div className="flex items-center gap-3 px-2 py-3 bg-white/5 rounded-xl border border-white/5">
          <div className="w-8 h-8 rounded-full bg-bv-green flex items-center justify-center text-xs font-bold text-black">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-bv-white truncate">{user?.email}</p>
            <p className="text-[10px] text-bv-green uppercase tracking-wider font-bold">SOVEREIGN PRO</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
