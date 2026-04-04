# 🧠 PROMPT MESTRE — IMOBIFLOW AI
## Geração de Sistema SaaS Completo para Corretores de Imóveis

> **Versão:** 2.0  
> **Categoria:** Desenvolvimento Full-Stack + IA  
> **Complexidade:** Alta  
> **Stack:** React · Node.js · Supabase · OpenAI API

---

## 📌 INSTRUÇÕES DE USO DESTE PROMPT

Este é um **prompt mestre estruturado** para ser utilizado com modelos de linguagem avançados (GPT-4, Claude Opus, Gemini Ultra, etc.). Ele pode ser executado de duas formas:

1. **Modo Completo:** Cole o prompt inteiro e aguarde a geração do sistema completo em etapas.
2. **Modo Modular:** Use cada seção individualmente para gerar partes específicas do sistema.

**Recomendação:** Utilize em sessões separadas por módulo para manter o contexto focado e o código coeso.

---

## 📋 CONTEXTO GERAL DO PROJETO

```
Você é um engenheiro de software sênior especializado em desenvolvimento de aplicações SaaS B2B,
com profundo conhecimento em React, Node.js, Supabase e integração com APIs de IA.

Seu objetivo é criar uma aplicação web completa chamada "ImobiFlow AI" — uma plataforma SaaS
voltada para corretores de imóveis autônomos e pequenas imobiliárias, com foco em:
automação do processo comercial, gestão de clientes (CRM), simulação financeira e
geração de conteúdo persuasivo com inteligência artificial.

O banco de dados e a autenticação são 100% gerenciados pelo Supabase.
NÃO utilize Prisma, PostgreSQL local, JWT manual, bcrypt ou Nodemailer —
tudo isso é substituído nativamente pelo Supabase.

A aplicação deve ser moderna, responsiva, segura, escalável e pronta para produção.
```

---

## 🎯 OBJETIVO DO PRODUTO

A **ImobiFlow AI** resolve os seguintes problemas reais de corretores de imóveis:

| Problema | Solução na Plataforma |
|---|---|
| Falta de organização de leads | CRM com pipeline visual |
| Dificuldade em calcular propostas | Calculadora de fluxo financeiro |
| Baixa taxa de resposta em mensagens | Gerador de mensagens com IA |
| Falta de visibilidade sobre performance | Dashboard com métricas e insights |
| Abordagem genérica para cada cliente | IA que personaliza comunicação por perfil |

---

## 🏗️ ARQUITETURA TÉCNICA DETALHADA

### Visão Geral

```
┌──────────────────────────────────────────────────────────┐
│                       FRONTEND                            │
│           React 18 + Vite + Tailwind CSS 3                │
│     React Router · React Query · Zustand · Recharts       │
│          @supabase/supabase-js (Auth + Realtime)          │
└─────────────────────┬────────────────────────────────────┘
                      │ HTTPS
┌─────────────────────▼────────────────────────────────────┐
│                       BACKEND                             │
│               Node.js + Express.js                        │
│      Supabase Admin Client · Zod · Winston Logger         │
└──────────┬───────────────────────┬────────────────────────┘
           │                       │
┌──────────▼───────────┐  ┌────────▼──────────────────────┐
│      SUPABASE         │  │      OpenAI API (GPT-4o)       │
│  PostgreSQL (DB)      │  │  Completions · JSON Mode       │
│  Auth (email/OAuth)   │  └───────────────────────────────┘
│  Storage (avatares)   │
│  Row Level Security   │
│  Realtime             │
└──────────────────────┘
```

### Stack Tecnológica Completa

**Frontend:**
- React 18 com Hooks e Context API
- Vite como bundler
- Tailwind CSS 3 para estilização
- React Router v6 para navegação
- React Query (TanStack) para cache e fetching
- Zustand para estado global
- `@supabase/supabase-js` para Auth e acesso direto ao banco
- Recharts para gráficos
- React Hook Form + Zod para formulários
- Lucide React para ícones
- Sonner para notificações toast
- jsPDF + html2canvas para exportação PDF

**Backend:**
- Node.js 20 LTS
- Express.js com middleware estruturado
- `@supabase/supabase-js` com **service_role key** (acesso admin)
- Zod para validação de dados
- Winston para logs
- Rate limiting com `express-rate-limit`
- CORS configurado por ambiente

> ⚠️ **IMPORTANTE:** O backend usa o cliente Supabase com `service_role` para operações administrativas. O frontend usa a chave `anon` com RLS ativo. NUNCA exponha a service_role key no frontend.

**Supabase (Backend-as-a-Service):**
- **Auth:** Registro, login, logout, recuperação de senha, sessão persistente — tudo nativo
- **Database:** PostgreSQL gerenciado, sem necessidade de ORM local
- **Row Level Security (RLS):** Isolamento de dados por `auth.uid()` diretamente no banco
- **Storage:** Bucket para avatares e arquivos exportados
- **Realtime:** Subscrição a mudanças de dados para notificações

**Infraestrutura:**
- Variáveis de ambiente com dotenv
- Deploy: frontend no Vercel, backend no Railway ou Render
- Sem Docker necessário — o Supabase roda na nuvem

---

## 🔐 MÓDULO DE AUTENTICAÇÃO — SUPABASE AUTH

### Como funciona

```
O Supabase Auth substitui completamente:
  ✗ JWT manual            → ✅ Supabase gera e valida automaticamente
  ✗ bcrypt / hash senha   → ✅ Supabase gerencia internamente
  ✗ Nodemailer            → ✅ Supabase envia emails de confirmação/recuperação
  ✗ Tabela refresh_tokens → ✅ Supabase gerencia a rotação de tokens
  ✗ Rotas /api/auth/*     → ✅ SDK do frontend chama o Supabase diretamente

O backend valida o token JWT gerado pelo Supabase via supabase.auth.getUser(token).
```

### Configuração do Cliente Supabase

```javascript
// frontend/src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

```javascript
// backend/src/config/supabase.js
import { createClient } from '@supabase/supabase-js';

// Cliente admin — NUNCA expor no frontend
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Cliente para validar tokens do usuário
export const supabaseAuth = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
```

### Fluxos de Autenticação (Frontend)

```javascript
// REGISTRO
const { data, error } = await supabase.auth.signUp({
  email: 'corretor@email.com',
  password: 'Senha123!',
  options: {
    data: { name: 'Nome do Corretor' } // salvo em auth.users.raw_user_meta_data
  }
});

// LOGIN
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'corretor@email.com',
  password: 'Senha123!'
});

// LOGOUT
await supabase.auth.signOut();

// RECUPERAÇÃO DE SENHA (Supabase envia o email automaticamente)
await supabase.auth.resetPasswordForEmail('corretor@email.com', {
  redirectTo: 'https://seusite.com/nova-senha'
});

// REDEFINIR NOVA SENHA (após clicar no link do email)
await supabase.auth.updateUser({ password: 'NovaSenha456!' });

// ESCUTAR MUDANÇAS DE SESSÃO
supabase.auth.onAuthStateChange((event, session) => {
  // event: SIGNED_IN | SIGNED_OUT | TOKEN_REFRESHED | PASSWORD_RECOVERY
});
```

### Middleware de Autenticação (Backend)

```javascript
// backend/src/middlewares/auth.middleware.js
import { supabaseAuth } from '../config/supabase.js';

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabaseAuth.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }

  req.user = user; // user.id é o UUID do usuário no Supabase
  next();
}
```

### AuthProvider (Frontend)

```javascript
// frontend/src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### Telas de Autenticação

```
PÁGINAS NECESSÁRIAS:
- /login         → signInWithPassword + redirect para /dashboard
- /cadastro      → signUp com validação em tempo real
- /esqueci-senha → resetPasswordForEmail com feedback de sucesso
- /nova-senha    → updateUser após redirect do email (evento PASSWORD_RECOVERY)

REGRAS DE VALIDAÇÃO (Zod no frontend):
- Email: formato válido
- Senha: mínimo 8 caracteres, 1 maiúscula, 1 número
- Confirmação de senha: deve ser igual

COMPONENTES:
- <ProtectedRoute> → verifica useAuth().user, redireciona para /login se null
- <GuestRoute>     → redireciona para /dashboard se já autenticado
```

---

## 🏠 MÓDULO: DASHBOARD

### Especificação Completa

```
Crie a tela principal do sistema com as seguintes seções:

MÉTRICAS (Cards no topo):
- Total de Clientes Ativos
- Novos Leads (últimos 7 dias)
- Propostas em Andamento
- Negócios Fechados (mês atual)
- Taxa de Conversão (%)
- Ticket Médio (R$)

GRÁFICO DE PERFORMANCE:
- Gráfico de linha: Leads captados vs. Negócios fechados (últimos 6 meses)
- Gráfico de pizza: Distribuição de status dos clientes
- Usar Recharts com animação suave

FEED DE ATIVIDADES RECENTES:
- Lista cronológica das últimas 10 ações
- Exemplos: "João Silva movido para Negociação", "Proposta enviada para Maria"
- Ícones diferenciados por tipo de ação

INSIGHT RÁPIDO DA IA:
- Card lateral com 1 insight gerado automaticamente
- Exemplo: "Você tem 3 clientes parados há mais de 10 dias. Quer gerar uma mensagem de reativação?"
- Botão de ação direta

ACESSO AO SUPABASE (via backend com service_role):
GET /api/dashboard/metrics     → SELECT COUNT, AVG agrupados por status/data
GET /api/dashboard/activities  → SELECT * FROM client_history ORDER BY created_at DESC LIMIT 10
GET /api/dashboard/chart-data  → SELECT DATE_TRUNC, status, COUNT(*)
```

---

## 👥 MÓDULO: CRM DE CLIENTES

### Especificação Completa

```
Crie um CRM completo com as seguintes funcionalidades:

LISTAGEM:
- Tabela responsiva com paginação (10, 25, 50 por página)
- Busca em tempo real por nome, email ou telefone
- Filtros: Status · Tipo de Imóvel · Faixa de Valor · Data de cadastro
- Ordenação por qualquer coluna
- Modo kanban com colunas por status (alternativo)

CAMPOS DO CLIENTE:
- Nome completo *
- Telefone (WhatsApp) * — com máscara (XX) XXXXX-XXXX
- Email
- Tipo de cliente: Comprador | Locatário | Investidor
- Interesse em imóvel:
  - Tipo: Apartamento | Casa | Terreno | Comercial | Rural
  - Valor mínimo / máximo (R$)
  - Localização / Bairro preferido
  - Número de quartos
  - Observações específicas
- Status do funil:
  - 🔵 Lead (novo contato)
  - 🟡 Em Contato (primeiro atendimento feito)
  - 🟠 Negociação (visita ou proposta em curso)
  - 🟢 Fechado (negócio concluído)
  - 🔴 Perdido (desistiu ou comprou com outro)
- Fonte do lead: Instagram | Indicação | Site | OLX | Plantão | Outro
- Data de cadastro (automática)
- Última interação (atualizada automaticamente)

HISTÓRICO DO CLIENTE:
- Timeline de todas as interações
- Cada entrada: data, tipo (mensagem, ligação, visita, proposta), observação
- Possibilidade de adicionar notas manuais

IA NO CRM:
- Botão "Classificar com IA": Score, perfil resumido e abordagem recomendada
- Botão "Gerar Mensagem": redireciona para o Gerador com os dados preenchidos

ROTAS DE API (todas protegidas por authMiddleware):
GET    /api/clients              → Listar (com filtros e paginação)
POST   /api/clients              → Criar cliente
GET    /api/clients/:id          → Detalhe do cliente
PUT    /api/clients/:id          → Atualizar cliente
DELETE /api/clients/:id          → Soft delete (deleted_at = now())
POST   /api/clients/:id/notes    → Adicionar nota ao histórico
GET    /api/clients/:id/history  → Histórico de interações
POST   /api/clients/:id/classify → Classificação por IA
```

---

## 🧮 MÓDULO: CALCULADORA DE FLUXO IMOBILIÁRIO

### Especificação Completa

```
INPUTS (Formulário):
- Valor total do imóvel (R$) *
- Valor de entrada (R$ ou %) *
- Número de parcelas mensais *
- Valor de cada parcela mensal (R$) *
- Parcelas intermediárias: quantidade, meses e valores
- Valor a ser financiado (calculado automaticamente ou manual)
- Taxa de juros do financiamento (% a.m.)
- Índice de correção: INCC | IPCA | IGP-M | Sem correção

OUTPUTS (Resultado):
- Percentual de entrada sobre o valor total
- Total pago em parcelas mensais
- Total pago em intermediárias
- Valor total financiado
- Estimativa de prestação bancária (SAC ou Price)
- Total geral pago
- Cronograma mês a mês em tabela expandível

CENÁRIOS GERADOS PELA IA:
1. CONSERVADOR — Maior entrada, menor financiamento, menor risco
2. MODERADO    — Equilíbrio entre entrada e financiamento
3. AGRESSIVO   — Entrada mínima, maximiza parcelas, preserva caixa

Cada cenário: valores, vantagens, desvantagens e perfil ideal.

FUNCIONALIDADES EXTRAS:
- Exportar PDF com logo ImobiFlow AI
- Copiar resumo formatado para WhatsApp
- Salvar simulação associada a um cliente do CRM
- Histórico de simulações salvas

ROTAS DE API:
POST   /api/simulations/calculate  → Calcular fluxo
POST   /api/simulations/scenarios  → Gerar cenários com IA
POST   /api/simulations            → Salvar simulação no Supabase
GET    /api/simulations            → Listar simulações do usuário
GET    /api/simulations/:id        → Detalhe da simulação
DELETE /api/simulations/:id        → Excluir simulação
```

---

## 💬 MÓDULO: GERADOR DE MENSAGENS COM IA

### Especificação Completa

```
INPUTS:
- Cliente (do CRM ou manual): tipo e perfil resumido
- Etapa do funil: primeiro contato | reativação | apresentação | visita |
                  proposta | negociação | fechamento | pós-venda
- Tipo de imóvel: Apartamento | Casa | Terreno | Comercial | Outro
- Tom: Formal | Consultivo | Direto | Descontraído
- Informações adicionais (campo livre)

OUTPUTS (3 formatos simultâneos com botão Copiar):
1. MENSAGEM PARA WHATSAPP — linguagem natural, máx 5 parágrafos, CTA clara
2. SCRIPT DE LIGAÇÃO      — estrutura: Abertura → Qualificação → Apresentação → CTA
3. RESPOSTA PARA OBJEÇÃO  — Validar → Reframing → Solução → CTA

SYSTEM PROMPT INTERNO DA IA:
"Você é Carlos, especialista em vendas imobiliárias com 15 anos de experiência
no Brasil. Você é direto, empático, persuasivo. Nunca soa como robô.
Sempre termina com CTA clara e específica."

FUNCIONALIDADES EXTRAS:
- Botão "Regenerar" para nova versão
- Salvar como Favorito
- Histórico das últimas 20 mensagens
- Assinatura personalizada do corretor

ROTAS DE API:
POST /api/messages/generate   → Gerar mensagens com IA
GET  /api/messages/history    → Histórico de mensagens geradas
POST /api/messages/favorites  → Salvar como favorito
GET  /api/messages/favorites  → Listar favoritos
```

---

## 📊 MÓDULO: INSIGHTS DE IA

### Especificação Completa

```
MÉTRICAS CALCULADAS (queries no Supabase via backend):
- Taxa de conversão geral e por fonte de lead
- Tempo médio entre cadastro e fechamento (dias)
- Ticket médio das vendas fechadas
- Perfil mais comum dos clientes convertidos
- Melhor dia/hora para contato (baseado em histórico)

INSIGHTS GERADOS PELA IA:
Formato: "Você tem X clientes no estágio Y há mais de Z dias.
Clientes com esse perfil respondem melhor a [abordagem].
Quer gerar uma mensagem personalizada para eles?"

VISUALIZAÇÕES:
- Funil de vendas interativo
- Mapa de calor de atividade por dia da semana
- Gráfico de evolução da taxa de conversão

ROTAS DE API:
GET  /api/insights/metrics   → Métricas calculadas
POST /api/insights/generate  → Gerar insights com IA
GET  /api/insights/alerts    → Alertas ativos
```

---

## ⚙️ MÓDULO: CONFIGURAÇÕES

### Especificação Completa

```
PERFIL:
- Editar nome, telefone, CRECI
- Upload de avatar → Supabase Storage (bucket: avatars)
- Alterar email  → supabase.auth.updateUser({ email: novoEmail })
- Alterar senha  → supabase.auth.updateUser({ password: novaSenha })

ASSINATURA DE MENSAGENS:
- Texto rico com variáveis: {nome}, {telefone}, {email}, {creci}
- Preview em tempo real + toggle ativo/inativo

PREFERÊNCIAS:
- Tom padrão, tipos de imóvel, regiões de atuação

NOTIFICAÇÕES:
- Alertas de leads esfriando
- Frequência dos insights: Diário | Semanal | Sob demanda

ROTAS DE API:
GET  /api/settings        → Buscar configurações (tabela user_settings)
PUT  /api/settings        → Atualizar configurações
POST /api/settings/avatar → Upload para Supabase Storage + atualizar URL no perfil
```

---

## 🗄️ SCHEMA DO BANCO DE DADOS (Supabase SQL Editor)

> Execute estes SQLs diretamente no **SQL Editor do Supabase Dashboard**.

### Tabelas

```sql
-- Perfil estendido do usuário (complementa auth.users)
CREATE TABLE public.user_profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  phone       TEXT,
  creci       TEXT,
  avatar_url  TEXT,
  plan        TEXT NOT NULL DEFAULT 'free',
  settings    JSONB DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Clientes / CRM
CREATE TABLE public.clients (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  phone             TEXT NOT NULL,
  email             TEXT,
  client_type       TEXT NOT NULL DEFAULT 'buyer',
  property_type     TEXT,
  min_value         NUMERIC(12,2),
  max_value         NUMERIC(12,2),
  location          TEXT,
  bedrooms          INT,
  status            TEXT NOT NULL DEFAULT 'lead',
  source            TEXT,
  notes             TEXT,
  ai_profile        TEXT,
  ai_score          INT,
  last_contacted_at TIMESTAMPTZ,
  deleted_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- Histórico de interações
CREATE TABLE public.client_history (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id  UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL, -- note | message | call | visit | proposal | status_change
  note       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Simulações financeiras
CREATE TABLE public.simulations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id         UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  property_value    NUMERIC(12,2) NOT NULL,
  down_payment      NUMERIC(12,2) NOT NULL,
  monthly_payment   NUMERIC(12,2) NOT NULL,
  monthly_count     INT NOT NULL,
  intermediate_pmts JSONB,
  financed_value    NUMERIC(12,2) NOT NULL,
  interest_rate     NUMERIC(5,4),
  result            JSONB NOT NULL,
  ai_scenarios      JSONB,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- Mensagens geradas pela IA
CREATE TABLE public.messages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id     UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  funnel_stage  TEXT NOT NULL,
  tone          TEXT NOT NULL,
  property_type TEXT,
  whatsapp      TEXT NOT NULL,
  script        TEXT NOT NULL,
  objection     TEXT NOT NULL,
  is_favorite   BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Insights gerados pela IA
CREATE TABLE public.insights (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  type       TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Row Level Security (RLS)

```sql
-- Ativar RLS em todas as tabelas
ALTER TABLE public.user_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insights       ENABLE ROW LEVEL SECURITY;

-- Cada usuário acessa apenas seus próprios dados
CREATE POLICY "user_profiles: acesso próprio"
  ON public.user_profiles FOR ALL USING (id = auth.uid());

CREATE POLICY "clients: acesso próprio"
  ON public.clients FOR ALL USING (user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY "client_history: acesso próprio"
  ON public.client_history FOR ALL USING (user_id = auth.uid());

CREATE POLICY "simulations: acesso próprio"
  ON public.simulations FOR ALL USING (user_id = auth.uid());

CREATE POLICY "messages: acesso próprio"
  ON public.messages FOR ALL USING (user_id = auth.uid());

CREATE POLICY "insights: acesso próprio"
  ON public.insights FOR ALL USING (user_id = auth.uid());
```

### Trigger: criar perfil ao registrar usuário

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Supabase Storage (Bucket de Avatares)

```sql
-- Criar via Dashboard > Storage ou SQL:
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

CREATE POLICY "avatars: upload próprio"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "avatars: leitura pública"
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
```

### Exemplo de Upload de Avatar (Frontend)

```javascript
const uploadAvatar = async (file) => {
  const ext      = file.name.split('.').pop();
  const filePath = `${user.id}/avatar.${ext}`;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (!error) {
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    await supabase.from('user_profiles')
      .update({ avatar_url: data.publicUrl })
      .eq('id', user.id);
  }
};
```

---

## 🧠 INTEGRAÇÃO COM OPENAI

### Configuração e Função Base

```javascript
// backend/src/config/openai.js
import OpenAI from 'openai';
export default new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// backend/src/services/ai.service.js
import openai from '../config/openai.js';

export async function callAI({ systemPrompt, userPrompt, maxTokens = 1000, format = 'text' }) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt   }
      ],
      max_tokens: maxTokens,
      response_format: format === 'json' ? { type: 'json_object' } : { type: 'text' },
      temperature: 0.7,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('[AI Error]', error.message);
    throw new Error('Serviço de IA temporariamente indisponível');
  }
}
```

### System Prompts por Módulo

```javascript
// CLASSIFICAÇÃO DE CLIENTE
export const CLIENT_CLASSIFICATION_SYSTEM = `
Você é um especialista em perfil de compradores imobiliários no Brasil.
Retorne APENAS JSON:
{
  "score": número 1-10,
  "profile": "2 linhas descrevendo o perfil",
  "approach": "abordagem recomendada",
  "urgency": "alta | média | baixa",
  "bestContact": "melhor forma/horário de contato"
}`;

// GERADOR DE MENSAGENS
export const MESSAGE_GENERATOR_SYSTEM = `
Você é Carlos, especialista em vendas imobiliárias com 15 anos de experiência no Brasil.
Natural, persuasivo, nunca robótico. CTA clara sempre.
Retorne APENAS JSON: { "whatsapp": string, "script": string, "objection": string }`;

// CENÁRIOS FINANCEIROS
export const SIMULATION_SCENARIOS_SYSTEM = `
Consultor financeiro imobiliário brasileiro.
Retorne APENAS JSON com três chaves: "conservative", "moderate", "aggressive".
Cada uma com: name, description, adjustments, pros[], cons[], idealProfile.`;

// INSIGHTS DE PERFORMANCE
export const INSIGHTS_SYSTEM = `
Coach de vendas imobiliárias. Analise as métricas e gere insights acionáveis.
Cada insight: identifica padrão → explica impacto → sugere ação específica.
Tom: direto, encorajador, baseado em dados.`;
```

---

## 📁 ESTRUTURA DE PASTAS

```
imobiflow-ai/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/            # Button, Input, Badge, Modal, Skeleton...
│   │   │   ├── layout/        # Sidebar, TopBar, PageHeader
│   │   │   └── shared/
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── lib/
│   │   │   └── supabase.js    # Cliente anon key
│   │   ├── pages/
│   │   │   ├── auth/          # Login, Cadastro, EsqueciSenha, NovaSenha
│   │   │   ├── dashboard/
│   │   │   ├── clients/
│   │   │   ├── simulation/
│   │   │   ├── messages/
│   │   │   ├── insights/
│   │   │   └── settings/
│   │   ├── hooks/
│   │   ├── services/          # Axios para o backend Express
│   │   ├── store/             # Zustand
│   │   ├── utils/
│   │   ├── types/
│   │   └── App.tsx
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── supabase.js    # Clientes admin + auth
│   │   │   └── openai.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── rateLimit.middleware.js
│   │   ├── modules/
│   │   │   ├── clients/
│   │   │   ├── dashboard/
│   │   │   ├── simulations/
│   │   │   ├── messages/
│   │   │   ├── insights/
│   │   │   └── settings/
│   │   ├── services/
│   │   │   └── ai.service.js
│   │   ├── utils/
│   │   └── app.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

> ✅ **Sem Docker necessário** — Supabase roda na nuvem. Rode apenas frontend e backend localmente.

---

## ⚡ FUNCIONALIDADES AVANÇADAS

### Realtime com Supabase

```javascript
// Notificações em tempo real de novos insights
const channel = supabase
  .channel('insights')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'insights',
    filter: `user_id=eq.${user.id}`
  }, (payload) => {
    toast.info(payload.new.content);
  })
  .subscribe();

// Limpar ao desmontar o componente
return () => supabase.removeChannel(channel);
```

### Modo Escuro

```
Tailwind dark mode (class strategy):
- Toggle no TopBar com ícone sol/lua
- Preferência salva em localStorage
- Respeitar prefers-color-scheme do sistema
- Transição suave entre modos
```

### Exportação PDF

```
jsPDF + html2canvas:
- Template com logo ImobiFlow AI
- Dados do corretor no cabeçalho
- Cronograma em tabela
- Rodapé com data e número da proposta
```

---

## 🚀 VARIÁVEIS DE AMBIENTE

```env
# ── Frontend (.env) ────────────────────────────────────────
VITE_SUPABASE_URL="https://xxxxxxxxxxxx.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_API_URL="http://localhost:3000"

# ── Backend (.env) ─────────────────────────────────────────
SUPABASE_URL="https://xxxxxxxxxxxx.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
OPENAI_API_KEY="sk-..."
CLIENT_URL="http://localhost:5173"
PORT=3000
```

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` concede acesso total ao banco (ignora RLS). **Nunca exponha no frontend.**

---

## ✅ CHECKLIST DE ENTREGA

### Supabase (configurar no Dashboard)
- [ ] Projeto criado e credenciais copiadas
- [ ] Tabelas criadas via SQL Editor
- [ ] RLS ativado em todas as tabelas com políticas
- [ ] Trigger `handle_new_user` configurado
- [ ] Bucket `avatars` criado com políticas de acesso
- [ ] Auth → Templates de email configurados em português
- [ ] Auth → URLs de redirecionamento configuradas (localhost + produção)

### Backend (Node.js + Express)
- [ ] Setup do projeto com Express
- [ ] Middleware de autenticação via Supabase JWT (`auth.getUser`)
- [ ] CRUD completo de clientes via `supabaseAdmin`
- [ ] Histórico e notas de clientes
- [ ] Calculadora financeira com cronograma
- [ ] Integração OpenAI (classificação, mensagens, cenários, insights)
- [ ] Dashboard com métricas agregadas
- [ ] Sistema de insights automáticos
- [ ] Configurações de usuário
- [ ] Rate limiting e tratamento de erros global
- [ ] Logs com Winston

### Frontend (React + Vite + Tailwind + TypeScript)
- [ ] Supabase client configurado (`anon key`)
- [ ] `AuthContext` com `onAuthStateChange`
- [ ] `<ProtectedRoute>` e `<GuestRoute>`
- [ ] Fluxo completo: Login / Cadastro / Recuperação / Nova Senha
- [ ] Dashboard com gráficos (Recharts)
- [ ] CRM (tabela + kanban + detalhe + histórico)
- [ ] Calculadora de fluxo com exportação PDF
- [ ] Gerador de mensagens com IA
- [ ] Tela de insights
- [ ] Configurações com upload de avatar (Supabase Storage)
- [ ] Notificações Realtime
- [ ] Modo escuro
- [ ] Responsividade mobile
- [ ] Loading states, feedback visual e tela 404

---

## 📝 REGRAS PARA A IA DESENVOLVEDORA

```
Ao gerar o código deste sistema, siga OBRIGATORIAMENTE:

1. SUPABASE FIRST
   Não instale bcrypt, jsonwebtoken, Prisma, Nodemailer ou pg.
   O Supabase substitui tudo isso nativamente.

2. SEGURANÇA
   service_role key → APENAS no backend (variável de ambiente).
   anon key → frontend, sempre com RLS ativo no banco.

3. QUALIDADE
   Código limpo, TypeScript estrito, comentários onde necessário.

4. VALIDAÇÃO
   Zod no backend para todos os inputs das rotas Express.

5. UX
   Todo estado de loading com feedback visual (skeleton ou spinner).

6. DADOS
   Soft delete obrigatório — use deleted_at, nunca DELETE físico.

7. IA
   Todas as chamadas à OpenAI com try/catch e mensagem de fallback amigável.

8. PERFORMANCE
   React.memo e useMemo onde aplicável. React Query para cache e refetch.

9. ACESSIBILIDADE
   Labels em formulários, alt em imagens, roles ARIA.

10. INTERNACIONALIZAÇÃO
    R$ com: Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

Ao gerar cada módulo, entregue:
→ Código completo e funcional (sem TODOs ou placeholders)
→ SQL do Supabase quando necessário
→ Exemplos de uso integrados
→ Pronto para integrar ao projeto
```

---

*ImobiFlow AI — Prompt Mestre v2.0*  
*Stack: React · Node.js · **Supabase** (Auth + DB + Storage + Realtime) · OpenAI API*  
*Todos os módulos são interdependentes e devem seguir as convenções definidas neste documento*
