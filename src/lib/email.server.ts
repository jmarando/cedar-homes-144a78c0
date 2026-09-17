/*
 * Server-only email helpers for Cedar Homes. Wraps the managed send helper so
 * every outbound email is also written to the unified inbox (lead_activities).
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";

import { sendTemplateEmail } from "./email-templates/send-email";

export interface LeadEmailArgs {
  leadId: string | null;
  to: string;
  templateName: string;
  subject: string;
  bodyForLog: string;
  templateData?: Record<string, unknown>;
  idempotencyKey?: string;
  createdBy?: string | null;
}

export interface LeadEmailResult {
  sent: boolean;
  reason?: string;
}

/** Sends a template email and records it on the lead timeline / inbox. */
export async function sendLeadEmail(args: LeadEmailArgs): Promise<LeadEmailResult> {
  let sent = false;
  let status = "sent";
  let reason: string | undefined;

  try {
    const outcome = await sendTemplateEmail(args.templateName, args.to, {
      templateData: args.templateData ?? {},
      ...(args.idempotencyKey ? { idempotencyKey: args.idempotencyKey } : {}),
    });
    sent = outcome.sent;
    if (!outcome.sent) {
      status = "suppressed";
      reason = outcome.reason;
    }
  } catch (error) {
    status = "failed";
    reason = error instanceof Error ? error.message : "Unknown email error";
    console.error("[email] send failed", args.templateName, reason);
  }

  if (args.leadId) {
    const { error } = await supabaseAdmin.from("lead_activities").insert({
      lead_id: args.leadId,
      channel: "email",
      direction: "outbound",
      subject: args.subject,
      body: args.bodyForLog,
      contact_handle: args.to.toLowerCase(),
      status,
      created_by: args.createdBy ?? null,
      metadata: reason ? { reason } : null,
    });
    if (error) console.error("[email] inbox log failed", error.message);
  }

  return reason ? { sent, reason } : { sent };
}

/** Fire-and-forget notifications for a brand new website enquiry. */
export async function notifyNewLead(lead: {
  id: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  phone: string;
  interest: string;
  persona?: string | null;
  message?: string | null;
  source: string;
  score: number;
}): Promise<void> {
  const name = [lead.firstName, lead.lastName].filter(Boolean).join(" ");
  const leadUrl = `https://cedar-homes.lovable.app/admin/leads/${lead.id}`;

  await Promise.allSettled([
    sendLeadEmail({
      leadId: lead.id,
      to: lead.email,
      templateName: "enquiry-confirmation",
      subject: "We have your Cedar Homes enquiry",
      bodyForLog: "Automatic confirmation sent to the enquirer.",
      templateData: { firstName: lead.firstName, interest: readableInterest(lead.interest) },
      idempotencyKey: `enquiry-confirmation-${lead.id}`,
    }),
    sendLeadEmail({
      leadId: lead.id,
      to: lead.email,
      templateName: "lead-alert",
      subject: `New enquiry: ${name}`,
      bodyForLog: "Internal alert sent to the sales desk.",
      templateData: {
        name,
        email: lead.email,
        phone: lead.phone,
        interest: lead.interest,
        persona: lead.persona ?? "",
        score: lead.score,
        source: lead.source,
        message: lead.message ?? "",
        leadUrl,
      },
      idempotencyKey: `lead-alert-${lead.id}`,
    }),
  ]);
}

function readableInterest(interest: string): string {
  return interest.replace(/[-_]+/g, " ").toLowerCase();
}
