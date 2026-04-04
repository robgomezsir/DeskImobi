import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calculator, 
  MessageSquare, 
  Settings, 
  LogOut,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'CRM Clientes', icon: Users, path: '/crm' },
  { name: 'Calculadora', icon: Calculator, path: '/calculadora' },
  { name: 'Gerador IA', icon: MessageSquare, path: '/mensagens' },
  { name: 'Insights', icon: TrendingUp, path: '/insights' },
];

export function Sidebar() {
  const location = useLocation();
  const { signOut, user } = useAuth();

  return (
    <aside className="w-64 glass border-r h-screen fixed left-0 top-0 flex flex-col p-4 z-50">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30">
          <Briefcase className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-display font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          ImobiFlow<span className="text-primary-500">AI</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group",
                isActive 
                  ? "bg-primary-600/10 text-primary-400 border border-primary-600/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-primary-400" : "group-hover:text-white")} />
              <span className="font-medium">{item.name}</span>
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

        <div className="flex items-center gap-3 px-2 py-3 bg-white/5 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-xs font-bold font-display">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.email}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Plano Pro</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
