/**
 * Nomes oficiais e taglines dos módulos BrokerVision.
 * Fonte de verdade alinhada a `brokervision_brand_context_pack.json` (ecosystem_modules).
 */

export const BV_MODULE_KEYS = [
  'dashboard',
  'crm',
  'calc',
  'finance',
  'flow',
  'insights',
];

/** @type {Record<string, { id: string, area: string, officialName: string, tagline: string, path: string }>} */
export const BV_MODULES = {
  dashboard: {
    id: 'dashboard',
    area: 'Relatórios & Analytics',
    officialName: 'BV Dashboard',
    tagline: 'Sua performance em tempo real.',
    path: '/dashboard',
  },
  crm: {
    id: 'crm',
    area: 'Gestão de Leads & Clientes',
    officialName: 'BV CRM',
    tagline: 'Do primeiro contato ao fechamento.',
    path: '/crm',
  },
  calc: {
    id: 'calc',
    area: 'Calculadoras Financeiras',
    officialName: 'BV Calc',
    tagline: 'Simule. Decida. Feche.',
    path: '/calculadora',
  },
  finance: {
    id: 'finance',
    area: 'Gestão Financeira',
    officialName: 'BV Finance',
    tagline: 'Cada comissão no lugar certo.',
    path: '/finance',
  },
  flow: {
    id: 'flow',
    area: 'Automações & Fluxos',
    officialName: 'BV Flow',
    tagline: 'Trabalhe menos. Produza mais.',
    path: '/mensagens',
  },
  insights: {
    id: 'insights',
    area: 'Inteligência Artificial',
    officialName: 'BV Insights',
    tagline: 'O mercado fala. Você entende.',
    path: '/insights',
  },
};
