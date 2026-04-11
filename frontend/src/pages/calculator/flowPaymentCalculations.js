/** Percentagens e parcelas padrão alinhadas à referência Lancaster / Broker Vision. */

export const DEFAULT_FLOW_PAYMENT = {
  pctEntrada: 10,
  pctMensais: 60,
  pctIntercaladas: 10,
  pctChaves: 20,
  parcelasEntrada: 1,
  parcelasMensais: 120,
  parcelasIntercaladas: 10,
  parcelasChaves: 1,
};

export const FLOW_PCT_KEYS = ['pctEntrada', 'pctMensais', 'pctIntercaladas', 'pctChaves'];

/**
 * Teto de % nesta fase para a soma das quatro ser 100% (com as outras fases fixas).
 * Usado em avisos e sugestões (não altera o comportamento dos sliders).
 */
export function maxPctForPhaseToTotal100(state, pctFieldKey) {
  const sumOthers = FLOW_PCT_KEYS.filter((k) => k !== pctFieldKey).reduce((s, k) => s + state[k], 0);
  return Math.max(0, 100 - sumOthers);
}

/**
 * Soma aritmética dos quatro percentuais (cada fase define o seu % sobre o valor total, de forma independente).
 * Usada no painel consolidado — não limita os sliders das fases.
 */
export function sumFlowPercentages(state) {
  return state.pctEntrada + state.pctMensais + state.pctIntercaladas + state.pctChaves;
}

/**
 * Montante referente à soma consolidada: valorTotal × (soma dos % ÷ 100).
 * Independente do cálculo por cartão em si (cada fase continua: valorTotal × pct_fase/100).
 */
export function consolidatedAmountForPercentages(valorTotal, state) {
  return Number(valorTotal) * (sumFlowPercentages(state) / 100);
}

/**
 * Para cada fase: totalFase = valorTotal × (pct/100); valorParcela = totalFase ÷ parcelas.
 * Assim o slider (% sobre o imóvel) e o número de parcelas determinam o valor de cada parcela em tempo real.
 *
 * @param {Record<string, number>} state — percentagens e contagens de parcelas por fase
 */
export function computeFlowBuckets(valorTotal, state) {
  const {
    pctEntrada,
    pctMensais,
    pctIntercaladas,
    pctChaves,
    parcelasEntrada,
    parcelasMensais,
    parcelasIntercaladas,
    parcelasChaves,
  } = state;

  const bucket = (pct, parcelas) => {
    const totalFase = valorTotal * (pct / 100);
    const valorParcela = parcelas > 0 ? totalFase / parcelas : 0;
    return { pct, parcelas, totalFase, valorParcela };
  };

  return {
    entrada: bucket(pctEntrada, parcelasEntrada),
    mensais: bucket(pctMensais, parcelasMensais),
    intercaladas: bucket(pctIntercaladas, parcelasIntercaladas),
    chaves: bucket(pctChaves, parcelasChaves),
  };
}
