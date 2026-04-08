import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  Target, 
  CheckCircle2, 
  TrendingUp, 
  MessageSquare, 
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { BV_MODULES } from '../../constants/brandModules';
import { useRegisterAppToolbar } from '../../contexts/AppToolbarContext';
import { PageToolbar } from '../../components/layout/PageToolbar';

const dashboard = BV_MODULES.dashboard;
const flowModule = BV_MODULES.flow;

const data = [
  { name: 'Jan', leads: 400, sales: 24 },
  { name: 'Fev', leads: 300, sales: 13 },
  { name: 'Mar', leads: 200, sales: 98 },
  { name: 'Abr', leads: 278, sales: 39 },
  { name: 'Mai', leads: 189, sales: 48 },
  { name: 'Jun', leads: 239, sales: 38 },
];

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalClients: 0,
    newLeads: 0,
    activeNegotiations: 0,
    closedDeals: 0
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchMetrics = async () => {
      const { count: total } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .is('deleted_at', null);

      const { count: nego } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'negotiation');

      const { count: closed } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'closed');

      setMetrics({
        totalClients: total || 0,
        newLeads: total ? Math.floor(total * 0.3) : 0, // Mocked for now
        activeNegotiations: nego || 0,
        closedDeals: closed || 0
      });
    };

    fetchMetrics();
  }, [user]);

  useRegisterAppToolbar(
    () => (
      <PageToolbar
        title={dashboard.officialName}
        subtitle={dashboard.tagline}
        actions={
          <div className="hidden shrink-0 gap-2 sm:flex">
            <div className="glass flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-bv-muted">
              <Activity size={16} className="text-bv-green" />
              Tempo Real: Ativo
            </div>
          </div>
        }
      />
    ),
    []
  );

  const cards = [
    { title: 'Base de Clientes', value: metrics.totalClients, icon: Users, color: 'text-bv-text', bg: 'bg-bv-surface-muted' },
    { title: 'Novos Leads (7d)', value: metrics.newLeads, icon: Target, color: 'text-bv-green', bg: 'bg-bv-green/10' },
    { title: 'Em Negociação', value: metrics.activeNegotiations, icon: Activity, color: 'text-bv-text', bg: 'bg-bv-surface-muted' },
    { title: 'Contratos Fechados', value: metrics.closedDeals, icon: CheckCircle2, color: 'text-bv-green', bg: 'bg-bv-green/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5 transition-all group hover:-translate-y-1 hover:border-bv-green/30 sm:rounded-3xl sm:p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${card.bg} ${card.color}`}>
                <card.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-bv-green bg-bv-green/10 px-2 py-1 rounded-full flex items-center gap-1">
                +12% <ArrowUpRight size={10} />
              </span>
            </div>
            <p className="text-bv-muted text-sm font-medium">{card.title}</p>
            <p className="mt-1 font-display text-3xl font-bold sm:text-4xl">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex min-h-[300px] flex-col rounded-2xl glass p-4 sm:min-h-[360px] sm:rounded-3xl sm:p-6 lg:col-span-2 lg:h-[400px] lg:min-h-0 lg:p-8"
        >
          {/* ... Chart Content ... */}
          <div className="mb-4 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h3 className="text-lg font-display font-bold sm:text-xl">Desempenho de Vendas</h3>
              <p className="text-sm text-bv-muted">Leads captados vs Vendas concluídas</p>
            </div>
            <select className="w-full shrink-0 rounded-lg border border-[var(--line)] bg-bv-surface-muted px-3 py-2 text-xs outline-none sm:w-auto sm:py-1">
              <option>Últimos 6 meses</option>
              <option>Últimos 12 meses</option>
            </select>
          </div>
          <div className="min-h-[220px] w-full flex-1 sm:min-h-[240px] lg:min-h-0">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E87A" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00E87A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9A9A9A', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9A9A9A', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area isAnimationActive={false} type="monotone" dataKey="leads" stroke="#00E87A" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                  <Area isAnimationActive={false} type="monotone" dataKey="sales" stroke="#ffffff" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0} />
                </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col rounded-2xl glass p-4 sm:rounded-3xl sm:p-6 lg:p-8"
        >
          <div className="mb-6 flex items-center gap-3 sm:mb-8">
            <div className="p-2 bg-bv-green/10 text-bv-green rounded-xl">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-xl font-display font-bold">Insights IA</h3>
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="p-4 bg-bv-surface-muted rounded-2xl border border-[var(--line-subtle)] space-y-3">
              <p className="text-sm leading-relaxed text-bv-text">
                Você tem <span className="text-bv-green font-bold">3 clientes</span> estagnados há mais de 10 dias.
              </p>
              <button className="btn btn-primary w-full py-2 h-10 text-xs text-black font-bold">
                {flowModule.officialName}: Reativar Agora
              </button>
            </div>

            <div className="p-4 bg-bv-surface-muted rounded-2xl border border-[var(--line-subtle)] space-y-3">
              <p className="text-sm leading-relaxed text-bv-muted italic">
                "Sua taxa de conversão aumentou 5% este mês após começar a usar os scripts de objeção personalizados."
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--line-subtle)]">
            <button className="flex items-center justify-between w-full text-bv-muted hover:text-bv-text transition-colors group">
              <span className="text-sm font-medium">Ver todos os insights</span>
              <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
