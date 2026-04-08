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
import { BV_MODULES } from '../../constants/brandModules';
import { useRegisterAppToolbar } from '../../contexts/AppToolbarContext';

const calc = BV_MODULES.calc;

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

  useRegisterAppToolbar(
    () => (
      <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-display font-bold tracking-tight text-bv-text md:text-3xl">{calc.officialName}</h1>
          <p className="truncate text-sm text-bv-muted">{calc.tagline}</p>
        </div>
        <button type="button" onClick={handleExportPDF} className="btn btn-outline h-11 shrink-0 gap-2">
          <Download size={18} />
          Exportar PDF
        </button>
      </div>
    ),
    []
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-3xl space-y-6 border border-[var(--line)]">
            <h3 className="text-lg font-bold flex items-center gap-2 text-bv-text">
              <Calculator size={20} className="text-bv-green" />
              Parâmetros de Análise
            </h3>
            
            <form onSubmit={calculateFinancing} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-bv-muted">Valor do Imóvel</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bv-muted">R$</span>
                  <input 
                    type="number"
                    className="input-field pl-12"
                    value={formData.propertyValue}
                    onChange={e => setFormData({...formData, propertyValue: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-bv-muted">Entrada</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bv-muted">R$</span>
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
                  <label className="text-sm font-medium text-bv-muted">Taxa Anual (%)</label>
                  <input 
                    type="number"
                    step="0.01"
                    className="input-field"
                    value={formData.interestRate}
                    onChange={e => setFormData({...formData, interestRate: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-bv-muted">Prazo (Anos)</label>
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
            <div className="glass-card h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-dashed border-2 border-[var(--line-subtle)]">
              <div className="w-16 h-16 rounded-2xl bg-bv-surface-muted flex items-center justify-center text-bv-muted mb-4">
                <TrendingDown size={32} />
              </div>
              <h3 className="text-xl font-medium mb-2 text-bv-text">Pronto para Análise</h3>
              <p className="text-bv-muted max-w-xs">Defina os parâmetros ao lado para gerar o relatório de viabilidade econômica.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in zoom-in duration-500">
              {/* Main Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card p-6 bg-bv-green/5 border-bv-green/20">
                  <p className="text-sm text-bv-green mb-1">Parcela Mensal Estimada</p>
                  <h2 className="text-4xl font-display font-bold text-bv-text">
                    {formatCurrency(results.monthlyPayment)}
                  </h2>
                </div>
                <div className="glass-card p-6">
                  <p className="text-sm text-bv-muted mb-1">Total a ser Pago</p>
                  <h2 className="text-4xl font-display font-bold text-bv-text">
                    {formatCurrency(results.totalPaid)}
                  </h2>
                </div>
              </div>

              {/* Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass p-4 rounded-2xl border border-[var(--line-subtle)]">
                  <div className="flex items-center gap-2 text-bv-muted text-xs mb-2">
                    <DollarSign size={14} /> VALOR FINANCIADO
                  </div>
                  <p className="text-lg font-bold">{formatCurrency(results.principal)}</p>
                </div>
                <div className="glass p-4 rounded-2xl border border-[var(--line-subtle)]">
                  <div className="flex items-center gap-2 text-bv-green-deep text-xs mb-2">
                    <TrendingDown size={14} /> TOTAL DE JUROS
                  </div>
                  <p className="text-lg font-bold">{formatCurrency(results.totalInterest)}</p>
                </div>
                <div className="glass p-4 rounded-2xl border border-[var(--line-subtle)]">
                  <div className="flex items-center gap-2 text-bv-muted text-xs mb-2">
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
                <p className="text-bv-muted leading-relaxed italic">
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
