import { useState } from 'react';
import { 
  Calculator, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  ArrowRight,
  PieChart as PieIcon,
  Download,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

export default function FinancialCalculator() {
  const [formData, setFormData] = useState({
    propertyValue: 500000,
    downPayment: 100000,
    interestRate: 10.5,
    termYears: 30
  });

  const [results, setResults] = useState(null);

  const calculateFinancing = (e) => {
    e.preventDefault();
    
    const principal = formData.propertyValue - formData.downPayment;
    const monthlyRate = (formData.interestRate / 100) / 12;
    const numberOfPayments = formData.termYears * 12;
    
    // Price Table Formula: M = P * [i(1+i)^n] / [(1+i)^n - 1]
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
    const totalPaid = monthlyPayment * numberOfPayments;
    const totalInterest = totalPaid - principal;

    setResults({
      monthlyPayment,
      totalPaid,
      totalInterest,
      principal
    });
    
    toast.success('Simulação concluída!');
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight">Calculadora de Fluxo</h1>
          <p className="text-gray-400">Simule financiamentos e fluxos de pagamento para seus clientes</p>
        </div>
        <button className="btn btn-outline h-12 gap-2">
          <Download size={18} />
          Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calculator size={20} className="text-primary-500" />
              Parâmetros
            </h3>
            
            <form onSubmit={calculateFinancing} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Valor do Imóvel</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                  <input 
                    type="number"
                    className="input-field pl-12"
                    value={formData.propertyValue}
                    onChange={e => setFormData({...formData, propertyValue: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Entrada</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                  <input 
                    type="number"
                    className="input-field pl-12"
                    value={formData.downPayment}
                    onChange={e => setFormData({...formData, downPayment: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Taxa Anual (%)</label>
                  <input 
                    type="number"
                    step="0.01"
                    className="input-field"
                    value={formData.interestRate}
                    onChange={e => setFormData({...formData, interestRate: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Prazo (Anos)</label>
                  <input 
                    type="number"
                    className="input-field"
                    value={formData.termYears}
                    onChange={e => setFormData({...formData, termYears: Number(e.target.value)})}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full h-12 mt-4">
                Calcular Fluxo
              </button>
            </form>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-2">
          {!results ? (
            <div className="glass-card h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-dashed border-2 border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 mb-4">
                <TrendingDown size={32} />
              </div>
              <h3 className="text-xl font-medium mb-2">Simulação Pronta para Iniciar</h3>
              <p className="text-gray-400 max-w-xs">Insira os valores e clique em calcular para visualizar o detalhamento das parcelas.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in zoom-in duration-500">
              {/* Main Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card p-6 bg-primary-600/5 border-primary-600/20">
                  <p className="text-sm text-primary-400 mb-1">Parcela Mensal Estimada</p>
                  <h2 className="text-4xl font-display font-bold text-white">
                    {formatCurrency(results.monthlyPayment)}
                  </h2>
                </div>
                <div className="glass-card p-6">
                  <p className="text-sm text-gray-400 mb-1">Total a ser Pago</p>
                  <h2 className="text-4xl font-display font-bold text-white">
                    {formatCurrency(results.totalPaid)}
                  </h2>
                </div>
              </div>

              {/* Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                    <DollarSign size={14} /> VALOR FINANCIADO
                  </div>
                  <p className="text-lg font-bold">{formatCurrency(results.principal)}</p>
                </div>
                <div className="glass p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-orange-400 text-xs mb-2">
                    <TrendingDown size={14} /> TOTAL DE JUROS
                  </div>
                  <p className="text-lg font-bold">{formatCurrency(results.totalInterest)}</p>
                </div>
                <div className="glass p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                    <Calendar size={14} /> TOTAL DE PARCELAS
                  </div>
                  <p className="text-lg font-bold">{formData.termYears * 12} meses</p>
                </div>
              </div>

              {/* Insights Card */}
              <div className="glass p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                <div className="flex items-center gap-2 text-primary-400 font-bold mb-4">
                  <Sparkles size={20} />
                  INSIGHT DE VIABILIDADE
                </div>
                <p className="text-gray-300 leading-relaxed italic">
                  "Com base no valor da parcela de {formatCurrency(results.monthlyPayment)}, o cliente ideal deve possuir uma renda familiar bruta mínima aproximada de {formatCurrency(results.monthlyPayment * 3.33)}, considerando o comprometimento máximo de 30% permitido pela maioria dos bancos."
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
