/** Shared labels and helpers for the sales dashboard. */
export const STAGES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "visit_booked", label: "Visit booked" },
  { value: "visited", label: "Visited" },
  { value: "negotiating", label: "Negotiating" },
  { value: "deposit_paid", label: "Deposit paid" },
  { value: "lost", label: "Lost" },
] as const;

export const CHANNELS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
  { value: "call", label: "Call" },
  { value: "sms", label: "SMS" },
  { value: "note", label: "Note" },
  { value: "form", label: "Website form" },
  { value: "system", label: "System" },
] as const;

export function stageLabel(value: string): string {
  return STAGES.find((s) => s.value === value)?.label ?? value;
}

export function channelLabel(value: string): string {
  return CHANNELS.find((c) => c.value === value)?.label ?? value;
}

export function scoreTone(score: number): string {
  if (score >= 70) return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400";
  if (score >= 45) return "bg-amber-500/15 text-amber-700 dark:text-amber-400";
  return "bg-muted text-muted-foreground";
}

export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function fullName(first?: string | null, last?: string | null): string {
  return [first, last].filter(Boolean).join(" ") || "Unnamed lead";
}
