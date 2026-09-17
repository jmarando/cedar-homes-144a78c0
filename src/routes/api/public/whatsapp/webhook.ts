/*
 * WhatsApp webhook receiver — the Lovable connector forwards every Meta change
 * for the connected number to exactly this path:
 *   POST /api/public/whatsapp/webhook
 *
 * Every delivery is signature-verified, durably stored in the
 * whatsapp_webhook_events inbox, then processed idempotently:
 *   - whatsapp.message  → inbound message, matched to a lead, logged to the inbox
 *   - whatsapp.status   → delivery status reconciled onto the outbound record
 * Unknown event types are stored and acknowledged without discarding payloads.
 */
import { createFileRoute } from "@tanstack/react-router";
import { verifyWebhookRequest } from "@lovable.dev/webhooks-js";

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyObj = any;

const STATUS_RANK: Record<string, number> = {
  sent: 1,
  delivered: 2,
  read: 3,
  failed: 4,
};

function extractBody(message: AnyObj): string {
  return (
    message.text?.body ??
    message.button?.text ??
    message.interactive?.list_reply?.title ??
    message.interactive?.button_reply?.title ??
    `[${message.type ?? "message"}]`
  );
}

async function getAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

/** Reconcile one delivery status onto the outbound lead_activities row. Retry-safe. */
async function reconcileStatus(db: Awaited<ReturnType<typeof getAdmin>>, status: AnyObj): Promise<boolean> {
  const id: string | undefined = status?.id;
  if (!id) return true;
  const newStatus: string = status?.status ?? "";
  if (!newStatus) return true;

  const { data: existing } = await db
    .from("lead_activities")
    .select("id, status, metadata")
    .eq("external_id", id)
    .maybeSingle();

  if (!existing) return false; // Outbound record not saved yet — keep pending.

  const currentRank = STATUS_RANK[existing.status ?? ""] ?? 0;
  const newRank = STATUS_RANK[newStatus] ?? 0;
  // An older callback must never overwrite delivered/read; failed is terminal.
  if (newRank < currentRank) return true;

  const providerTs = status?.timestamp
    ? new Date(Number(status.timestamp) * 1000).toISOString()
    : new Date().toISOString();

  const metadata: AnyObj = { ...(existing.metadata ?? ({} as AnyObj)) };
  const timestamps: AnyObj = { ...(metadata.status_timestamps ?? ({} as AnyObj)) };
  timestamps[newStatus] = providerTs;
  metadata.status_timestamps = timestamps;
  if (Array.isArray(status?.errors) && status.errors.length > 0) {
    metadata.errors = status.errors;
  }

  await db.from("lead_activities").update({ status: newStatus, metadata }).eq("id", existing.id);
  return true;
}

/** Bounded recovery pass over earlier deliveries still awaiting reconciliation. */
async function recoverPending(db: Awaited<ReturnType<typeof getAdmin>>): Promise<void> {
  const { data: pending } = await db
    .from("whatsapp_webhook_events")
    .select("id, pending_reconciliation")
    .not("pending_reconciliation", "is", null)
    .order("received_at", { ascending: true })
    .limit(20);
  if (!pending) return;

  for (const row of pending) {
    const statuses: AnyObj[] = (row.pending_reconciliation ?? []) as AnyObj[];
    const stillPending: AnyObj[] = [];
    for (const status of statuses) {
      const ok = await reconcileStatus(db, status);
      if (!ok) stillPending.push(status);
    }
    await db
      .from("whatsapp_webhook_events")
      .update({ pending_reconciliation: stillPending.length > 0 ? stillPending : null })
      .eq("id", row.id);
  }
}

async function processEvent(
  db: Awaited<ReturnType<typeof getAdmin>>,
  event: string,
  payload: AnyObj,
): Promise<AnyObj[]> {
  const { msisdnTail, normalizeMsisdn } = await import("@/lib/whatsapp.server");
  const pendingStatuses: AnyObj[] = [];

  for (const entry of payload?.entry ?? []) {
    for (const change of entry?.changes ?? []) {
      const value: AnyObj = change?.value ?? {};
      const contacts: AnyObj[] = value.contacts ?? [];

      if (event === "whatsapp.message") {
        for (const message of value.messages ?? []) {
          if (!message?.id) continue;
          // Deduplicate inbound messages by message id.
          const { data: dupe } = await db
            .from("lead_activities")
            .select("id")
            .eq("external_id", message.id)
            .maybeSingle();
          if (dupe) continue;

          const from: string = message.from ?? "";
          const tail = msisdnTail(from);
          const profileName = contacts.find((c) => c?.wa_id === from)?.profile?.name ?? null;

          const { data: lead } = await db
            .from("leads")
            .select("id")
            .like("phone", `%${tail}`)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          const { error } = await db.from("lead_activities").insert({
            lead_id: lead?.id ?? null,
            channel: "whatsapp",
            direction: "inbound",
            subject: profileName ? `WhatsApp from ${profileName}` : "WhatsApp message",
            body: extractBody(message),
            contact_handle: normalizeMsisdn(from),
            external_id: message.id,
            status: "received",
            occurred_at: message.timestamp
              ? new Date(Number(message.timestamp) * 1000).toISOString()
              : new Date().toISOString(),
          });
          if (error) throw new Error(error.message);

          // AI auto-reply. Never throws — it must not fail the delivery.
          const { handleInboundMessage } = await import("@/lib/assistant.server");
          await handleInboundMessage(db, {
            leadId: lead?.id ?? null,
            from,
            profileName,
            text: extractBody(message),
          });
        }
      } else if (event === "whatsapp.status") {
        for (const status of value.statuses ?? []) {
          if (!status?.id) continue;
          const ok = await reconcileStatus(db, status);
          if (!ok) pendingStatuses.push(status);
        }
      }
      // Every other event type (message_error, template_status, history, …) is
      // stored in the inbox payload and acknowledged without discarding.
    }
  }

  return pendingStatuses;
}

export const Route = createFileRoute("/api/public/whatsapp/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const deliveryId = request.headers.get("x-lovable-delivery");
        const event = request.headers.get("x-lovable-event");
        if (!deliveryId || !event) {
          return new Response("Missing delivery headers", { status: 400 });
        }

        let raw: string;
        try {
          raw = await request.text();
        } catch {
          return new Response("Unreadable body", { status: 400 });
        }

        // The library reads the body itself — hand it a fresh Request built from
        // the raw text already read above (a body can only be consumed once).
        const reqForVerify = new Request(request.url, {
          method: "POST",
          headers: request.headers,
          body: raw,
        });
        try {
          await verifyWebhookRequest({
            req: reqForVerify,
            secrets: [
              process.env["WHATSAPP_API_KEY"] ?? "",
              process.env["LOVABLE_API_KEY"] ?? "",
            ],
            maxBodyBytes: 4 * 1024 * 1024,
            parser: (body) => body,
          });
        } catch {
          return new Response("Invalid signature", { status: 401 });
        }

        const db = await getAdmin();

        // Durable receipt first: a failed write must return 5xx so the gateway retries.
        const { data: inboxRow, error: inboxError } = await db
          .from("whatsapp_webhook_events")
          .upsert(
            { delivery_id: deliveryId, event, payload: JSON.parse(raw) },
            { onConflict: "delivery_id" },
          )
          .select("id, processed_at")
          .maybeSingle();
        if (inboxError || !inboxRow) {
          console.error("[whatsapp] inbox write failed:", inboxError?.message);
          return new Response("Inbox unavailable", { status: 500 });
        }

        // Duplicate delivery: skip only when it already completed.
        if (inboxRow.processed_at) return new Response("ok", { status: 200 });

        try {
          await recoverPending(db);
          const payload = JSON.parse(raw);
          const pendingStatuses = await processEvent(db, event, payload);
          await db
            .from("whatsapp_webhook_events")
            .update({
              processed_at: new Date().toISOString(),
              processing_error: null,
              pending_reconciliation: pendingStatuses.length > 0 ? pendingStatuses : null,
            })
            .eq("id", inboxRow.id);
        } catch (err: any) {
          await db
            .from("whatsapp_webhook_events")
            .update({ processing_error: String(err?.message ?? err) })
            .eq("id", inboxRow.id);
          return new Response("Processing failed", { status: 500 });
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
