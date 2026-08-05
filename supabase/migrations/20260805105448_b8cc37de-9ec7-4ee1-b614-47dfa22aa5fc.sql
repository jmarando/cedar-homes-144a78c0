CREATE TYPE public.app_role AS ENUM ('admin', 'sales', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE TYPE public.lead_stage AS ENUM (
  'new', 'contacted', 'qualified', 'visit_booked', 'visited', 'negotiating', 'deposit_paid', 'lost'
);

CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text,
  email text NOT NULL,
  phone text NOT NULL,
  interest text NOT NULL,
  persona text,
  message text,
  budget text,
  timeline text,
  country text,
  preferred_contact text NOT NULL DEFAULT 'whatsapp',
  source text NOT NULL DEFAULT 'website',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  referrer text,
  landing_page text,
  lead_score integer NOT NULL DEFAULT 0,
  stage public.lead_stage NOT NULL DEFAULT 'new',
  internal_notes text,
  last_contacted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX leads_stage_idx ON public.leads (stage);

GRANT INSERT ON public.leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
  ON public.leads FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Staff can view leads"
  ON public.leads FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'sales'));

CREATE POLICY "Staff can update leads"
  ON public.leads FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'sales'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'sales'));

CREATE POLICY "Admins can delete leads"
  ON public.leads FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER leads_set_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.score_lead()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  s integer := 10;
BEGIN
  IF NEW.interest IN ('showhouse-visit', 'buy-showhouse') THEN s := s + 40;
  ELSIF NEW.interest IN ('pre-order', 'roi-calculator') THEN s := s + 35;
  ELSIF NEW.interest IN ('virtual-tour', 'investment-brief') THEN s := s + 25;
  ELSIF NEW.interest = 'payment-plan' THEN s := s + 20;
  END IF;

  IF NEW.timeline IN ('0-3-months', 'immediately') THEN s := s + 20;
  ELSIF NEW.timeline = '3-6-months' THEN s := s + 10;
  END IF;

  IF NEW.phone IS NOT NULL AND length(NEW.phone) >= 9 THEN s := s + 10; END IF;
  IF NEW.message IS NOT NULL AND length(NEW.message) > 20 THEN s := s + 5; END IF;

  NEW.lead_score := least(s, 100);
  RETURN NEW;
END;
$$;

CREATE TRIGGER leads_score
  BEFORE INSERT ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.score_lead();