import { useState } from 'react';
import { 
  Calculator, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  ArrowRight,
  PieChart as PieIcon,
  Download,
  Info,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { generateLeadProposalPDF } from '../../services/pdf.service';

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

  const handleExportPDF = async () => {
    if (!results) {
      toast.error('Realize uma simulação antes de exportar.');
      return;
    }
    
    try {
      toast.loading('Gerando PDF...', { id: 'pdf' });
      await generateLeadProposalPDF({}, { ...formData, ...results });
      toast.success('Proposta exportada com sucesso!', { id: 'pdf' });
    } catch (error) {
      toast.error('Erro ao gerar PDF: ' + error.message, { id: 'pdf' });
    }
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
          <h1 className="text-4xl font-display font-bold tracking-tight text-white">BV Calc</h1>
          <p className="text-bv-white-ghost">Simulação estratégica de ativos e fluxos de capital.</p>
        </div>
        <button 
          onClick={handleExportPDF}
          className="btn btn-outline h-12 gap-2"
        >
          <Download size={18} />
          Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-3xl space-y-6 border border-white/10">
            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
              <Calculator size={20} className="text-bv-green" />
              Parâmetros de Análise
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

              <button type="submit" className="btn btn-primary w-full h-12 mt-4 text-black font-bold">
                Processar Simulação
              </button>
            </form>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-2">
          {!results ? (
            <div className="glass-card h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-dashed border-2 border-white/5">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-700 mb-4">
                <TrendingDown size={32} />
              </div>
              <h3 className="text-xl font-medium mb-2 text-bv-white">Pronto para Análise</h3>
              <p className="text-bv-white-ghost max-w-xs">Defina os parâmetros ao lado para gerar o relatório de viabilidade econômica.</p>
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
              <div className="glass p-6 rounded-3xl border border-bv-green/20 bg-bv-green/5">
                <div className="flex items-center gap-2 text-bv-green font-bold mb-4">
                  <Sparkles size={20} />
                  ANÁLISE SOBERANA
                </div>
                <p className="text-bv-white-ghost leading-relaxed italic">
                  "Prosperidade requer precisão. Com uma parcela de {formatCurrency(results.monthlyPayment)}, a viabilidade exige uma renda bruta de {formatCurrency(results.monthlyPayment * 3.33)}, mantendo a margem de segurança de 30%."
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
