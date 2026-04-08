import { motion } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  Search, 
  ChevronRight, 
  Info,
  MapPin,
  Clock,
  Zap,
  Star
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { BV_MODULES } from '../../constants/brandModules';
import { useRegisterAppToolbar } from '../../contexts/AppToolbarContext';
import { PageToolbar } from '../../components/layout/PageToolbar';

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
  useRegisterAppToolbar(
    () => (
      <PageToolbar
        stackBreakpoint="lg"
        rowAlign="end"
        title={insights.officialName}
        subtitle={insights.tagline}
        kicker={
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-bv-green shadow-glow" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-bv-green">IA Ativa • Sovereign Analyst</span>
          </div>
        }
        actions={
          <div className="relative w-full shrink-0 lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-bv-muted" size={18} />
            <input
              type="text"
              placeholder="Analisar bairro ou região..."
              className="h-11 w-full rounded-xl border border-[var(--line)] bg-bv-surface-muted pl-10 pr-4 text-sm text-bv-text outline-none transition-all placeholder:text-bv-muted focus:border-bv-green/50"
            />
          </div>
        }
      />
    ),
    []
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass p-8 rounded-3xl"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-display font-bold flex items-center gap-2">
                Tendência de Preço m²
                <div className="p-1 rounded-full bg-bv-surface-muted text-bv-muted cursor-help">
                  <Info size={12} />
                </div>
              </h3>
              <p className="text-sm text-bv-muted">Valor médio ponderado em São Paulo (Capital)</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-display font-bold text-bv-green">R$ 9.200</p>
              <p className="text-[10px] text-bv-green font-bold uppercase tracking-wider">+2.4% este mês</p>
            </div>
          </div>

          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marketData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E87A" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00E87A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff03" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9A9A9A', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9A9A9A', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#000', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)'}}
                  itemStyle={{color: '#fff'}}
                />
                <Area type="monotone" dataKey="price" stroke="#00E87A" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-8 rounded-3xl flex flex-col"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-bv-green/10 text-bv-green rounded-xl">
              <Star size={20} />
            </div>
            <h3 className="text-xl font-display font-bold">Oportunidades IA</h3>
          </div>
          
          <div className="space-y-4 flex-1">
            <div className="p-5 bg-bv-surface-muted rounded-2xl border border-[var(--line-subtle)] hover:border-bv-green/30 transition-all group">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] bg-bv-green/10 text-bv-green px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Alta Demanda</span>
                <Clock size={14} className="text-bv-muted" />
              </div>
              <h4 className="font-bold text-bv-text mb-1">Studios no Itaim Bibi</h4>
              <p className="text-xs text-bv-muted leading-relaxed">
                A procura por aluguel subiu 15% nos últimos 14 dias. Ideal para investidores de yield recorrente.
              </p>
              <button className="mt-4 flex items-center gap-1 text-xs text-bv-green font-bold group-hover:gap-2 transition-all">
                Ver Análise Completa <ChevronRight size={14} />
              </button>
            </div>

            <div className="p-5 bg-bv-surface-muted rounded-2xl border border-[var(--line-subtle)] hover:border-bv-green/30 transition-all group">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] bg-bv-surface-strong text-bv-text px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Preço Crítico</span>
                <MapPin size={14} className="text-bv-muted" />
              </div>
              <h4 className="font-bold text-bv-text mb-1">Pinheiros: Queda no ticket</h4>
              <p className="text-xs text-bv-muted leading-relaxed">
                Residuais de revenda abaixo do m² médio. Momento de "buy-low" para estoque estratégico.
              </p>
              <button className="mt-4 flex items-center gap-1 text-xs text-bv-green font-bold group-hover:gap-2 transition-all">
                Identificar leads <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-bv-green/5 rounded-2xl border border-bv-green/10">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-bv-green" />
              <span className="text-xs font-bold text-bv-text">Próximo Insight em:</span>
            </div>
            <div className="text-2xl font-display font-bold text-bv-green tracking-widest uppercase">
              02:14:55
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Sentimento de Mercado', value: 'Otimista', color: 'text-bv-green' },
          { label: 'Taxa de Vacância Avg', value: '4.2%', color: 'text-bv-text' },
          { label: 'Lead Quality Score', value: 'A+', color: 'text-bv-green' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl flex justify-between items-center group cursor-default">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-bv-muted font-bold mb-1">{stat.label}</p>
              <p className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <div className="p-2 bg-bv-surface-muted rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <TrendingUp size={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
