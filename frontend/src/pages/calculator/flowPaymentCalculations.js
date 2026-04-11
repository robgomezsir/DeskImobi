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

/** Chaves de percentagem na ordem usada para normalizar a soma a 100%. */
export const FLOW_PCT_KEYS = ['pctEntrada', 'pctMensais', 'pctIntercaladas', 'pctChaves'];

/**
 * Teto de % desta fase para que a soma das quatro não ultrapasse 100%
 * (com as outras fases fixas).
 */
export function maxPctForPhaseToTotal100(state, pctFieldKey) {
  const sumOthers = FLOW_PCT_KEYS.filter((k) => k !== pctFieldKey).reduce((s, k) => s + state[k], 0);
  return Math.max(0, 100 - sumOthers);
}

/** Ajusta percentagens para ficarem entre 0 e o teto de cada fase até a soma ≤ 100%. */
export function clampAllPhasePercentages(state) {
  let cur = { ...state };
  for (let iter = 0; iter < 16; iter += 1) {
    let changed = false;
    for (const k of FLOW_PCT_KEYS) {
      const max = maxPctForPhaseToTotal100(cur, k);
      if (cur[k] > max) {
        cur = { ...cur, [k]: max };
        changed = true;
      }
      if (cur[k] < 0) {
        cur = { ...cur, [k]: 0 };
        changed = true;
      }
    }
    if (!changed) break;
  }
  return cur;
}

/** Soma dos percentuais das quatro fases (cada % incide sobre o valor total do imóvel). */
export function sumFlowPercentages(state) {
  return state.pctEntrada + state.pctMensais + state.pctIntercaladas + state.pctChaves;
}

/**
 * Montante total referente à soma dos percentuais (cada fase: valorTotal × pct/100).
 * Equivale à soma dos `totalFase` de `computeFlowBuckets` para o mesmo estado.
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
