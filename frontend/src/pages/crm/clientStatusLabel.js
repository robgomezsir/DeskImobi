/** Rótulo para exibição (capitalização normal, PT-BR). */
export function formatClientStatus(status) {
  const map = {
    lead: 'Lead',
    contact: 'Contato',
    negotiation: 'Negociação',
    closed: 'Fechado',
    lost: 'Perdido',
  };
  if (status != null && map[status] != null) return map[status];
  if (typeof status !== 'string' || !status) return '';
  return status.charAt(0).toUpperCase() + status.slice(1);
}
