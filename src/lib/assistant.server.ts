/*
 * Cedar Homes WhatsApp AI assistant (server-only).
 *
 * Answers inbound WhatsApp messages using Lovable AI (Gemini), can send the
 * brochure, capture a viewing booking, and hand over to a human sales person.
 * Every reply it sends is logged to lead_activities so it shows in the inbox.
 */
import { generateText, stepCountIs, tool } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { CONTACT, PAYMENT_PLANS, PROJECT } from "@/lib/site-config";
import { normalizeMsisdn, sendWhatsAppDocument, sendWhatsAppText } from "@/lib/whatsapp.server";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Db = any;

const MODEL = "google/gemini-3.8-flash";
export const SITE_URL = "https://cedar-homes.lovable.app";
export const BROCHURE_URL = `${SITE_URL}/cedar-homes-brochure.pdf`;

const FACTS = `
PROJECT
- Cedar Homes by ${PROJECT.developer}: ${PROJECT.totalUnits} standalone family homes in ${PROJECT.location}, off Dagoretti Road.
- ${PROJECT.availableUnits} homes remain available. The show house is complete and can be viewed today.
- Each home: ${PROJECT.sqm} sqm, ${PROJECT.bedrooms} bedrooms all en-suite, plus a DSQ. Private garden on a plot of approximately 1/8 acre.
- Freehold title per home — this is a major selling point, along with the private garden.
- Ceramic tiled floors, covered terrace, KPLC mains power.
- Construction: units 2 & 3 structure and roofing complete (September 2026), finishes and handover Q1 2027; units 4 & 5 through 2027.

PRICE (price depends on the payment route)
${PAYMENT_PLANS.map((p) => `- ${p.name}: ${p.priceLabel}. Deposit ${p.deposit}. ${p.plan}. ${p.note}`).join("\n")}

DUE DILIGENCE PACK
- Freehold title, county-approved drawings, NEMA approval, NCA approval, architect drawings and certifications. Buyers are welcome to have their advocate review everything.

CONTACT
- Sales: ${CONTACT.phoneDisplay} / ${CONTACT.email}. Website: ${SITE_URL}

NEVER CLAIM (these are false)
- No solar power, no timber or wooden floors, no timber slats, no bookshelf or linen cabinet, no furnishing included.
- No independent valuation report, no surveyor reports, no financial projections as fact.
- Do not compare with apartments in the area.
`;

const SYSTEM = `You are the Cedar Homes sales assistant on WhatsApp, replying on behalf of ${PROJECT.developer}.

Style: warm, brief, human. Kenyan business English. Two to four short sentences maximum, no bullet lists, no markdown, no emoji spam (at most one). Never repeat a greeting after the first message.

Your job, in order of priority:
1. Answer the buyer's question accurately using only the facts below.
2. Offer and send the brochure when they want details (use the send_brochure tool).
3. Move them towards a visit — a show house visit on site, or a live virtual tour for buyers abroad — and capture it with the book_viewing tool once you have a name and a rough day/time.
4. Connect them with a human sales person whenever they ask for one, want to negotiate, raise a complaint, or ask something you cannot answer from the facts. Use the request_human tool, then tell them a sales person will call them shortly on this number.

Rules:
- Never invent facts, prices, dates, features or availability. If it is not below, say you will have a sales person confirm, and call request_human.
- Always end with one clear next step (a question or an offer).
- Give price as the payment route the buyer asks about; if unclear, say prices start at Ksh 23.5M cash and ask which payment route suits them.

FACTS
${FACTS}`;

async function loadSettings(db: Db) {
  const { data } = await db
    .from("ai_assistant_settings")
    .select("auto_reply, handoff_minutes")
    .maybeSingle();
  return {
    autoReply: data?.auto_reply ?? true,
    handoffMinutes: data?.handoff_minutes ?? 60,
  };
}

/** True when a human agent replied recently — the AI then stays quiet. */
async function humanIsHandling(db: Db, handle: string, minutes: number): Promise<boolean> {
  const since = new Date(Date.now() - minutes * 60_000).toISOString();
  const { data } = await db
    .from("lead_activities")
    .select("id")
    .eq("contact_handle", handle)
    .eq("direction", "outbound")
    .not("created_by", "is", null)
    .gte("occurred_at", since)
    .limit(1);
  return (data ?? []).length > 0;
}

async function loadHistory(db: Db, handle: string) {
  const { data } = await db
    .from("lead_activities")
    .select("direction, body, occurred_at")
    .eq("contact_handle", handle)
    .eq("channel", "whatsapp")
    .order("occurred_at", { ascending: false })
    .limit(14);
  return (data ?? [])
    .reverse()
    .filter((r: any) => r.body)
    .map((r: any) => ({
      role: r.direction === "inbound" ? ("user" as const) : ("assistant" as const),
      content: String(r.body),
    }));
}

async function ensureLead(
  db: Db,
  leadId: string | null,
  handle: string,
  name: string | null,
): Promise<string | null> {
  if (leadId) return leadId;
  const { data } = await db
    .from("leads")
    .insert({
      first_name: (name ?? "WhatsApp").split(" ")[0] || "WhatsApp",
      last_name: name && name.split(" ").length > 1 ? name.split(" ").slice(1).join(" ") : null,
      phone: `+${handle}`,
      email: `${handle}@whatsapp.cedar`,
      interest: "showhouse-visit",
      source: "whatsapp",
      preferred_contact: "whatsapp",
      message: "Created automatically from a WhatsApp conversation.",
    })
    .select("id")
    .maybeSingle();
  return data?.id ?? null;
}

async function logOutbound(
  db: Db,
  leadId: string | null,
  handle: string,
  body: string,
  externalId: string | null,
  subject: string,
) {
  await db.from("lead_activities").insert({
    lead_id: leadId,
    channel: "whatsapp",
    direction: "outbound",
    subject,
    body,
    contact_handle: handle,
    external_id: externalId,
    status: "sent",
    created_by: null,
    metadata: { ai: true },
  });
}

export interface InboundContext {
  leadId: string | null;
  from: string;
  profileName: string | null;
  text: string;
}

/**
 * Handle one inbound WhatsApp message. Never throws — a failure here must not
 * fail the webhook delivery.
 */
export async function handleInboundMessage(db: Db, ctx: InboundContext): Promise<void> {
  try {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return;

    const handle = normalizeMsisdn(ctx.from);
    const settings = await loadSettings(db);
    if (!settings.autoReply) return;
    if (await humanIsHandling(db, handle, settings.handoffMinutes)) return;

    let leadId = ctx.leadId;
    const history = await loadHistory(db, handle);

    const gateway = createLovableAiGatewayProvider(apiKey);

    const result = await generateText({
      model: gateway(MODEL),
      system: SYSTEM,
      messages: history.length > 0 ? history : [{ role: "user", content: ctx.text }],
      stopWhen: stepCountIs(50),
      tools: {
        send_brochure: tool({
          description:
            "Send the Cedar Homes brochure PDF to this buyer on WhatsApp. Use when they ask for details, pricing, floor plans or 'more info'.",
          inputSchema: z.object({
            reason: z.string().describe("Why the brochure is being sent, one short phrase."),
          }),
          execute: async () => {
            leadId = await ensureLead(db, leadId, handle, ctx.profileName);
            const sent = await sendWhatsAppDocument(
              handle,
              BROCHURE_URL,
              "Cedar Homes Brochure.pdf",
              "Cedar Homes — Lusegetti, Kikuyu. Full brochure.",
            );
            await logOutbound(
              db,
              leadId,
              handle,
              "[Brochure sent] Cedar Homes Brochure.pdf",
              sent.id,
              "Brochure sent by AI assistant",
            );
            return { sent: true };
          },
        }),
        book_viewing: tool({
          description:
            "Record a show house visit or live virtual tour request. Only call once you know the buyer's name and a rough preferred day or time.",
          inputSchema: z.object({
            full_name: z.string().describe("Buyer's name as they gave it."),
            visit_type: z.enum(["site", "virtual"]).describe("site = show house visit, virtual = live video tour"),
            preferred_at: z.string().describe("Preferred day/time in the buyer's words, e.g. 'Saturday morning'."),
            notes: z.string().nullable().describe("Anything else useful for the sales person, or null."),
          }),
          execute: async ({ full_name, visit_type, preferred_at, notes }) => {
            leadId = await ensureLead(db, leadId, handle, full_name ?? ctx.profileName);
            await db.from("viewing_bookings").insert({
              lead_id: leadId,
              full_name,
              phone: `+${handle}`,
              visit_type,
              preferred_at,
              notes,
              source: "whatsapp_ai",
            });
            if (leadId) {
              await db
                .from("leads")
                .update({ stage: "visit_booked", last_contacted_at: new Date().toISOString() })
                .eq("id", leadId);
            }
            await db.from("lead_activities").insert({
              lead_id: leadId,
              channel: "whatsapp",
              direction: "internal",
              subject: visit_type === "virtual" ? "Virtual tour requested" : "Show house visit requested",
              body: `${full_name} — ${preferred_at}${notes ? ` (${notes})` : ""}`,
              contact_handle: handle,
              status: "booked",
              metadata: { ai: true },
            });
            return { booked: true };
          },
        }),
        request_human: tool({
          description:
            "Flag this conversation for a human sales person to take over. Use for negotiation, complaints, or anything outside the known facts.",
          inputSchema: z.object({
            reason: z.string().describe("Why a human is needed, one short sentence."),
          }),
          execute: async ({ reason }) => {
            leadId = await ensureLead(db, leadId, handle, ctx.profileName);
            await db.from("lead_activities").insert({
              lead_id: leadId,
              channel: "whatsapp",
              direction: "internal",
              subject: "Handover to sales requested",
              body: reason,
              contact_handle: handle,
              status: "needs_human",
              metadata: { ai: true },
            });
            return { flagged: true };
          },
        }),
      },
    });

    const reply = result.text?.trim();
    if (!reply) return;

    const sent = await sendWhatsAppText(handle, reply);
    await logOutbound(db, leadId, handle, reply, sent.id, "AI assistant reply");
  } catch (err: any) {
    console.error("[assistant] failed:", err?.message ?? err);
  }
}
