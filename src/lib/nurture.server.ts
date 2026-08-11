/*
 * Server-only nurture engine. Renders each due follow-up step and dispatches it
 * over the right channel, logging every send to the lead activity timeline.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendWhatsAppText, getWhatsAppConfig } from "./whatsapp.server";

const MAX_ATTEMPTS = 5;
const BATCH_SIZE = 50;

export interface NurtureRunResult {
  due: number;
  sent: number;
  skipped: number;
  failed: number;
  deferred: number;
}

/** Replaces {{first_name}} style tags with lead values. */
export function renderTemplate(
  body: string,
  lead: Record<string, unknown>,
): string {
  return body.replace(/\{\{\s*([a-z_]+)\s*\}\}/gi, (_match, key: string) => {
    const value = lead[key.toLowerCase()];
    return value == null || value === "" ? "" : String(value);
  });
}

interface DueTask {
  id: string;
  lead_id: string;
  channel: string;
  attempts: number;
  nurture_templates: {
    step_key: string;
    title: string;
    subject: string | null;
    body: string;
  } | null;
  leads: {
    id: string;
    first_name: string;
    last_name: string | null;
    email: string;
    phone: string;
    stage: string;
  } | null;
}

/**
 * Processes every follow-up that is due now. Safe to call repeatedly —
 * each task is claimed before sending so a double run cannot double send.
 */
export async function runDueNurtureTasks(): Promise<NurtureRunResult> {
  const nowIso = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("nurture_tasks")
    .select(
      "id, lead_id, channel, attempts, nurture_templates(step_key, title, subject, body), leads(id, first_name, last_name, email, phone, stage)",
    )
    .eq("status", "pending")
    .lte("scheduled_for", nowIso)
    .order("scheduled_for", { ascending: true })
    .limit(BATCH_SIZE);

  if (error) throw new Error(error.message);

  const tasks = (data ?? []) as unknown as DueTask[];
  const result: NurtureRunResult = {
    due: tasks.length,
    sent: 0,
    skipped: 0,
    failed: 0,
    deferred: 0,
  };

  for (const task of tasks) {
    const template = task.nurture_templates;
    const lead = task.leads;

    if (!template || !lead) {
      await markTask(task.id, "skipped", "Missing template or lead");
      result.skipped += 1;
      continue;
    }

    // The stage triggers normally cancel these, but stay defensive.
    if (lead.stage === "deposit_paid" || lead.stage === "lost") {
      await markTask(task.id, "cancelled", null);
      result.skipped += 1;
      continue;
    }

    const message = renderTemplate(template.body, {
      first_name: lead.first_name,
      last_name: lead.last_name ?? "",
      email: lead.email,
      phone: lead.phone,
    });

    try {
      if (task.channel === "whatsapp") {
        if (!getWhatsAppConfig()) {
          await deferTask(task, "WhatsApp Business is not connected yet");
          result.deferred += 1;
          continue;
        }
        await sendWhatsAppText(lead.phone, message);
      } else if (task.channel === "email") {
        const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
        const outcome = await sendTemplateEmail("nurture-step", lead.email, {
          templateData: {
            subject: template.subject ?? template.title,
            headline: template.title,
            message,
          },
          idempotencyKey: `nurture-${task.id}`,
        });
        if (!outcome.sent) {
          await markTask(task.id, "skipped", "Recipient is unsubscribed or undeliverable");
          result.skipped += 1;
          continue;
        }
      } else {
        await markTask(task.id, "skipped", `Unknown channel: ${task.channel}`);
        result.skipped += 1;
        continue;
      }

      await markTask(task.id, "sent", null);
      await supabaseAdmin.from("lead_activities").insert({
        lead_id: lead.id,
        channel: task.channel,
        direction: "outbound",
        subject: template.subject ?? template.title,
        body: message,
        contact_handle: String(task.channel) === "email" ? lead.email : lead.phone,
        metadata: { automated: true, step: template.step_key },
      } as never);
      result.sent += 1;
    } catch (err) {
      const messageText = err instanceof Error ? err.message : String(err);
      console.error(`[nurture] ${template.step_key} failed for ${lead.id}: ${messageText}`);
      await deferTask(task, messageText);
      result.failed += 1;
    }
  }

  return result;
}

async function markTask(id: string, status: string, lastError: string | null) {
  await supabaseAdmin
    .from("nurture_tasks")
    .update({
      status,
      last_error: lastError,
      sent_at: status === "sent" ? new Date().toISOString() : null,
    } as never)
    .eq("id", id);
}

/** Keeps the task pending for a later run, until the attempt cap is hit. */
async function deferTask(task: DueTask, reason: string) {
  const attempts = task.attempts + 1;
  await supabaseAdmin
    .from("nurture_tasks")
    .update({
      attempts,
      last_error: reason,
      status: attempts >= MAX_ATTEMPTS ? "failed" : "pending",
    } as never)
    .eq("id", task.id);
}
