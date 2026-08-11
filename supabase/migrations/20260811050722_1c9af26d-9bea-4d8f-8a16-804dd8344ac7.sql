-- Follow-up (nurture) templates
CREATE TABLE public.nurture_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  step_key text NOT NULL UNIQUE,
  title text NOT NULL,
  day_offset integer NOT NULL,
  channel text NOT NULL CHECK (channel IN ('whatsapp','email')),
  subject text,
  body text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.nurture_templates TO authenticated;
GRANT ALL ON public.nurture_templates TO service_role;
ALTER TABLE public.nurture_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view nurture templates" ON public.nurture_templates
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'sales'));

CREATE POLICY "Admins can manage nurture templates" ON public.nurture_templates
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER nurture_templates_set_updated_at
  BEFORE UPDATE ON public.nurture_templates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Scheduled follow-up tasks, one row per lead per step
CREATE TABLE public.nurture_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  template_id uuid NOT NULL REFERENCES public.nurture_templates(id) ON DELETE CASCADE,
  channel text NOT NULL,
  scheduled_for timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','sent','skipped','failed','cancelled')),
  attempts integer NOT NULL DEFAULT 0,
  sent_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (lead_id, template_id)
);

CREATE INDEX nurture_tasks_due_idx ON public.nurture_tasks (status, scheduled_for);
CREATE INDEX nurture_tasks_lead_idx ON public.nurture_tasks (lead_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.nurture_tasks TO authenticated;
GRANT ALL ON public.nurture_tasks TO service_role;
ALTER TABLE public.nurture_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view nurture tasks" ON public.nurture_tasks
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'sales'));

CREATE POLICY "Staff can update nurture tasks" ON public.nurture_tasks
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'sales'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'sales'));

CREATE TRIGGER nurture_tasks_set_updated_at
  BEFORE UPDATE ON public.nurture_tasks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Enqueue the whole sequence when a lead is created
CREATE OR REPLACE FUNCTION public.enqueue_nurture_for_lead()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.nurture_tasks (lead_id, template_id, channel, scheduled_for)
  SELECT NEW.id, t.id, t.channel, NEW.created_at + (t.day_offset || ' days')::interval
  FROM public.nurture_templates t
  WHERE t.is_active
  ON CONFLICT (lead_id, template_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER leads_enqueue_nurture
  AFTER INSERT ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.enqueue_nurture_for_lead();

-- Stop the sequence once a lead converts or is lost
CREATE OR REPLACE FUNCTION public.cancel_nurture_on_stage()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.stage IN ('deposit_paid','lost') AND OLD.stage IS DISTINCT FROM NEW.stage THEN
    UPDATE public.nurture_tasks
    SET status = 'cancelled'
    WHERE lead_id = NEW.id AND status = 'pending';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER leads_cancel_nurture
  AFTER UPDATE OF stage ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.cancel_nurture_on_stage();

-- Seed the 7-step sequence
INSERT INTO public.nurture_templates (step_key, title, day_offset, channel, subject, body) VALUES
('day0-welcome', 'Day 0 — instant welcome', 0, 'whatsapp', NULL,
 'Hi {{first_name}}, this is Cedar Homes by GAP Developers. Thanks for your enquiry about our Kikuyu homes. I''m sending your info pack now — floor plans, pricing (Ksh 23.8M – 25M) and the payment plan options. When would suit you for a showhouse visit or a live video walkthrough?'),
('day1-call', 'Day 1 — personal call follow-up', 1, 'whatsapp', NULL,
 'Hi {{first_name}}, just following up on your Cedar Homes enquiry. Is now a good time for a quick call? Happy to answer anything about the units, title, or how the staged payments work.'),
('day3-video', 'Day 3 — showhouse walkthrough', 3, 'email', 'Walk through the Cedar Homes showhouse',
 'Hi {{first_name}},

Here''s the full showhouse walkthrough so you can see the finishes, the space and the neighbourhood for yourself.

If you''re abroad, we also run live video tours where you control what we point the camera at — just reply with a time that works in your timezone.

Cedar Homes by GAP Developers'),
('day7-payment', 'Day 7 — payment plan breakdown', 7, 'email', 'Your Cedar Homes payment options',
 'Hi {{first_name}},

Four ways to buy at Cedar Homes:

1. Cash — best price, fastest completion
2. Staged installments during construction
3. Mortgage — we introduce you to partner banks
4. Buy the showhouse (Unit 1) and move in immediately

Full breakdown here, and reply with any question at all.

Cedar Homes by GAP Developers'),
('day14-urgency', 'Day 14 — availability update', 14, 'whatsapp', NULL,
 'Hi {{first_name}}, quick availability update from Cedar Homes — units are moving and pre-completion pricing won''t hold once we hand over. Want me to hold a unit for you while you decide?'),
('day21-proof', 'Day 21 — buyer story', 21, 'email', 'How other buyers verified Cedar Homes',
 'Hi {{first_name}},

The question we get most — especially from buyers abroad — is "how do I know this is real?"

Here''s how our buyers verify us: an independent title search at the lands registry, an advocate of their own choosing reviewing the sale agreement, and monthly construction photos and video sent directly to them.

Happy to walk you through any of it.

Cedar Homes by GAP Developers'),
('day30-reengage', 'Day 30 — re-engagement', 30, 'whatsapp', NULL,
 'Hi {{first_name}}, checking in one last time on Cedar Homes. If the timing isn''t right, no problem at all — just let me know and I''ll stop the updates. If you''re still interested, I''ll send the latest availability and pricing.');