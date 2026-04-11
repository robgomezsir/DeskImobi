-- CRM: user_profiles (if missing), clients, RLS, indexes, updated_at trigger
-- Supabase PostgreSQL 15+

-- Perfil estendido do usuário (complementa auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
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
CREATE TABLE IF NOT EXISTS public.clients (
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
  updated_at        TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT clients_status_check CHECK (
    status IN ('lead', 'contact', 'negotiation', 'closed', 'lost')
  ),
  CONSTRAINT clients_client_type_check CHECK (
    client_type IN ('buyer', 'tenant', 'investor')
  )
);

CREATE INDEX IF NOT EXISTS clients_user_id_idx ON public.clients (user_id);
CREATE INDEX IF NOT EXISTS clients_deleted_at_idx ON public.clients (deleted_at);
CREATE INDEX IF NOT EXISTS clients_status_idx ON public.clients (status);
CREATE INDEX IF NOT EXISTS clients_created_at_idx ON public.clients (created_at DESC);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at ON public.clients;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- user_profiles: usuário só acessa o próprio perfil
DROP POLICY IF EXISTS "user_profiles_select_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_delete_own" ON public.user_profiles;

CREATE POLICY "user_profiles_select_own"
  ON public.user_profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "user_profiles_insert_own"
  ON public.user_profiles FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "user_profiles_update_own"
  ON public.user_profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "user_profiles_delete_own"
  ON public.user_profiles FOR DELETE
  USING (id = auth.uid());

-- clients: SELECT apenas linhas ativas do próprio usuário
DROP POLICY IF EXISTS "clients_select_active_own" ON public.clients;
DROP POLICY IF EXISTS "clients_insert_own" ON public.clients;
DROP POLICY IF EXISTS "clients_update_own" ON public.clients;
DROP POLICY IF EXISTS "clients_delete_own" ON public.clients;

CREATE POLICY "clients_select_active_own"
  ON public.clients FOR SELECT
  USING (user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY "clients_insert_own"
  ON public.clients FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "clients_update_own"
  ON public.clients FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "clients_delete_own"
  ON public.clients FOR DELETE
  USING (user_id = auth.uid());
