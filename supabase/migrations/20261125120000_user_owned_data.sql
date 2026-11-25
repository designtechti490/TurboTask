ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.tickets
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS tasks_user_id_created_at_idx
  ON public.tasks (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS tickets_user_id_created_at_idx
  ON public.tickets (user_id, created_at DESC);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  existing_policy record;
BEGIN
  FOR existing_policy IN
    SELECT tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('tasks', 'tickets')
  LOOP
    EXECUTE format(
      'DROP POLICY %I ON public.%I',
      existing_policy.policyname,
      existing_policy.tablename
    );
  END LOOP;
END;
$$;

CREATE POLICY users_select_own_tasks
  ON public.tasks FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY users_insert_own_tasks
  ON public.tasks FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY users_update_own_tasks
  ON public.tasks FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY users_delete_own_tasks
  ON public.tasks FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY users_select_own_tickets
  ON public.tickets FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY users_insert_own_tickets
  ON public.tickets FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY users_update_own_tickets
  ON public.tickets FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY users_delete_own_tickets
  ON public.tickets FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
