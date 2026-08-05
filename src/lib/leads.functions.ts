/*
 * Lead server functions. Thin wrapper module: module scope holds only
 * imports, types, and the exported server-function declarations.
 */
import { createServerFn } from "@tanstack/react-start";

import { leadSchema } from "./lead-schema";

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => leadSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.company) {
      // Honeypot tripped — pretend success, save nothing.
      return { ok: true as const, id: null, score: 0 };
    }
    const { saveLead } = await import("./leads.server");
    const result = await saveLead(data);
    return { ok: true as const, id: result.id, score: result.score };
  });

export const listLeads = createServerFn({ method: "GET" })
  .middleware([
    (await import("@/integrations/supabase/auth-middleware")).requireSupabaseAuth,
  ])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data;
  });
