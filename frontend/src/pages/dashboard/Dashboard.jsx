import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  MessageSquare,
  X,
  LayoutGrid,
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
import { BvModuleCanvas } from '../../components/layout/BvModuleCanvas';
import { useGlassBackdropStyle } from '../../hooks/useGlassBackdropStyle';

const dashboard = BV_MODULES.dashboard;

const data = [
  { name: 'Jan', leads: 400, sales: 24 },
  { name: 'Fev', leads: 300, sales: 13 },
  { name: 'Mar', leads: 200, sales: 98 },
  { name: 'Abr', leads: 278, sales: 39 },
  { name: 'Mai', leads: 189, sales: 48 },
  { name: 'Jun', leads: 239, sales: 38 },
];

const ACCENT = '#af9f82';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const clientIdFromNav = location.state?.clientId;
  const [leadContext, setLeadContext] = useState(null);
  const [metrics, setMetrics] = useState({
    totalClients: 0,
    newLeads: 0,
    activeNegotiations: 0,
    closedDeals: 0,
  });
  const { user } = useAuth();
  const glassBackdropStyle = useGlassBackdropStyle({ dashboard: true });

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

  useEffect(() => {
    let cancelled = false;

    const loadLeadFromNav = async () => {
      await Promise.resolve();
      if (cancelled) return;
      if (!user?.id || !clientIdFromNav) {
        setLeadContext(null);
        return;
      }
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, phone, status, property_type')
        .eq('id', clientIdFromNav)
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .maybeSingle();

      if (cancelled) return;
      if (error || !data) {
        setLeadContext(null);
        return;
      }
      setLeadContext(data);
    };

    loadLeadFromNav();
    return () => {
      cancelled = true;
    };
  }, [user?.id, clientIdFromNav]);

  const dismissLeadContext = () => {
    navigate('/dashboard', { replace: true, state: {} });
    setLeadContext(null);
  };

  const goToMessagesWithLead = () => {
    if (!leadContext?.id) return;
    navigate('/mensagens', { state: { clientId: leadContext.id } });
  };

  const goToCrm = () => {
    navigate('/crm');
  };

  useRegisterAppToolbar(
    () => (
      <PageToolbar title={dashboard.officialName} subtitle={dashboard.tagline} />
    ),
    []
  );

  const cards = [
    { title: 'Base de leads', sub: 'Base total', value: metrics.totalClients, icon: Users },
    { title: 'Novos leads', sub: 'Últimos 7 dias', value: metrics.newLeads, icon: Sprout },
    { title: 'Em negociação', sub: 'Total', value: metrics.activeNegotiations, icon: Hourglass },
    { title: 'Contratos fechados', sub: 'Total', value: metrics.closedDeals, icon: CheckCircle2 },
  ];

  return (
    <BvModuleCanvas
      showDashboardBg
      innerClassName="relative z-10 space-y-8 px-4 pb-1 animate-in fade-in duration-700 sm:px-6 lg:px-8"
    >
      {leadContext && clientIdFromNav && (
        <div
          className="flex flex-col gap-3 rounded-card-3xl border border-bv-green/25 bg-bv-green/10 p-card-4 sm:flex-row sm:items-center sm:justify-between"
          style={glassBackdropStyle}
        >
          <div className="flex min-w-0 items-start gap-3">
            <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-bv-green" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-bv-text">Lead do CRM</p>
              <p className="truncate text-sm text-bv-muted">
                Continuar com <span className="font-medium text-bv-text">{leadContext.name}</span>
                {leadContext.phone ? ` · ${leadContext.phone}` : ''}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={goToMessagesWithLead}
              className="btn btn-primary h-10 gap-2 px-4 text-xs font-bold text-black"
            >
              <MessageSquare size={16} />
              Gerar mensagens
            </button>
            <button
              type="button"
              onClick={goToCrm}
              className="btn btn-outline h-10 gap-2 px-4 text-xs"
            >
              <LayoutGrid size={16} />
              Abrir CRM
            </button>
            <button
              type="button"
              onClick={dismissLeadContext}
              className="btn-icon h-10 w-10 text-bv-muted hover:text-bv-text"
              aria-label="Dispensar"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass bv-card-hover rounded-card-3xl p-card-5 sm:p-card-6"
            style={glassBackdropStyle}
          >
            <div className="mb-3 flex items-start gap-3">
              <card.icon size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-bv-text" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold text-bv-text">{card.title}</p>
                <p className="text-xs text-bv-muted">{card.sub}</p>
              </div>
            </div>
            <p className="font-display text-3xl font-bold tabular-nums text-metric-value sm:text-4xl">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass bv-card-hover flex min-h-[300px] flex-col rounded-card-3xl p-card-4 sm:min-h-[360px] sm:p-card-6 lg:col-span-2 lg:h-[400px] lg:min-h-0 lg:p-card-8"
          style={glassBackdropStyle}
        >
          <div className="mb-4 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-bv-text">Desempenho em vendas</h3>
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
                  contentStyle={{ backgroundColor: '#141414', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass bv-card-hover flex flex-col rounded-card-3xl p-card-4 sm:p-card-6 lg:p-card-8"
          style={glassBackdropStyle}
        >
          <div className="mb-6 flex items-center gap-3 sm:mb-8">
            <Lightbulb size={18} strokeWidth={2} className="shrink-0 text-bv-text" />
            <h3 className="text-xs font-semibold text-bv-text">Broker Insights</h3>
          </div>

          <div className="flex flex-1 flex-col space-y-6">
            <div className="space-y-3 rounded-card-2xl border border-[var(--line-subtle)] bg-bv-surface-muted p-card-4">
              <p className="text-sm leading-relaxed text-bv-text">
                Você tem <span className="font-bold text-bv-green">3 clientes</span> estagnados há mais de 10 dias.
              </p>
              <button type="button" className="btn btn-primary h-10 w-full text-xs font-bold text-black">
                Reativar follow-up
              </button>
            </div>

            <div className="rounded-card-2xl border border-[var(--line-subtle)] bg-bv-surface-muted p-card-4">
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
    </BvModuleCanvas>
  );
}
