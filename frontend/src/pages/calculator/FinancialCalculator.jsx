import { useMemo, useState } from 'react';
import { Calculator, Check, Copy, Download, Home, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { generateFlowPaymentPDF } from '../../services/pdf.service';
import { useRegisterAppToolbar } from '../../contexts/AppToolbarContext';
import { useRegisterAppFab } from '../../contexts/AppFabContext';
import { PageToolbar } from '../../components/layout/PageToolbar';
import { ModuleFabButton } from '../../components/layout/ModuleFabButton';
import { BvModuleCanvas } from '../../components/layout/BvModuleCanvas';
import { useGlassBackdropStyle } from '../../hooks/useGlassBackdropStyle';
import {
  computeFlowBuckets,
  consolidatedAmountForPercentages,
  DEFAULT_FLOW_PAYMENT,
  maxPctForPhaseToTotal100,
  sumFlowPercentages,
} from './flowPaymentCalculations';

/** Comparação para meta de 100% nos avisos (sugestões). */
const SUM_EPS = 0.01;

function sumMatches100(flowState) {
  return Math.abs(sumFlowPercentages(flowState) - 100) <= SUM_EPS;
}

const FLOW_SECTIONS = [
  { key: 'entrada', label: 'Entrada' },
  { key: 'mensais', label: 'Mensais' },
  { key: 'intercaladas', label: 'Intercaladas' },
  { key: 'chaves', label: 'Chaves' },
];

function buildFlowClipboardText(projectName, unit, valorTotal, flow, buckets) {
  const fmt = (n) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
  let text = `🏢 *${projectName.trim()}*\n`;
  if (unit?.trim()) text += `📍 Unidade: ${unit.trim()}\n`;
  text += `💰 Valor total: ${fmt(valorTotal)}\n\n`;
  text += `📋 *Fluxo de pagamento:*\n\n`;
  const parts = [
    { label: 'Entrada', pct: flow.pctEntrada, b: buckets.entrada },
    { label: 'Mensais', pct: flow.pctMensais, b: buckets.mensais },
    { label: 'Intercaladas', pct: flow.pctIntercaladas, b: buckets.intercaladas },
    { label: 'Chaves', pct: flow.pctChaves, b: buckets.chaves },
  ];
  for (const { label, pct, b } of parts) {
    if (pct <= 0) continue;
    text += `▸ *${label}*: ${pct}%\n`;
    text += `  ${fmt(b.totalFase)}`;
    if (b.parcelas > 1) text += ` em ${b.parcelas}x de ${fmt(b.valorParcela)}`;
    text += `\n\n`;
  }
  return text.trimEnd();
}

function formatCurrency(val) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(val);
}

function FlowPhaseCard({
  title,
  pct,
  onPctChange,
  parcelas,
  onParcelasChange,
  valorParcela,
  valorTotalOk,
  maxPctThisPhase,
  totalPercent,
  glassBackdropStyle,
}) {
  const fillPct = `${pct}%`;
  const roomInPhase = maxPctThisPhase - pct;
  const showOver =
    valorTotalOk && totalPercent > 100 + SUM_EPS && pct > maxPctThisPhase + SUM_EPS;
  const showUnderHint =
    valorTotalOk && totalPercent < 100 - SUM_EPS && roomInPhase > SUM_EPS;
  return (
    <div
      className="glass bv-card-hover flex h-full min-h-0 flex-col items-center rounded-card-3xl p-card-5 sm:p-card-6"
      style={glassBackdropStyle}
    >
      {/*
        Bloco centrado no cartão: mesmas 4 linhas (título/% · slider · rótulos · campos),
        largura máxima para não colar nas bordas em cards largos.
        Cada fase: % independente (0–100) sobre o valor total; valor/parcela = montante ÷ parcelas.
      */}
      <div className="flex w-full max-w-md flex-col justify-center gap-4">
        <div className="flex w-full items-center justify-between gap-4">
          <h3 className="min-w-0 text-xs font-semibold text-bv-text">
            {title}
          </h3>
          <span className="shrink-0 text-lg font-bold tabular-nums text-bv-text">{pct}%</span>
        </div>
        <div className="space-y-1.5">
          <input
            type="range"
            min={0}
            max={100}
            value={pct}
            disabled={!valorTotalOk}
            onChange={(e) => onPctChange(Number(e.target.value))}
            style={{ '--bv-flow-fill': fillPct }}
            className={`bv-flow-slider h-2 w-full appearance-none rounded-full accent-bv-green ${
              valorTotalOk ? 'cursor-pointer' : 'cursor-not-allowed opacity-45'
            }`}
            aria-label={`Percentagem ${title} sobre o valor total do imóvel`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-disabled={!valorTotalOk}
          />
          {!valorTotalOk ? (
            <p className="text-[10px] leading-snug text-bv-muted">
              Informe o valor total do imóvel à esquerda para o slider incidir sobre esse montante.
            </p>
          ) : null}
          {valorTotalOk ? (
            <div className="space-y-1.5 lg:hidden" role="group" aria-label={`Sugestões para meta 100% — ${title}`}>
              <p className="text-[10px] leading-snug text-bv-muted">
                Máx. nesta fase para somar 100%:{' '}
                <strong className="font-semibold text-bv-text">{maxPctThisPhase.toFixed(1)}%</strong>
              </p>
              {showOver ? (
                <p className="text-[10px] leading-snug text-red-400">
                  A soma das fases ultrapassa 100%. Reduza para no máximo{' '}
                  <strong>{maxPctThisPhase.toFixed(1)}%</strong> aqui.
                </p>
              ) : null}
              {showUnderHint ? (
                <p className="text-[10px] leading-snug text-amber-400/95">
                  Pode subir até mais <strong>{roomInPhase.toFixed(1)}%</strong> nesta fase para aproximar 100%.
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-6">
          <div className="flex w-full flex-col space-y-2">
            <label className="text-xs font-medium text-bv-muted">Parcelas</label>
            <input
              type="number"
              min={1}
              step={1}
              className="input-field w-full"
              value={parcelas}
              onChange={(e) => onParcelasChange(Math.max(1, Number(e.target.value) || 1))}
            />
          </div>
          <div className="flex w-full flex-col space-y-2">
            <label className="text-xs font-medium text-bv-muted">
              Valor por parcela
            </label>
            <p className="flex min-h-[42px] w-full items-center justify-end rounded-md border border-[var(--line-subtle)] bg-bv-surface-muted/40 px-3 text-right text-lg font-bold tabular-nums text-bv-green">
              {valorTotalOk ? formatCurrency(valorParcela) : 'R$ 0,00'}
            </p>
            {valorTotalOk ? (
              <p className="text-[10px] leading-snug text-bv-muted">
                {parcelas} parcela{parcelas !== 1 ? 's' : ''} × este valor cobre o montante da fase.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FinancialCalculator() {
  const glassBackdropStyle = useGlassBackdropStyle();

  const [projectName, setProjectName] = useState('');
  const [unit, setUnit] = useState('');
  const [valorTotal, setValorTotal] = useState(0);
  const [flow, setFlow] = useState(() => ({ ...DEFAULT_FLOW_PAYMENT }));
  const [flowConfirmed, setFlowConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);

  const valorTotalOk = Number(valorTotal) > 0;

  const buckets = useMemo(() => {
    if (!valorTotalOk) return null;
    return computeFlowBuckets(Number(valorTotal), flow);
  }, [valorTotal, flow, valorTotalOk]);

  const pctConsolidado = useMemo(() => sumFlowPercentages(flow), [flow]);

  const maxPctByPhase = useMemo(
    () => ({
      entrada: maxPctForPhaseToTotal100(flow, 'pctEntrada'),
      mensais: maxPctForPhaseToTotal100(flow, 'pctMensais'),
      intercaladas: maxPctForPhaseToTotal100(flow, 'pctIntercaladas'),
      chaves: maxPctForPhaseToTotal100(flow, 'pctChaves'),
    }),
    [flow]
  );

  const valorConsolidadoPercentuais = useMemo(
    () => (valorTotalOk ? consolidatedAmountForPercentages(Number(valorTotal), flow) : 0),
    [valorTotal, flow, valorTotalOk]
  );

  const setPct = (key, raw) => {
    const v = Number(raw);
    if (!Number.isFinite(v)) return;
    const clamped = Math.min(100, Math.max(0, v));
    setFlow((prev) => ({ ...prev, [key]: clamped }));
    setFlowConfirmed(false);
  };

  const setParcelas = (key, value) => {
    setFlow((prev) => ({ ...prev, [key]: value }));
    setFlowConfirmed(false);
  };

  const handleGerarFluxo = (e) => {
    e.preventDefault();
    const name = projectName.trim();
    if (!name) {
      toast.error('Indique o nome do empreendimento.');
      return;
    }
    if (!valorTotalOk) {
      toast.error('Indique o valor total do imóvel.');
      return;
    }
    setFlowConfirmed(true);
    toast.success('Fluxo de pagamento gerado.');
  };

  const handleCopyFlowText = async () => {
    if (!flowConfirmed || !buckets) {
      toast.error('Gere o fluxo de pagamento antes de copiar.');
      return;
    }
    const name = projectName.trim();
    if (!name) {
      toast.error('Indique o nome do empreendimento.');
      return;
    }
    try {
      const text = buildFlowClipboardText(name, unit, Number(valorTotal), flow, buckets);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Texto do fluxo copiado.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Não foi possível copiar.');
    }
  };

  const handleExportPDF = async () => {
    if (!flowConfirmed || !buckets) {
      toast.error('Gere o fluxo de pagamento antes de exportar.');
      return;
    }
    const name = projectName.trim();
    if (!name) {
      toast.error('Indique o nome do empreendimento.');
      return;
    }
    try {
      toast.loading('Gerando PDF...', { id: 'pdf' });
      const rows = [
        {
          label: 'Entrada',
          pct: flow.pctEntrada,
          parcelas: flow.parcelasEntrada,
          totalFase: buckets.entrada.totalFase,
          valorParcela: buckets.entrada.valorParcela,
        },
        {
          label: 'Mensais',
          pct: flow.pctMensais,
          parcelas: flow.parcelasMensais,
          totalFase: buckets.mensais.totalFase,
          valorParcela: buckets.mensais.valorParcela,
        },
        {
          label: 'Intercaladas',
          pct: flow.pctIntercaladas,
          parcelas: flow.parcelasIntercaladas,
          totalFase: buckets.intercaladas.totalFase,
          valorParcela: buckets.intercaladas.valorParcela,
        },
        {
          label: 'Chaves',
          pct: flow.pctChaves,
          parcelas: flow.parcelasChaves,
          totalFase: buckets.chaves.totalFase,
          valorParcela: buckets.chaves.valorParcela,
        },
      ];
      await generateFlowPaymentPDF({
        projectName: name,
        unit,
        valorTotal: Number(valorTotal),
        rows,
      });
      toast.success('PDF exportado.', { id: 'pdf' });
    } catch (err) {
      toast.error('Erro ao gerar PDF: ' + (err?.message || String(err)), { id: 'pdf' });
    }
  };

  useRegisterAppToolbar(
    () => (
      <PageToolbar title="Calculadora de fluxo" />
    ),
    []
  );

  useRegisterAppFab(
    () => (
      <ModuleFabButton
        aria-label="Exportar PDF"
        title="Exportar PDF"
        onClick={handleExportPDF}
        disabled={!flowConfirmed || !buckets}
      >
        <Download size={24} strokeWidth={2} />
      </ModuleFabButton>
    ),
    [flowConfirmed, buckets]
  );

  const phaseProps = {
    entrada: {
      pct: flow.pctEntrada,
      onPctChange: (n) => setPct('pctEntrada', n),
      parcelas: flow.parcelasEntrada,
      onParcelasChange: (n) => setParcelas('parcelasEntrada', n),
      valorParcela: buckets?.entrada.valorParcela ?? 0,
      maxPctThisPhase: maxPctByPhase.entrada,
    },
    mensais: {
      pct: flow.pctMensais,
      onPctChange: (n) => setPct('pctMensais', n),
      parcelas: flow.parcelasMensais,
      onParcelasChange: (n) => setParcelas('parcelasMensais', n),
      valorParcela: buckets?.mensais.valorParcela ?? 0,
      maxPctThisPhase: maxPctByPhase.mensais,
    },
    intercaladas: {
      pct: flow.pctIntercaladas,
      onPctChange: (n) => setPct('pctIntercaladas', n),
      parcelas: flow.parcelasIntercaladas,
      onParcelasChange: (n) => setParcelas('parcelasIntercaladas', n),
      valorParcela: buckets?.intercaladas.valorParcela ?? 0,
      maxPctThisPhase: maxPctByPhase.intercaladas,
    },
    chaves: {
      pct: flow.pctChaves,
      onPctChange: (n) => setPct('pctChaves', n),
      parcelas: flow.parcelasChaves,
      onParcelasChange: (n) => setParcelas('parcelasChaves', n),
      valorParcela: buckets?.chaves.valorParcela ?? 0,
      maxPctThisPhase: maxPctByPhase.chaves,
    },
  };

  return (
    <BvModuleCanvas innerClassName="relative z-10 mx-auto w-full max-w-7xl space-y-6 px-4 pb-1 animate-in fade-in slide-in-from-bottom-4 duration-700 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-bv-muted">
        <Layers className="h-5 w-5 shrink-0 text-bv-green" aria-hidden />
        <p className="text-xs font-medium">Simulação de obra / lançamento</p>
        </div>

        <form
          onSubmit={handleGerarFluxo}
          className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:items-stretch lg:gap-x-8 lg:gap-y-6"
        >
        <div className="space-y-4 lg:col-span-4 lg:row-start-1 lg:self-start">
          <div className="space-y-4 lg:sticky lg:top-24 lg:space-y-4">
            <div
              className="glass bv-card-hover space-y-4 rounded-card-3xl p-card-5 sm:p-card-6"
              style={glassBackdropStyle}
            >
              <h2 className="flex items-center gap-2 text-xs font-semibold text-bv-text">
                <Home className="h-5 w-5 shrink-0 text-bv-text" aria-hidden />
                Dados do imóvel
              </h2>
              <div className="space-y-2">
                <label className="text-sm font-medium text-bv-muted">Nome do empreendimento *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="Nome do empreendimento *"
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                    setFlowConfirmed(false);
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-bv-muted">Unidade</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Unidade"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-bv-muted">Valor total do imóvel</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bv-muted">R$</span>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    className="input-field pl-12"
                    placeholder="0"
                    value={valorTotal || ''}
                    onChange={(e) => {
                      setValorTotal(Number(e.target.value));
                      setFlowConfirmed(false);
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              className="glass bv-card-hover space-y-2 rounded-card-2xl px-card-4 py-card-3 text-center text-sm text-bv-muted"
              style={glassBackdropStyle}
              role="status"
            >
              <p className="text-[10px] font-semibold text-bv-muted">
                Valor geral do percentual atingido (consolidado)
              </p>
              <p className="text-xl font-bold tabular-nums text-bv-green">{pctConsolidado.toFixed(1)}%</p>
              <p className="text-[11px] leading-snug text-bv-muted">
                Soma aritmética dos quatro percentuais; o montante usa essa soma × valor total (informativo).
              </p>
              {valorTotalOk ? (
                <p className="mt-2 border-t border-[var(--line-subtle)] pt-2 text-xs text-bv-text">
                  Montante referente:{' '}
                  <span className="font-semibold tabular-nums text-bv-green">
                    {formatCurrency(valorConsolidadoPercentuais)}
                  </span>
                </p>
              ) : (
                <p className="mt-2 text-[11px] text-bv-muted/90">Indique o valor total para ver o montante.</p>
              )}
              {valorTotalOk && !sumMatches100(flow) ? (
                <div className="mt-3 space-y-2 border-t border-[var(--line-subtle)] pt-3 lg:hidden" role="alert">
                  <p className="text-[10px] font-semibold text-bv-muted">Meta 100%</p>
                  {pctConsolidado > 100 + SUM_EPS ? (
                    <p className="text-left text-xs leading-snug text-red-400">
                      A soma ultrapassa 100% em <strong>{(pctConsolidado - 100).toFixed(1)}</strong> pontos percentuais.
                      Reduza nos cartões abaixo.
                    </p>
                  ) : (
                    <p className="text-left text-xs leading-snug text-amber-400/95">
                      Faltam <strong>{(100 - pctConsolidado).toFixed(1)}%</strong> para totalizar 100%. Cada cartão mostra
                      quanto ainda pode mover nesta fase.
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-8 lg:row-span-2 lg:row-start-1 xl:gap-6">
          {FLOW_SECTIONS.map(({ key, label }) => (
            <FlowPhaseCard
              key={key}
              title={label}
              pct={phaseProps[key].pct}
              onPctChange={phaseProps[key].onPctChange}
              parcelas={phaseProps[key].parcelas}
              onParcelasChange={phaseProps[key].onParcelasChange}
              valorParcela={phaseProps[key].valorParcela}
              maxPctThisPhase={phaseProps[key].maxPctThisPhase}
              totalPercent={pctConsolidado}
              valorTotalOk={valorTotalOk}
              glassBackdropStyle={glassBackdropStyle}
            />
          ))}
        </div>

        {valorTotalOk ? (
          <div
            className="glass bv-card-hover space-y-3 rounded-card-2xl border border-[var(--line-subtle)] p-card-4 text-sm lg:hidden"
            style={glassBackdropStyle}
            role="status"
            aria-live="polite"
          >
            <p className="text-center text-[10px] font-semibold text-bv-muted">
              Consolidado — meta 100%
            </p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-2xl font-bold tabular-nums text-bv-green">{pctConsolidado.toFixed(1)}%</span>
              <span className="text-xs text-bv-muted">soma das 4 fases</span>
            </div>
            <p className="text-center text-xs tabular-nums text-bv-text">
              Montante: <span className="font-semibold text-bv-green">{formatCurrency(valorConsolidadoPercentuais)}</span>
            </p>
            {!sumMatches100(flow) ? (
              pctConsolidado > 100 + SUM_EPS ? (
                <p className="text-center text-xs leading-snug text-red-400">
                  Ultrapassou 100% em {(pctConsolidado - 100).toFixed(1)} p.p. Ajuste os sliders acima.
                </p>
              ) : (
                <p className="text-center text-xs leading-snug text-amber-400/95">
                  Faltam {(100 - pctConsolidado).toFixed(1)}% para 100%. Veja a sugestão em cada cartão.
                </p>
              )
            ) : (
              <p className="text-center text-xs font-medium text-bv-green">Soma em 100%.</p>
            )}
          </div>
        ) : null}

        <div className="lg:col-span-4 lg:row-start-2 lg:self-end">
          <button type="submit" className="btn btn-primary h-12 w-full font-bold text-black">
            <Calculator className="mr-2 inline h-5 w-5 align-middle" aria-hidden />
            Gerar fluxo de pagamento
          </button>
        </div>
        </form>

        {flowConfirmed && buckets ? (
          <div
            className="glass bv-card-hover rounded-card-3xl p-card-4 text-sm text-bv-muted sm:p-card-5 lg:p-card-6"
            style={glassBackdropStyle}
          >
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-semibold text-bv-text">Resumo</p>
              <button
                type="button"
                className="btn btn-outline inline-flex h-10 shrink-0 items-center justify-center gap-2 px-4 text-xs font-semibold"
                onClick={handleCopyFlowText}
              >
                {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                {copied ? 'Copiado' : 'Copiar texto do fluxo'}
              </button>
            </div>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              <li className="list-none rounded-card-2xl border border-[var(--line-subtle)] bg-bv-surface-muted p-card-4">
                <span className="text-xs font-bold text-bv-green">Entrada</span>
                <p className="mt-1 text-bv-text">
                  {flow.parcelasEntrada} × {formatCurrency(buckets.entrada.valorParcela)}
                </p>
                <p className="mt-0.5 text-xs opacity-90">Total {formatCurrency(buckets.entrada.totalFase)}</p>
              </li>
              <li className="list-none rounded-card-2xl border border-[var(--line-subtle)] bg-bv-surface-muted p-card-4">
                <span className="text-xs font-bold text-bv-green">Mensais</span>
                <p className="mt-1 text-bv-text">
                  {flow.parcelasMensais} × {formatCurrency(buckets.mensais.valorParcela)}
                </p>
                <p className="mt-0.5 text-xs opacity-90">Total {formatCurrency(buckets.mensais.totalFase)}</p>
              </li>
              <li className="list-none rounded-card-2xl border border-[var(--line-subtle)] bg-bv-surface-muted p-card-4">
                <span className="text-xs font-bold text-bv-green">Intercaladas</span>
                <p className="mt-1 text-bv-text">
                  {flow.parcelasIntercaladas} × {formatCurrency(buckets.intercaladas.valorParcela)}
                </p>
                <p className="mt-0.5 text-xs opacity-90">Total {formatCurrency(buckets.intercaladas.totalFase)}</p>
              </li>
              <li className="list-none rounded-card-2xl border border-[var(--line-subtle)] bg-bv-surface-muted p-card-4">
                <span className="text-xs font-bold text-bv-green">Chaves</span>
                <p className="mt-1 text-bv-text">
                  {flow.parcelasChaves} × {formatCurrency(buckets.chaves.valorParcela)}
                </p>
                <p className="mt-0.5 text-xs opacity-90">Total {formatCurrency(buckets.chaves.totalFase)}</p>
              </li>
            </ul>
          </div>
        ) : null}

        <p className="pb-8 text-center text-[10px] text-bv-muted">
          © {new Date().getFullYear()} BrokerVision. Todos os direitos reservados.
        </p>
    </BvModuleCanvas>
  );
}
