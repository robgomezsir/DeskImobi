/** Limite de caracteres numéricos (reais + centavos) para evitar valores absurdos. */
const MAX_DIGITS = 15;

/**
 * Interpreta o campo de valor total:
 * - Colar / digitar formato BR: "R$ 500.000,00", "500.000,50", "1500,50"
 * - Só dígitos: reais inteiros da direita para a esquerda ao digitar (500000 → 500000 reais → R$ 500.000,00)
 *
 * @param {string} input
 * @returns {number} valor em reais
 */
export function parseCurrencyInputToReais(input) {
  const s = String(input ?? '').trim();
  if (!s) return 0;

  const withoutPrefix = s.replace(/R\$\s*/i, '').trim();
  if (!withoutPrefix) return 0;

  const hasComma = withoutPrefix.includes(',');

  if (hasComma) {
    const lastComma = withoutPrefix.lastIndexOf(',');
    const intPart = withoutPrefix
      .slice(0, lastComma)
      .replace(/\./g, '')
      .replace(/\D/g, '');
    const decPart = withoutPrefix
      .slice(lastComma + 1)
      .replace(/\D/g, '')
      .padEnd(2, '0')
      .slice(0, 2);
    const whole = Number.parseInt(intPart || '0', 10);
    const frac = Number.parseInt(decPart || '0', 10) / 100;
    if (!Number.isFinite(whole) || !Number.isFinite(frac)) return 0;
    return whole + frac;
  }

  /** Sem vírgula decimal: só dígitos = reais inteiros (ex.: 500000 → 500000,00). */
  const digits = withoutPrefix.replace(/\D/g, '').slice(0, MAX_DIGITS);
  if (!digits) return 0;
  const n = Number.parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Formatação padrão BRL (símbolo, milhar e decimais).
 *
 * @param {number} reais
 */
export function formatBRL(reais) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(reais);
}
