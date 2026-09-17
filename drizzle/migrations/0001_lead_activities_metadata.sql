-- Metadata for lead activities: per-status timestamps, automation tags, etc.
ALTER TABLE public.lead_activities ADD COLUMN IF NOT EXISTS metadata jsonb;