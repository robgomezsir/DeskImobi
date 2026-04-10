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

/** @param {Record<string, number>} state — percentagens e contagens de parcelas por fase */
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
