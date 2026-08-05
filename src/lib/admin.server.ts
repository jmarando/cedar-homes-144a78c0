/*
 * Server-only helpers for the admin dashboard.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type Sb = SupabaseClient<Database>;

export interface StaffContext {
  userId: string;
  isAdmin: boolean;
  isSales: boolean;
}

/** Throws unless the caller has the admin or sales role. */
export async function requireStaff(supabase: Sb, userId: string): Promise<StaffContext> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((r) => r.role);
  const isAdmin = roles.includes("admin");
  const isSales = roles.includes("sales");
  if (!isAdmin && !isSales) {
    throw new Error("Forbidden: your account has no dashboard access yet.");
  }
  return { userId, isAdmin, isSales };
}

export async function requireAdmin(supabase: Sb, userId: string): Promise<StaffContext> {
  const ctx = await requireStaff(supabase, userId);
  if (!ctx.isAdmin) throw new Error("Forbidden: admins only.");
  return ctx;
}
