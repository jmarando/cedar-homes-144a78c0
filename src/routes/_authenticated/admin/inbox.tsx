import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Unified inbox</h1>
          <p className="text-sm text-muted-foreground">
            Every WhatsApp message, website enquiry and logged call in one feed. Refreshes
            automatically.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={channel} onValueChange={setChannel}>
            <SelectTrigger className="w-40">
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
            <SelectTrigger className="w-36">
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
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Nothing here yet.
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {rows.map((row) => {
          const body = (
            <div className="rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">{channelLabel(row.channel)}</Badge>
                <span>{row.direction}</span>
                <span className="font-medium text-foreground">
                  {row.leads
                    ? fullName(row.leads.first_name, row.leads.last_name)
                    : (row.contact_handle ?? "Unknown contact")}
                </span>
                <span className="ml-auto">{timeAgo(row.occurred_at)}</span>
              </div>
              {row.subject && <p className="mt-2 text-sm font-medium">{row.subject}</p>}
              {row.body && (
                <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm">{row.body}</p>
              )}
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
