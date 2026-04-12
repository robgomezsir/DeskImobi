import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Search,
  ChevronRight,
  Info,
  MapPin,
  Clock,
  Zap,
  Star,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BV_MODULES } from '../../constants/brandModules';
import { useRegisterAppToolbar } from '../../contexts/AppToolbarContext';
import { PageToolbar } from '../../components/layout/PageToolbar';
import { BvModuleCanvas } from '../../components/layout/BvModuleCanvas';
import { useGlassBackdropStyle } from '../../hooks/useGlassBackdropStyle';

const insights = BV_MODULES.insights;

const marketData = [
  { month: 'Jan', price: 8200 },
  { month: 'Fev', price: 8400 },
  { month: 'Mar', price: 8350 },
  { month: 'Abr', price: 8700 },
  { month: 'Mai', price: 8950 },
  { month: 'Jun', price: 9200 },
];

export default function Insights() {
  const glassBackdropStyle = useGlassBackdropStyle();
  const [regionQuery, setRegionQuery] = useState('');

  useRegisterAppToolbar(
    () => <PageToolbar title={insights.officialName} />,
    []
  );

  return (
    <BvModuleCanvas innerClassName="relative z-10 space-y-8 px-4 pb-1 animate-in fade-in duration-700 sm:px-6 lg:px-8">
      <div className="glass bv-card-hover rounded-card-3xl p-card-4 sm:p-card-6" style={glassBackdropStyle}>
        <label className="sr-only" htmlFor="insights-region-search">
          Analisar bairro ou região
        </label>
        <div className="group relative min-w-0">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-bv-muted transition-colors group-focus-within:text-bv-green"
            size={18}
            aria-hidden
          />
          <input
            id="insights-region-search"
            type="text"
            placeholder="Analisar bairro ou região..."
            value={regionQuery}
            onChange={(e) => setRegionQuery(e.target.value)}
            className="input-field h-12 pl-12"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass bv-card-hover rounded-card-3xl p-card-4 sm:p-card-6 lg:col-span-2 lg:p-card-8"
          style={glassBackdropStyle}
        >
          <div className="mb-4 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h3 className="flex flex-wrap items-center gap-2 text-lg font-display font-bold sm:text-xl">
                Tendência de preço m²
                <div className="cursor-help rounded-full bg-bv-surface-muted p-1 text-bv-muted">
                  <Info size={12} />
                </div>
              </h3>
              <p className="text-sm text-bv-muted">Valor médio ponderado em São Paulo (Capital)</p>
            </div>
            <div className="shrink-0 text-left sm:text-right">
              <p className="font-display text-xl font-bold text-bv-green sm:text-2xl">R$ 9.200</p>
              <p className="text-[10px] font-bold text-bv-green">+2.4% este mês</p>
            </div>
          </div>

          <div className="mt-2 h-[240px] w-full min-h-0 sm:mt-4 sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marketData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#af9f82" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#af9f82" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff03" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9A9A9A', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9A9A9A', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141414',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area
                  isAnimationActive={false}
                  type="monotone"
                  dataKey="price"
                  stroke="#af9f82"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass bv-card-hover flex flex-col rounded-card-3xl p-card-4 sm:p-card-6 lg:p-card-8"
          style={glassBackdropStyle}
        >
          <div className="mb-6 flex items-center gap-3 sm:mb-8">
            <div className="rounded-xl bg-bv-green/10 p-2 text-bv-green">
              <Star size={20} />
            </div>
            <h3 className="text-xl font-display font-bold">Oportunidades IA</h3>
          </div>

          <div className="flex flex-1 flex-col space-y-4">
            <div className="group rounded-card-2xl border border-[var(--line-subtle)] bg-bv-surface-muted p-card-5 transition-all hover:border-bv-green/30">
              <div className="mb-2 flex items-start justify-between">
                <span className="rounded-full bg-bv-green/10 px-2 py-0.5 text-[10px] font-bold text-bv-green">
                  Alta demanda
                </span>
                <Clock size={14} className="text-bv-muted" />
              </div>
              <h4 className="mb-1 font-bold text-bv-text">Studios no Itaim Bibi</h4>
              <p className="text-xs leading-relaxed text-bv-muted">
                A procura por aluguel subiu 15% nos últimos 14 dias. Ideal para investidores de yield recorrente.
              </p>
              <button
                type="button"
                className="mt-4 flex items-center gap-1 text-xs font-bold text-bv-green transition-all group-hover:gap-2"
              >
                Ver Análise Completa <ChevronRight size={14} />
              </button>
            </div>

            <div className="group rounded-card-2xl border border-[var(--line-subtle)] bg-bv-surface-muted p-card-5 transition-all hover:border-bv-green/30">
              <div className="mb-2 flex items-start justify-between">
                <span className="rounded-full bg-bv-surface-strong px-2 py-0.5 text-[10px] font-bold text-bv-text">
                  Preço crítico
                </span>
                <MapPin size={14} className="text-bv-muted" />
              </div>
              <h4 className="mb-1 font-bold text-bv-text">Pinheiros: Queda no ticket</h4>
              <p className="text-xs leading-relaxed text-bv-muted">
                Residuais de revenda abaixo do m² médio. Momento de &quot;buy-low&quot; para estoque estratégico.
              </p>
              <button
                type="button"
                className="mt-4 flex items-center gap-1 text-xs font-bold text-bv-green transition-all group-hover:gap-2"
              >
                Identificar leads <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div className="mt-8 rounded-card-2xl border border-bv-green/10 bg-bv-green/5 p-card-4">
            <div className="mb-2 flex items-center gap-2">
              <Zap size={16} className="text-bv-green" />
              <span className="text-xs font-bold text-bv-text">Próximo Insight em:</span>
            </div>
            <div className="font-display text-2xl font-bold tabular-nums tracking-tight text-bv-green">02:14:55</div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { label: 'Sentimento de mercado', value: 'Otimista', color: 'text-bv-green' },
          { label: 'Taxa de vacância média', value: '4.2%', color: 'text-bv-text' },
          { label: 'Lead quality score', value: 'A+', color: 'text-bv-green' },
        ].map((stat, i) => (
          <div
            key={i}
            className="glass bv-card-hover group flex cursor-default items-center justify-between rounded-card-3xl p-card-4 sm:p-card-6"
            style={glassBackdropStyle}
          >
            <div className="min-w-0">
              <p className="mb-1 text-[10px] font-bold text-bv-muted">{stat.label}</p>
              <p className={`font-display text-xl font-bold sm:text-2xl ${stat.color}`}>{stat.value}</p>
            </div>
            <div className="rounded-lg bg-bv-surface-muted p-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
              <TrendingUp size={16} />
            </div>
          </div>
        ))}
      </div>
    </BvModuleCanvas>
  );
}
