CREATE TABLE public.viewing_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  visit_type text NOT NULL DEFAULT 'site',
  preferred_at text,
  notes text,
  status text NOT NULL DEFAULT 'requested',
  source text NOT NULL DEFAULT 'whatsapp_ai',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.viewing_bookings TO authenticated;
GRANT ALL ON public.viewing_bookings TO service_role;
ALTER TABLE public.viewing_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff read bookings" ON public.viewing_bookings
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'sales'));

CREATE POLICY "Staff write bookings" ON public.viewing_bookings
FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'sales'))
WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'sales'));

CREATE TABLE public.ai_assistant_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  auto_reply boolean NOT NULL DEFAULT true,
  handoff_minutes integer NOT NULL DEFAULT 60,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.ai_assistant_settings TO authenticated;
GRANT ALL ON public.ai_assistant_settings TO service_role;
ALTER TABLE public.ai_assistant_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff read ai settings" ON public.ai_assistant_settings
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'sales'));

CREATE POLICY "Admins update ai settings" ON public.ai_assistant_settings
FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin'))
WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.ai_assistant_settings (id) VALUES (true) ON CONFLICT DO NOTHING;
