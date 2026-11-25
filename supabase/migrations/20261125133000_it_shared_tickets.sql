ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_select_own_tickets ON public.tickets;
DROP POLICY IF EXISTS users_insert_own_tickets ON public.tickets;
DROP POLICY IF EXISTS users_update_own_tickets ON public.tickets;
DROP POLICY IF EXISTS users_delete_own_tickets ON public.tickets;

CREATE POLICY users_select_own_tickets_or_it
  ON public.tickets FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'it'
  );

CREATE POLICY users_insert_own_tickets
  ON public.tickets FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY it_updates_tickets
  ON public.tickets FOR UPDATE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'it')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'it');

CREATE POLICY owners_delete_open_tickets_or_it
  ON public.tickets FOR DELETE TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'it'
    OR (auth.uid() = user_id AND status = 'aberto')
  );

REVOKE UPDATE ON TABLE public.tickets FROM PUBLIC, anon, authenticated;
GRANT UPDATE (status) ON TABLE public.tickets TO authenticated;
