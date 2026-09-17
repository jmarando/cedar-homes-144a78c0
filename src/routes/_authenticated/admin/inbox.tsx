import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowDown, ArrowUp, MessageSquare } from "lucide-react";
import { useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listInbox } from "@/lib/admin.functions";
import { CHANNELS, channelLabel, fullName, timeAgo } from "@/lib/admin-ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/inbox")({
  head: () => ({
    meta: [
      { title: "Unified inbox | Cedar Homes Sales Desk" },
      {
        name: "description",
        content: "WhatsApp, email, calls and website enquiries in one Cedar Homes conversation feed.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: InboxPage,
});

type InboxRow = {
  id: string;
  lead_id: string | null;
  channel: string;
  direction: string;
  subject: string | null;
  body: string | null;
  contact_handle: string | null;
  occurred_at: string;
  leads: {
    first_name: string;
    last_name: string | null;
    phone: string;
    email: string;
    stage: string;
  } | null;
};

function channelBadgeClass(channel: string): string {
  switch (channel) {
    case "whatsapp":
      return "bg-emerald-50 text-emerald-700";
    case "form":
      return "bg-primary text-primary-foreground";
    case "email":
      return "bg-cedar-gold/15 text-cedar-gold-dark";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function InboxPage() {
  const fetchInbox = useServerFn(listInbox);
  const { data, isLoading } = useQuery({
    queryKey: ["inbox"],
    queryFn: () => fetchInbox() as Promise<InboxRow[]>,
    refetchInterval: 30_000,
  });

  const [channel, setChannel] = useState("all");
  const [direction, setDirection] = useState("all");

  const rows = useMemo(() => {
    return (data ?? []).filter((row) => {
      if (channel !== "all" && row.channel !== channel) return false;
      if (direction !== "all" && row.direction !== direction) return false;
      return true;
    });
  }, [data, channel, direction]);

  const unmatched = (data ?? []).filter((r) => !r.lead_id).length;

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-4">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-primary">
            Unified inbox
          </h1>
          <p className="mt-2 max-w-md font-light text-muted-foreground">
            Every WhatsApp message, website enquiry and logged call in one feed. Refreshes
            automatically.
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={channel} onValueChange={setChannel}>
            <SelectTrigger className="w-44 rounded-full border-border bg-background px-5 shadow-sm transition-all focus:ring-2 focus:ring-cedar-gold/20">
              <SelectValue placeholder="All channels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All channels</SelectItem>
              {CHANNELS.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={direction} onValueChange={setDirection}>
            <SelectTrigger className="w-40 rounded-full border-border bg-background px-5 shadow-sm transition-all focus:ring-2 focus:ring-cedar-gold/20">
              <SelectValue placeholder="Any direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any direction</SelectItem>
              <SelectItem value="inbound">Inbound</SelectItem>
              <SelectItem value="outbound">Outbound</SelectItem>
              <SelectItem value="internal">Internal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <AssistantPanel />


      {unmatched > 0 && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="pt-6 text-sm">
            {unmatched} message{unmatched === 1 ? "" : "s"} could not be matched to an existing
            lead — they came from numbers not yet in the database.
          </CardContent>
        </Card>
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Loading conversations…</p>}
      {!isLoading && rows.length === 0 && (
        <Card className="rounded-2xl">
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <MessageSquare className="h-8 w-8 text-cedar-gold/60" />
            <p className="font-serif text-lg text-primary">Nothing here yet</p>
            <p className="text-sm text-muted-foreground">
              New messages and enquiries will appear here as they arrive.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {rows.map((row) => {
          const isInbound = row.direction === "inbound";
          const DirectionIcon = isInbound ? ArrowDown : ArrowUp;
          const body = (
            <div className="group relative rounded-2xl border border-border/60 bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cedar-gold/40 hover:shadow-[0_20px_50px_-12px_oklch(0.76_0.09_86/0.18)]">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={cn(
                      "rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-widest",
                      channelBadgeClass(row.channel),
                    )}
                  >
                    {channelLabel(row.channel)}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <DirectionIcon className="h-3 w-3 text-cedar-gold-dark" />
                    {isInbound ? "Inbound" : row.direction === "outbound" ? "Outbound" : "Internal"}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span className="text-sm font-semibold text-primary">
                    {row.leads
                      ? fullName(row.leads.first_name, row.leads.last_name)
                      : (row.contact_handle ?? "Unknown contact")}
                  </span>
                </div>
                <span className="shrink-0 rounded bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                  {timeAgo(row.occurred_at)}
                </span>
              </div>
              <div className="pl-1">
                {row.subject && (
                  <h3 className="mb-1 text-lg font-semibold text-primary transition-colors group-hover:text-cedar-gold-dark">
                    {row.subject}
                  </h3>
                )}
                {row.body && (
                  <p className="line-clamp-2 whitespace-pre-wrap leading-relaxed text-muted-foreground">
                    {row.body}
                  </p>
                )}
              </div>
            </div>
          );

          return row.lead_id ? (
            <Link key={row.id} to="/admin/leads/$id" params={{ id: row.lead_id }} className="block">
              {body}
            </Link>
          ) : (
            <div key={row.id}>{body}</div>
          );
        })}
      </div>
    </div>
  );
}
