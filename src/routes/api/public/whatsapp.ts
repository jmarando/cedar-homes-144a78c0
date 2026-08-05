/*
 * WhatsApp Business Cloud API webhook.
 * GET  — Meta verification handshake.
 * POST — inbound messages and delivery statuses, logged to the unified inbox.
 */
import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";

export const Route = createFileRoute("/api/public/whatsapp")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const mode = url.searchParams.get("hub.mode");
        const token = url.searchParams.get("hub.verify_token");
        const challenge = url.searchParams.get("hub.challenge");
        const expected = process.env["WHATSAPP_VERIFY_TOKEN"];
        if (mode === "subscribe" && expected && token === expected) {
          return new Response(challenge ?? "", { status: 200 });
        }
        return new Response("Forbidden", { status: 403 });
      },

      POST: async ({ request }) => {
        const raw = await request.text();

        const appSecret = process.env["WHATSAPP_APP_SECRET"];
        if (appSecret) {
          const header = request.headers.get("x-hub-signature-256") ?? "";
          const expected = `sha256=${createHmac("sha256", appSecret).update(raw).digest("hex")}`;
          const a = Buffer.from(header);
          const b = Buffer.from(expected);
          if (a.length !== b.length || !timingSafeEqual(a, b)) {
            return new Response("Invalid signature", { status: 401 });
          }
        }

        let payload: any;
        try {
          payload = JSON.parse(raw);
        } catch {
          return new Response("Bad payload", { status: 400 });
        }

        const { msisdnTail, normalizeMsisdn } = await import("@/lib/whatsapp.server");
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        for (const entry of payload?.entry ?? []) {
          for (const change of entry?.changes ?? []) {
            const value = change?.value ?? {};
            const contacts: any[] = value.contacts ?? [];

            for (const message of value.messages ?? []) {
              const from: string = message.from ?? "";
              const tail = msisdnTail(from);
              const profileName =
                contacts.find((c) => c?.wa_id === from)?.profile?.name ?? null;

              const body =
                message.text?.body ??
                message.button?.text ??
                message.interactive?.list_reply?.title ??
                message.interactive?.button_reply?.title ??
                `[${message.type ?? "message"}]`;

              const { data: lead } = await supabaseAdmin
                .from("leads")
                .select("id")
                .like("phone", `%${tail}`)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();

              await supabaseAdmin.from("lead_activities").insert({
                lead_id: lead?.id ?? null,
                channel: "whatsapp",
                direction: "inbound",
                subject: profileName ? `WhatsApp from ${profileName}` : "WhatsApp message",
                body,
                contact_handle: normalizeMsisdn(from),
                external_id: message.id ?? null,
                status: "received",
                occurred_at: message.timestamp
                  ? new Date(Number(message.timestamp) * 1000).toISOString()
                  : new Date().toISOString(),
              });
            }

            for (const status of value.statuses ?? []) {
              if (!status?.id) continue;
              await supabaseAdmin
                .from("lead_activities")
                .update({ status: status.status ?? null })
                .eq("external_id", status.id);
            }
          }
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
