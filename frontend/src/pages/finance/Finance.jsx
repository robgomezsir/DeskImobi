import { motion } from 'framer-motion';
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign,
  PieChart as PieChartIcon,
  Calendar
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
import { BV_MODULES } from '../../constants/brandModules';
import { useRegisterAppToolbar } from '../../contexts/AppToolbarContext';
import { PageToolbar } from '../../components/layout/PageToolbar';

const finance = BV_MODULES.finance;

const COLORS = ['#00E87A', '#FFFFFF', '#9A9A9A', '#333333'];

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
      <PageToolbar
        title={finance.officialName}
        subtitle={finance.tagline}
        rowAlign="end"
        actions={
          <button type="button" className="btn btn-primary h-11 px-5 font-bold text-black sm:shrink-0">
            Novo Lançamento
          </button>
        }
      />
    ),
    []
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-3xl border-bv-green/20 bg-bv-green/5"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-bv-green/10 text-bv-green">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-bv-muted text-sm font-medium">Comissão Total Bruta</p>
          <p className="text-4xl font-display font-bold mt-1 text-bv-text">R$ 45.320</p>
          <div className="mt-4 flex items-center gap-1 text-[10px] text-bv-green font-bold">
            <ArrowUpRight size={12} /> +18.5% em relação ao mês anterior
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 rounded-3xl"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-bv-surface-muted text-bv-text">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-bv-muted text-sm font-medium">A Receber</p>
          <p className="text-4xl font-display font-bold mt-1 text-bv-text">R$ 12.400</p>
          <p className="mt-4 text-[10px] text-bv-muted uppercase tracking-wider font-bold">3 Pendências ativas</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-6 rounded-3xl"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-bv-surface-muted text-bv-text">
              <Calendar size={24} />
            </div>
          </div>
          <p className="text-bv-muted text-sm font-medium">Previsão Próximo Mês</p>
          <p className="text-4xl font-display font-bold mt-1 text-bv-text">R$ 28.500</p>
          <p className="mt-4 text-[10px] text-bv-muted uppercase tracking-wider font-bold">Baseado no Pipeline</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-display font-bold">Fluxo de Comissões</h3>
              <p className="text-sm text-bv-muted">Histórico de rendimentos mensais</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9A9A9A', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9A9A9A', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.03)'}}
                  contentStyle={{backgroundColor: '#000', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)'}}
                  itemStyle={{color: '#fff'}}
                />
                <Bar dataKey="comissao" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 5 ? '#00E87A' : 'rgba(255,255,255,0.1)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl">
          <h3 className="text-xl font-display font-bold mb-6">Lançamentos Recentes</h3>
          <div className="space-y-4">
            {commissions.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-bv-surface-muted rounded-2xl border border-[var(--line-subtle)] hover:bg-bv-surface-strong transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl bg-bv-surface-muted ${item.status === 'Recebido' ? 'text-bv-green' : 'text-bv-muted'}`}>
                    {item.status === 'Recebido' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-bv-text">{item.property}</p>
                    <p className="text-xs text-bv-muted">{item.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-bv-text">R$ {item.value.toLocaleString()}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${
                    item.status === 'Recebido' ? 'text-bv-green' : 'text-bv-muted'
                  }`}>{item.status}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 text-sm text-bv-muted hover:text-bv-text transition-colors">
            Ver Extrato Completo
          </button>
        </div>
      </div>
    </div>
  );
}
