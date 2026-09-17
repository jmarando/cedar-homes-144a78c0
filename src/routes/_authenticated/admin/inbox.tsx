import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowDown, ArrowUp, Bot, CalendarCheck, MessageSquare, PenLine, Send, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  getAssistantSettings,
  listInbox,
  setAssistantAutoReply,
  startConversation,
} from "@/lib/admin.functions";
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


type Booking = {
  id: string;
  lead_id: string | null;
  full_name: string;
  phone: string;
  visit_type: string;
  preferred_at: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

function AssistantPanel() {
  const queryClient = useQueryClient();
  const fetchSettings = useServerFn(getAssistantSettings);
  const saveAutoReply = useServerFn(setAssistantAutoReply);

  const { data } = useQuery({
    queryKey: ["assistant-settings"],
    queryFn: () =>
      fetchSettings() as Promise<{
        autoReply: boolean;
        handoffMinutes: number;
        bookings: Booking[];
      }>,
    refetchInterval: 60_000,
  });

  const toggle = useMutation({
    mutationFn: (autoReply: boolean) => saveAutoReply({ data: { autoReply } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assistant-settings"] }),
  });

  const bookings = data?.bookings ?? [];

  return (
    <Card className="rounded-2xl border-cedar-gold/30 bg-gradient-to-br from-cedar-gold/[0.06] to-transparent">
      <CardContent className="space-y-5 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-cedar-gold/15 p-2 text-cedar-gold-dark">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <p className="font-serif text-lg text-primary">AI assistant</p>
              <p className="text-sm text-muted-foreground">
                Replies to new WhatsApp messages, sends the brochure and books visits. It pauses
                automatically for {data?.handoffMinutes ?? 60} minutes after you reply yourself.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              {data?.autoReply ? "Auto-replies on" : "Paused"}
            </span>
            <Switch
              checked={data?.autoReply ?? false}
              disabled={!data || toggle.isPending}
              onCheckedChange={(v) => toggle.mutate(v)}
            />
          </div>
        </div>

        {bookings.length > 0 && (
          <div className="space-y-2 border-t border-border/60 pt-4">
            <p className="flex items-center gap-2 text-sm font-medium text-primary">
              <CalendarCheck className="h-4 w-4 text-cedar-gold" /> Visit requests
            </p>
            <ul className="space-y-2">
              {bookings.slice(0, 5).map((b) => (
                <li
                  key={b.id}
                  className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl bg-background/70 px-4 py-2 text-sm"
                >
                  <span className="font-medium text-primary">{b.full_name}</span>
                  <span className="text-muted-foreground">{b.phone}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">
                    {b.visit_type === "virtual" ? "Virtual tour" : "Show house visit"}
                  </span>
                  {b.preferred_at && (
                    <span className="rounded-full bg-cedar-gold/15 px-2 py-0.5 text-xs text-cedar-gold-dark">
                      {b.preferred_at}
                    </span>
                  )}
                  {b.lead_id && (
                    <Link
                      to="/admin/leads/$id"
                      params={{ id: b.lead_id }}
                      className="ml-auto text-xs text-cedar-gold hover:underline"
                    >
                      Open lead
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


type ComposerProps = {
  defaultChannel?: "whatsapp" | "email";
  defaultTo?: string;
  defaultSubject?: string;
  leadId?: string | null;
  lockRecipient?: boolean;
  onDone?: () => void;
};

function Composer({
  defaultChannel = "whatsapp",
  defaultTo = "",
  defaultSubject = "",
  leadId = null,
  lockRecipient = false,
  onDone,
}: ComposerProps) {
  const queryClient = useQueryClient();
  const send = useServerFn(startConversation);
  const [channel, setChannel] = useState<"whatsapp" | "email">(defaultChannel);
  const [to, setTo] = useState(defaultTo);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      send({
        data: {
          channel,
          to,
          body,
          subject: channel === "email" ? subject : undefined,
          name: name || undefined,
          leadId,
        },
      }),
    onSuccess: () => {
      setBody("");
      toast.success(channel === "whatsapp" ? "WhatsApp message sent" : "Email sent");
      queryClient.invalidateQueries({ queryKey: ["inbox"] });
      onDone?.();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-40">
          <Label className="mb-1.5 block text-xs text-muted-foreground">Channel</Label>
          <Select value={channel} onValueChange={(v) => setChannel(v as "whatsapp" | "email")}>
            <SelectTrigger className="rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[220px] flex-1">
          <Label className="mb-1.5 block text-xs text-muted-foreground">
            {channel === "whatsapp" ? "Phone number" : "Email address"}
          </Label>
          <Input
            value={to}
            disabled={lockRecipient}
            onChange={(e) => setTo(e.target.value)}
            placeholder={channel === "whatsapp" ? "+254 7XX XXX XXX" : "name@example.com"}
            className="rounded-full"
          />
        </div>
        {!lockRecipient && (
          <div className="min-w-[160px] flex-1">
            <Label className="mb-1.5 block text-xs text-muted-foreground">Name (optional)</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Wanjiru"
              className="rounded-full"
            />
          </div>
        )}
      </div>

      {channel === "email" && (
        <div>
          <Label className="mb-1.5 block text-xs text-muted-foreground">Subject</Label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Cedar Homes — your enquiry"
            className="rounded-full"
          />
        </div>
      )}

      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder="Write your message…"
        className="rounded-2xl"
      />

      <div className="flex justify-end gap-2">
        {onDone && (
          <Button variant="ghost" onClick={onDone} className="rounded-full">
            Cancel
          </Button>
        )}
        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || !to.trim() || !body.trim()}
          className="rounded-full"
        >
          <Send className="mr-2 h-4 w-4" />
          {mutation.isPending ? "Sending…" : "Send"}
        </Button>
      </div>
    </div>
  );
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
  const [composeOpen, setComposeOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);

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
          <Button onClick={() => setComposeOpen((v) => !v)} className="rounded-full">
            {composeOpen ? <X className="mr-2 h-4 w-4" /> : <PenLine className="mr-2 h-4 w-4" />}
            {composeOpen ? "Close" : "New message"}
          </Button>
        </div>
      </div>

      {composeOpen && (
        <Card className="rounded-2xl border-cedar-gold/30">
          <CardContent className="space-y-4 pt-6">
            <p className="font-serif text-lg text-primary">New message</p>
            <Composer onDone={() => setComposeOpen(false)} />
          </CardContent>
        </Card>
      )}

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

          const open = replyTo === row.id;
          const isEmail = row.channel === "email" || row.channel === "form";
          const recipient = isEmail
            ? (row.leads?.email ?? row.contact_handle ?? "")
            : (row.contact_handle ?? row.leads?.phone ?? "");

          return (
            <div key={row.id} className="space-y-2">
              <button
                type="button"
                onClick={() => setReplyTo(open ? null : row.id)}
                className="block w-full text-left"
              >
                {body}
              </button>
              {open && (
                <Card className="rounded-2xl border-cedar-gold/30">
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex items-center justify-between">
                      <p className="font-serif text-base text-primary">
                        Reply to {row.leads ? fullName(row.leads.first_name, row.leads.last_name) : recipient}
                      </p>
                      {row.lead_id && (
                        <Link
                          to="/admin/leads/$id"
                          params={{ id: row.lead_id }}
                          className="text-xs text-cedar-gold hover:underline"
                        >
                          Open full lead
                        </Link>
                      )}
                    </div>
                    <Composer
                      defaultChannel={isEmail ? "email" : "whatsapp"}
                      defaultTo={recipient}
                      defaultSubject={row.subject ? `Re: ${row.subject}` : ""}
                      leadId={row.lead_id}
                      lockRecipient={Boolean(recipient)}
                      onDone={() => setReplyTo(null)}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
