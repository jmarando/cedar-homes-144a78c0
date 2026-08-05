/*
 * Server-only lead persistence. Never imported by client code directly —
 * *.server.ts files are blocked from the browser bundle.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { LeadParsed } from "./lead-schema";

export interface SaveLeadResult {
  id: string;
  score: number;
}

export async function saveLead(lead: LeadParsed): Promise<SaveLeadResult> {
  const emptyToNull = (value: string | undefined) =>
    value && value.length > 0 ? value : null;

  const { data, error } = await supabaseAdmin
    .from("leads")
    .insert({
      first_name: lead.firstName,
      last_name: emptyToNull(lead.lastName),
      email: lead.email.toLowerCase(),
      phone: lead.phone,
      interest: lead.interest,
      persona: emptyToNull(lead.persona),
      message: emptyToNull(lead.message),
      budget: emptyToNull(lead.budget),
      timeline: emptyToNull(lead.timeline),
      country: emptyToNull(lead.country),
      preferred_contact: lead.preferredContact,
      source: lead.source,
      utm_source: emptyToNull(lead.utmSource),
      utm_medium: emptyToNull(lead.utmMedium),
      utm_campaign: emptyToNull(lead.utmCampaign),
      utm_term: emptyToNull(lead.utmTerm),
      utm_content: emptyToNull(lead.utmContent),
      referrer: emptyToNull(lead.referrer),
      landing_page: emptyToNull(lead.landingPage),
    })
    .select("id, lead_score")
    .single();

  if (error) {
    console.error("[leads] insert failed", error.message);
    throw new Error("Could not save your enquiry. Please try again.");
  }

  return { id: data.id, score: data.lead_score };
}
