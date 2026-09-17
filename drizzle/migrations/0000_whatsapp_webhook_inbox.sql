-- Inbox for WhatsApp webhook deliveries forwarded by the Lovable connector.
CREATE TABLE public.whatsapp_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id text NOT NULL UNIQUE,
  event text NOT NULL,
  payload jsonb NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  processing_error text,
  pending_reconciliation jsonb
);

GRANT ALL ON public.whatsapp_webhook_events TO service_role;
GRANT SELECT ON public.whatsapp_webhook_events TO authenticated;

ALTER TABLE public.whatsapp_webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can read whatsapp webhook events"
  ON public.whatsapp_webhook_events
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'sales'));

CREATE INDEX whatsapp_webhook_events_pending_idx
  ON public.whatsapp_webhook_events (received_at)
  WHERE processed_at IS NULL OR pending_reconciliation IS NOT NULL;