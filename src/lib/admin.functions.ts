/*
 * Admin dashboard server functions. Thin wrapper module: module scope holds
 * only imports, types, and exported server-function declarations.
 */
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMe = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: roleRows } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("id", context.userId)
      .maybeSingle();
    const roles = (roleRows ?? []).map((r) => r.role as string);
    return {
      userId: context.userId,
      email: (profile?.email as string | null) ?? null,
      fullName: (profile?.full_name as string | null) ?? null,
      roles,
      isAdmin: roles.includes("admin"),
      isStaff: roles.includes("admin") || roles.includes("sales"),
    };
  });

export const listLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { requireStaff } = await import("./admin.server");
    await requireStaff(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getLead = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    const { requireStaff } = await import("./admin.server");
    await requireStaff(context.supabase, context.userId);
    const { data: lead, error } = await context.supabase
      .from("leads")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!lead) throw new Error("Lead not found");
    const { data: activities } = await context.supabase
      .from("lead_activities")
      .select("*")
      .eq("lead_id", data.id)
      .order("occurred_at", { ascending: false });
    return { lead, activities: activities ?? [] };
  });

export const updateLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: {
      id: string;
      stage?: string;
      assignedTo?: string | null;
      internalNotes?: string;
    }) => data,
  )
  .handler(async ({ data, context }) => {
    const { requireStaff } = await import("./admin.server");
    await requireStaff(context.supabase, context.userId);

    const patch: Record<string, unknown> = {};
    if (data.stage) {
      patch["stage"] = data.stage;
      patch["last_contacted_at"] = new Date().toISOString();
    }
    if (data.assignedTo !== undefined) {
      patch["assigned_to"] = data.assignedTo;
      patch["assigned_at"] = data.assignedTo ? new Date().toISOString() : null;
    }
    if (data.internalNotes !== undefined) patch["internal_notes"] = data.internalNotes;

    const { error } = await context.supabase
      .from("leads")
      .update(patch as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);

    if (data.stage) {
      await context.supabase.from("lead_activities").insert({
        lead_id: data.id,
        channel: "system",
        direction: "internal",
        subject: `Stage changed to ${data.stage.replace(/_/g, " ")}`,
        created_by: context.userId,
      });
    }
    return { ok: true as const };
  });

export const addActivity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: {
      leadId: string;
      channel: string;
      direction: string;
      subject?: string;
      body: string;
    }) => data,
  )
  .handler(async ({ data, context }) => {
    const { requireStaff } = await import("./admin.server");
    await requireStaff(context.supabase, context.userId);
    const { error } = await context.supabase.from("lead_activities").insert({
      lead_id: data.leadId,
      channel: data.channel as never,
      direction: data.direction as never,
      subject: data.subject ?? null,
      body: data.body,
      created_by: context.userId,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const sendWhatsApp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { leadId: string; to: string; body: string }) => data)
  .handler(async ({ data, context }) => {
    const { requireStaff } = await import("./admin.server");
    await requireStaff(context.supabase, context.userId);
    const { sendWhatsAppText, normalizeMsisdn } = await import("./whatsapp.server");
    const result = await sendWhatsAppText(data.to, data.body);
    const { error } = await context.supabase.from("lead_activities").insert({
      lead_id: data.leadId,
      channel: "whatsapp",
      direction: "outbound",
      body: data.body,
      contact_handle: normalizeMsisdn(data.to),
      external_id: result.id,
      status: "sent",
      created_by: context.userId,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const listInbox = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { requireStaff } = await import("./admin.server");
    await requireStaff(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("lead_activities")
      .select(
        "id, lead_id, channel, direction, subject, body, contact_handle, occurred_at, leads(first_name, last_name, phone, email, stage)",
      )
      .order("occurred_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getMetrics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { requireStaff } = await import("./admin.server");
    await requireStaff(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("leads")
      .select("stage, persona, source, utm_source, lead_score, created_at, last_contacted_at")
      .limit(2000);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listTeam = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { requireStaff } = await import("./admin.server");
    await requireStaff(context.supabase, context.userId);
    const { data: profiles, error } = await context.supabase
      .from("profiles")
      .select("id, full_name, email, created_at")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    const { data: roles } = await context.supabase.from("user_roles").select("user_id, role");
    return (profiles ?? []).map((p) => ({
      ...p,
      roles: (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role as string),
    }));
  });

export const setTeamRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { userId: string; role: string; grant: boolean }) => data)
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin(context.supabase, context.userId);
    if (data.userId === context.userId && data.role === "admin" && !data.grant) {
      throw new Error("You cannot remove your own admin role.");
    }
    if (data.grant) {
      const { error } = await context.supabase
        .from("user_roles")
        .insert({ user_id: data.userId, role: data.role as never });
      if (error && !error.message.includes("duplicate")) throw new Error(error.message);
    } else {
      const { error } = await context.supabase
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", data.role as never);
      if (error) throw new Error(error.message);
    }
    return { ok: true as const };
  });

export const listNurture = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { requireStaff } = await import("./admin.server");
    await requireStaff(context.supabase, context.userId);

    const [templates, tasks] = await Promise.all([
      context.supabase
        .from("nurture_templates")
        .select("*")
        .order("day_offset", { ascending: true }),
      context.supabase
        .from("nurture_tasks")
        .select(
          "id, status, channel, scheduled_for, sent_at, last_error, leads(first_name, last_name, phone), nurture_templates(title, day_offset)",
        )
        .order("scheduled_for", { ascending: true })
        .limit(200),
    ]);

    if (templates.error) throw new Error(templates.error.message);
    if (tasks.error) throw new Error(tasks.error.message);
    return { templates: templates.data ?? [], tasks: tasks.data ?? [] };
  });

export const updateNurtureTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: { id: string; body?: string; subject?: string | null; isActive?: boolean }) => data,
  )
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("./admin.server");
    await requireAdmin(context.supabase, context.userId);
    const patch: Record<string, unknown> = {};
    if (data.body !== undefined) patch["body"] = data.body;
    if (data.subject !== undefined) patch["subject"] = data.subject;
    if (data.isActive !== undefined) patch["is_active"] = data.isActive;
    const { error } = await context.supabase
      .from("nurture_templates")
      .update(patch as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const runNurtureNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { requireStaff } = await import("./admin.server");
    await requireStaff(context.supabase, context.userId);
    const { runDueNurtureTasks } = await import("./nurture.server");
    return runDueNurtureTasks();
  });
