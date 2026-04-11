-- Histórico de mensagens geradas: RLS + integridade client_id ↔ user_id
-- Executar após public.clients existir.

CREATE TABLE IF NOT EXISTS public.messages (
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

CREATE INDEX IF NOT EXISTS messages_user_id_idx ON public.messages (user_id);
CREATE INDEX IF NOT EXISTS messages_client_id_idx ON public.messages (client_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON public.messages (created_at DESC);

-- Garantir que client_id (se preenchido) pertence ao mesmo user_id da linha
CREATE OR REPLACE FUNCTION public.messages_enforce_client_owner()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.client_id IS NULL THEN
    RETURN NEW;
  END IF;
  IF NOT EXISTS (
    SELECT 1
    FROM public.clients c
    WHERE c.id = NEW.client_id
      AND c.user_id = NEW.user_id
      AND c.deleted_at IS NULL
  ) THEN
    RAISE EXCEPTION 'messages.client_id deve referir um cliente do mesmo utilizador';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS messages_enforce_client_owner ON public.messages;
CREATE TRIGGER messages_enforce_client_owner
  BEFORE INSERT OR UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.messages_enforce_client_owner();

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_select_own" ON public.messages;
DROP POLICY IF EXISTS "messages_insert_own" ON public.messages;
DROP POLICY IF EXISTS "messages_update_own" ON public.messages;
DROP POLICY IF EXISTS "messages_delete_own" ON public.messages;

CREATE POLICY "messages_select_own"
  ON public.messages FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "messages_insert_own"
  ON public.messages FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "messages_update_own"
  ON public.messages FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "messages_delete_own"
  ON public.messages FOR DELETE
  USING (user_id = auth.uid());

COMMENT ON TABLE public.messages IS 'Scripts gerados; isolado por user_id; client_id validado ao dono do cliente';
