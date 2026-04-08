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

  const cards = [
    { title: 'Base de Clientes', value: metrics.totalClients, icon: Users, color: 'text-white', bg: 'bg-white/5' },
    { title: 'Novos Leads (7d)', value: metrics.newLeads, icon: Target, color: 'text-bv-green', bg: 'bg-bv-green/10' },
    { title: 'Em Negociação', value: metrics.activeNegotiations, icon: Activity, color: 'text-white', bg: 'bg-white/5' },
    { title: 'Contratos Fechados', value: metrics.closedDeals, icon: CheckCircle2, color: 'text-bv-green', bg: 'bg-bv-green/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-white">BV Dashboard</h1>
          <p className="text-bv-white-ghost">Bem-vindo ao cockpit. Sua inteligência soberana está ativa.</p>
        </div>
        <div className="hidden md:flex gap-2">
          <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-sm text-gray-400">
            <Activity size={16} className="text-primary-500" />
            Tempo Real: Ativo
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl group hover:border-primary-500/30 transition-all hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${card.bg} ${card.color}`}>
                <card.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full flex items-center gap-1">
                +12% <ArrowUpRight size={10} />
              </span>
            </div>
            <p className="text-gray-400 text-sm font-medium">{card.title}</p>
            <p className="text-4xl font-display font-bold mt-1">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass p-8 rounded-3xl h-[400px] flex flex-col"
        >
          {/* ... Chart Content ... */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-display font-bold">Desempenho de Vendas</h3>
              <p className="text-sm text-gray-500">Leads captados vs Vendas concluídas</p>
            </div>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs outline-none">
              <option>Últimos 6 meses</option>
              <option>Últimos 12 meses</option>
            </select>
          </div>
          <div className="flex-1 w-full">
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
                    contentStyle={{backgroundColor: '#000', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)'}}
                    itemStyle={{color: '#fff'}}
                  />
                  <Area type="monotone" dataKey="leads" stroke="#00E87A" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                  <Area type="monotone" dataKey="sales" stroke="#ffffff" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0} />
                </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass p-8 rounded-3xl flex flex-col"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary-600/10 text-primary-400 rounded-xl">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-xl font-display font-bold">Insights IA</h3>
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
              <p className="text-sm leading-relaxed text-bv-white">
                Você tem <span className="text-bv-green font-bold">3 clientes</span> estagnados há mais de 10 dias.
              </p>
              <button className="btn btn-primary w-full py-2 h-10 text-xs text-black font-bold">
                BV Flow: Reativar Agora
              </button>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
              <p className="text-sm leading-relaxed text-gray-400 italic">
                "Sua taxa de conversão aumentou 5% este mês após começar a usar os scripts de objeção personalizados."
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <button className="flex items-center justify-between w-full text-gray-400 hover:text-white transition-colors group">
              <span className="text-sm font-medium">Ver todos os insights</span>
              <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
