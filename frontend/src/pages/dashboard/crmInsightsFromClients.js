/** Insights do dashboard derivados dos registos do CRM (`clients`). */

export const PIPELINE_STATUSES = ['lead', 'contact', 'negotiation'];

/**
 * Clientes em pipeline sem movimento no CRM há mais de `daysStale` dias.
 * Referência: `last_contacted_at` (se existir), senão `updated_at`, senão `created_at`.
 */
export function countStagnantClients(clients, daysStale = 10) {
  const cutoff = Date.now() - daysStale * 24 * 60 * 60 * 1000;
  return clients.filter((c) => {
    if (!PIPELINE_STATUSES.includes(c.status)) return false;
    const ref = c.last_contacted_at ?? c.updated_at ?? c.created_at;
    const t = new Date(ref).getTime();
    return Number.isFinite(t) && t < cutoff;
  }).length;
}

function closedInCalendarMonth(clients, year, monthIndex0) {
  return clients.filter((c) => {
    if (c.status !== 'closed' || !c.updated_at) return false;
    const d = new Date(c.updated_at);
    return d.getFullYear() === year && d.getMonth() === monthIndex0;
  }).length;
}

/**
 * Texto do segundo bloco: evolução de fechamentos mês a mês (CRM).
 * @returns {{ quote: string }}
 */
export function buildConversionStyleInsight(clients) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const thisMonth = closedInCalendarMonth(clients, y, m);
  const prev = new Date(y, m - 1, 1);
  const lastMonth = closedInCalendarMonth(clients, prev.getFullYear(), prev.getMonth());

  if (thisMonth === 0 && lastMonth === 0) {
    return {
      quote:
        'Ainda não há fechamentos comparáveis entre meses no CRM. Quando avançar negociações para "Fechado", verá a evolução aqui.',
    };
  }

  if (lastMonth === 0 && thisMonth > 0) {
    return {
      quote: `Este mês você registrou ${thisMonth} fechamento${thisMonth !== 1 ? 's' : ''} no CRM — ótimo marco para acompanhar a conversão.`,
    };
  }

  if (thisMonth === 0 && lastMonth > 0) {
    return {
      quote: `Este mês ainda não há fechamentos registados; no mês anterior foram ${lastMonth}.`,
    };
  }

  const deltaPct = ((thisMonth - lastMonth) / lastMonth) * 100;
  const rounded = Math.round(deltaPct * 10) / 10;

  if (rounded === 0) {
    return {
      quote: `Seus fechamentos mantiveram-se alinhados ao mês anterior (${thisMonth} fechamento${thisMonth !== 1 ? 's' : ''}).`,
    };
  }

  const dir = rounded > 0 ? 'subiram' : 'recuaram';
  const abs = Math.abs(rounded);

  return {
    quote: `Seus fechamentos no CRM ${dir} ${abs}% em relação ao mês anterior (${thisMonth} vs ${lastMonth} fechamento${lastMonth !== 1 ? 's' : ''}).`,
  };
}
