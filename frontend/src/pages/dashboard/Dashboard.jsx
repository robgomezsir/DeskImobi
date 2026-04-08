import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import {
  Users,
  Sprout,
  Hourglass,
  CheckCircle2,
  Lightbulb,
  ArrowUpRight,
} from 'lucide-react';
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { BV_MODULES } from '../../constants/brandModules';
import { useRegisterAppToolbar } from '../../contexts/AppToolbarContext';
import { PageToolbar } from '../../components/layout/PageToolbar';

const dashboard = BV_MODULES.dashboard;

const data = [
  { name: 'Jan', leads: 400, sales: 24 },
  { name: 'Fev', leads: 300, sales: 13 },
  { name: 'Mar', leads: 200, sales: 98 },
  { name: 'Abr', leads: 278, sales: 39 },
  { name: 'Mai', leads: 189, sales: 48 },
  { name: 'Jun', leads: 239, sales: 38 },
];

const ACCENT = '#00F5A0';

/** Fundo artístico do Dashboard (brand) — ficheiro em `public/dashboard-bg.jpg` */
const DASHBOARD_BG_URL = '/dashboard-bg.jpg';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalClients: 0,
    newLeads: 0,
    activeNegotiations: 0,
    closedDeals: 0,
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
        newLeads: total ? Math.floor(total * 0.3) : 0,
        activeNegotiations: nego || 0,
        closedDeals: closed || 0,
      });
    };

    fetchMetrics();
  }, [user]);

  useRegisterAppToolbar(
    () => (
      <PageToolbar title={dashboard.officialName} subtitle={dashboard.tagline} />
    ),
    []
  );

  const cards = [
    { title: 'BASE DE LEADS', sub: 'Base total', value: metrics.totalClients, icon: Users },
    { title: 'NOVOS LEADS', sub: 'Últimos 7 dias', value: metrics.newLeads, icon: Sprout },
    { title: 'EM NEGOCIAÇÃO', sub: 'Total', value: metrics.activeNegotiations, icon: Hourglass },
    { title: 'CONTRATOS FECHADOS', sub: 'Total', value: metrics.closedDeals, icon: CheckCircle2 },
  ];

  return (
    <div
      className="relative -mx-4 overflow-hidden sm:-mx-6 lg:-mx-8"
      data-bv-dashboard-canvas
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${DASHBOARD_BG_URL})` }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/25 via-transparent to-black/50"
        aria-hidden
      />
      <div className="relative z-10 space-y-8 px-4 pb-1 animate-in fade-in duration-700 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass bv-card-hover rounded-2xl p-5 sm:rounded-2xl sm:p-6"
          >
            <div className="mb-3 flex items-start gap-3">
              <card.icon size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-bv-text" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-bv-text">{card.title}</p>
                <p className="text-xs text-bv-muted">{card.sub}</p>
              </div>
            </div>
            <p className="font-display text-3xl font-bold tabular-nums text-metric-value sm:text-4xl">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass flex min-h-[300px] flex-col rounded-2xl p-4 sm:min-h-[360px] sm:rounded-2xl sm:p-6 lg:col-span-2 lg:h-[400px] lg:min-h-0 lg:p-8"
        >
          <div className="mb-4 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-bv-text">Desempenho em vendas</h3>
              <p className="mt-1 text-sm text-bv-muted">Leads captados vs vendas concluídas</p>
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
                    <stop offset="5%" stopColor={ACCENT} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9A9A9A', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9A9A9A', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#000', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area
                  isAnimationActive={false}
                  type="monotone"
                  dataKey="leads"
                  stroke={ACCENT}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorLeads)"
                />
                <Area
                  isAnimationActive={false}
                  type="monotone"
                  dataKey="sales"
                  stroke="#ffffff"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass flex flex-col rounded-2xl p-4 sm:rounded-2xl sm:p-6 lg:p-8"
        >
          <div className="mb-6 flex items-center gap-3 sm:mb-8">
            <Lightbulb size={18} strokeWidth={2} className="shrink-0 text-bv-text" />
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-bv-text">Broker Insights</h3>
          </div>

          <div className="flex flex-1 flex-col space-y-6">
            <div className="space-y-3 rounded-2xl border border-[var(--line-subtle)] bg-bv-surface-muted p-4">
              <p className="text-sm leading-relaxed text-bv-text">
                Você tem <span className="font-bold text-bv-green">3 clientes</span> estagnados há mais de 10 dias.
              </p>
              <button type="button" className="btn btn-primary h-10 w-full text-xs font-bold text-black">
                Reativar follow-up
              </button>
            </div>

            <div className="rounded-2xl border border-[var(--line-subtle)] bg-bv-surface-muted p-4">
              <p className="text-sm italic leading-relaxed text-bv-muted">
                &ldquo;Sua taxa de conversão aumentou 5% este mês após começar a usar os scripts de objeção
                personalizados.&rdquo;
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-[var(--line-subtle)] pt-6">
            <button
              type="button"
              className="group flex w-full items-center justify-between text-bv-muted transition-colors hover:text-bv-text"
            >
              <span className="text-sm font-medium">Ver todos os insights</span>
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  );
}
