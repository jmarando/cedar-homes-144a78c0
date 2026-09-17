/*
 * Server-only: records email delivery outcomes (bounce, complaint,
 * unsubscribe) on the matching lead's timeline so the sales desk can see them.
 * Suppression itself is enforced by Lovable — nothing here gates sending.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";

type EmailEventKind = "bounced" | "complaint" | "unsubscribed";

const LABEL: Record<EmailEventKind, string> = {
  bounced: "Email bounced — this address could not be delivered to.",
  complaint: "Recipient marked a Cedar Homes email as spam.",
  unsubscribed: "Recipient unsubscribed from Cedar Homes emails.",
};

export async function recordEmailEvent(
  kind: EmailEventKind,
  recipient: string | null,
  eventId: string,
): Promise<void> {
  if (!recipient) return;
  const address = recipient.toLowerCase();

  // Idempotent: the same delivery may be retried.
  const { data: existing } = await supabaseAdmin
    .from("lead_activities")
    .select("id")
    .eq("external_id", eventId)
    .maybeSingle();
  if (existing) return;

  const { data: lead } = await supabaseAdmin
    .from("leads")
    .select("id")
    .eq("email", address)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabaseAdmin.from("lead_activities").insert({
    lead_id: lead?.id ?? null,
    channel: "email",
    direction: "inbound",
    subject: "Email delivery update",
    body: LABEL[kind],
    contact_handle: address,
    external_id: eventId,
    status: kind,
  });
  if (error) {
    console.error("[email-events] insert failed", error.message);
    throw new Error("Could not record email event");
  }
}
