import { motion } from 'framer-motion';
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign,
  PieChart as PieChartIcon,
  Calendar,
  Plus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { toast } from 'sonner';
import { LEGACY_BV_MODULES } from '../../constants/brandModules';
import { useRegisterAppToolbar } from '../../contexts/AppToolbarContext';
import { useRegisterAppFab } from '../../contexts/AppFabContext';
import { PageToolbar } from '../../components/layout/PageToolbar';
import { ModuleFabButton } from '../../components/layout/ModuleFabButton';

const finance = LEGACY_BV_MODULES.finance;

const COLORS = ['#af9f82', '#FFFFFF', '#9A9A9A', '#333333'];

const data = [
  { name: 'Jan', comissao: 4000 },
  { name: 'Fev', comissao: 3000 },
  { name: 'Mar', comissao: 2000 },
  { name: 'Abr', comissao: 2780 },
  { name: 'Mai', comissao: 1890 },
  { name: 'Jun', comissao: 2390 },
];

const commissions = [
  { id: 1, property: 'Condomínio Solar', value: 12500, date: '12/06/2025', status: 'Recebido' },
  { id: 2, property: 'Residencial Elite', value: 8900, date: '15/06/2025', status: 'Pendente' },
  { id: 3, property: 'Edifício Infinity', value: 15400, date: '20/06/2025', status: 'Processando' },
];

export default function Finance() {
  useRegisterAppToolbar(
    () => (
      <PageToolbar title={finance.officialName} />
    ),
    []
  );

  useRegisterAppFab(
    () => (
      <ModuleFabButton
        aria-label="Novo lançamento"
        title="Novo lançamento"
        onClick={() => toast.info('Em breve')}
      >
        <Plus size={24} strokeWidth={2} />
      </ModuleFabButton>
    ),
    []
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-card-3xl border-bv-green/20 bg-bv-green/5 glass p-card-5 sm:p-card-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-card-2xl bg-bv-green/10 text-bv-green">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-sm font-medium text-bv-muted">Comissão total bruta</p>
          <p className="mt-1 font-display text-3xl font-bold text-bv-text sm:text-4xl">R$ 45.320</p>
          <div className="mt-4 flex items-center gap-1 text-[10px] text-bv-green font-bold">
            <ArrowUpRight size={12} /> +18.5% em relação ao mês anterior
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-card-3xl glass p-card-5 sm:p-card-6"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-card-2xl bg-bv-surface-muted p-3 text-bv-text">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-sm font-medium text-bv-muted">A receber</p>
          <p className="mt-1 font-display text-3xl font-bold text-bv-text sm:text-4xl">R$ 12.400</p>
          <p className="mt-4 text-[10px] font-bold text-bv-muted">3 pendências ativas</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-card-3xl glass p-card-5 sm:p-card-6"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-card-2xl bg-bv-surface-muted p-3 text-bv-text">
              <Calendar size={24} />
            </div>
          </div>
          <p className="text-sm font-medium text-bv-muted">Previsão próximo mês</p>
          <p className="mt-1 font-display text-3xl font-bold text-bv-text sm:text-4xl">R$ 28.500</p>
          <p className="mt-4 text-[10px] font-bold text-bv-muted">Baseado no pipeline</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-card-3xl glass p-card-4 sm:p-card-6 lg:p-card-8">
          <div className="mb-6 flex items-center justify-between sm:mb-8">
            <div>
              <h3 className="text-xl font-display font-bold">Fluxo de comissões</h3>
              <p className="text-sm text-bv-muted">Histórico de rendimentos mensais</p>
            </div>
          </div>
          <div className="h-[240px] w-full min-h-0 sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9A9A9A', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9A9A9A', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.03)'}}
                  contentStyle={{ backgroundColor: '#141414', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}
                  itemStyle={{color: '#fff'}}
                />
                <Bar isAnimationActive={false} dataKey="comissao" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 5 ? '#af9f82' : 'rgba(255,255,255,0.1)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-card-3xl glass p-card-4 sm:p-card-6 lg:p-card-8">
          <h3 className="mb-4 font-display text-lg font-bold sm:mb-6 sm:text-xl">Lançamentos recentes</h3>
          <div className="space-y-3 sm:space-y-4">
            {commissions.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-card-2xl border border-[var(--line-subtle)] bg-bv-surface-muted p-card-3 transition-colors hover:bg-bv-surface-strong sm:flex-row sm:items-center sm:justify-between sm:p-card-4"
              >
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <div className={`shrink-0 rounded-xl bg-bv-surface-muted p-2 ${item.status === 'Recebido' ? 'text-bv-green' : 'text-bv-muted'}`}>
                    {item.status === 'Recebido' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-bv-text">{item.property}</p>
                    <p className="text-xs text-bv-muted">{item.date}</p>
                  </div>
                </div>
                <div className="shrink-0 text-left sm:text-right">
                  <p className="font-bold text-bv-text">R$ {item.value.toLocaleString()}</p>
                  <p
                    className={`text-[10px] font-bold ${
                      item.status === 'Recebido' ? 'text-bv-green' : 'text-bv-muted'
                    }`}
                  >
                    {item.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 text-sm text-bv-muted hover:text-bv-text transition-colors">
            Ver extrato completo
          </button>
        </div>
      </div>
    </div>
  );
}
