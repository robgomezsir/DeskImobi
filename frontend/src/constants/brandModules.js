/**
 * Nomes e rotas dos módulos BrokerVision.
 * Fonte: `brokervision-brand-context.json` (naming_conventions, sidebar.navigation_items).
 * Prefixo "BV" removido das labels voltadas ao utilizador.
 * Exibição: títulos em MAIÚSCULAS (typography.section_titles) via `uppercase` em PageToolbar / Sidebar.
 */

export const BV_MODULE_KEYS = ['dashboard', 'crm', 'calc', 'insights', 'integrations'];

/** @type {Record<string, { id: string, area: string, officialName: string, tagline: string, path: string }>} */
export const BV_MODULES = {
  dashboard: {
    id: 'dashboard',
    area: 'Relatórios & Analytics',
    officialName: 'Dashboard',
    tagline: 'Sua performance em tempo real.',
    path: '/dashboard',
  },
  crm: {
    id: 'crm',
    area: 'Gestão de Leads & Clientes',
    officialName: 'CRM',
    tagline: 'Do primeiro contato ao fechamento.',
    path: '/crm',
  },
  calc: {
    id: 'calc',
    area: 'Calculadoras Financeiras',
    officialName: 'Calculadora',
    tagline: 'Fluxo de pagamento: entrada, mensais, intercaladas e chaves.',
    path: '/calculadora',
  },
  insights: {
    id: 'insights',
    area: 'Inteligência Artificial',
    officialName: 'Broker Insights',
    tagline: 'O mercado fala. Você entende.',
    path: '/insights',
  },
  integrations: {
    id: 'integrations',
    area: 'Conexões',
    officialName: 'Integrações',
    tagline: 'Conecte CRM, portais e automações.',
    path: '/integracoes',
  },
};

/** Rotas antigas ainda referenciadas em código legado (sem entrada na navegação). */
export const LEGACY_BV_MODULES = {
  finance: {
    id: 'finance',
    officialName: 'Finance',
    tagline: 'Cada comissão no lugar certo.',
    path: '/finance',
  },
  flow: {
    id: 'flow',
    officialName: 'Mensagens',
    tagline: 'Trabalhe menos. Produza mais.',
    path: '/mensagens',
  },
};
