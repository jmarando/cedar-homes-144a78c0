import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addActivity, getLead, sendWhatsApp, updateLead } from "@/lib/admin.functions";
import { CHANNELS, STAGES, channelLabel, fullName, scoreTone, timeAgo } from "@/lib/admin-ui";
import { whatsappLink } from "@/lib/site-config";

export const Route = createFileRoute("/_authenticated/admin/leads/$id")({
  head: () => ({
    meta: [
      { title: "Lead detail | Cedar Homes Sales Desk" },
      { name: "description", content: "Full conversation timeline and stage controls for a lead." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  errorComponent: ({ error }) => (
    <p className="text-sm text-destructive">{error.message}</p>
  ),
  component: LeadDetailPage,
});

function LeadDetailPage() {
  const { id } = useParams({ from: "/_authenticated/admin/leads/$id" });
  const queryClient = useQueryClient();

  const fetchLead = useServerFn(getLead);
  const saveLead = useServerFn(updateLead);
  const logActivity = useServerFn(addActivity);
  const sendWa = useServerFn(sendWhatsApp);

  const { data, isLoading } = useQuery({
    queryKey: ["lead", id],
    queryFn: () => fetchLead({ data: { id } }),
  });

  const [note, setNote] = useState("");
  const [channel, setChannel] = useState("note");
  const [waText, setWaText] = useState("");

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["lead", id] });
    void queryClient.invalidateQueries({ queryKey: ["leads"] });
    void queryClient.invalidateQueries({ queryKey: ["inbox"] });
  };

  const stageMutation = useMutation({
    mutationFn: (stage: string) => saveLead({ data: { id, stage } }),
    onSuccess: () => {
      toast.success("Stage updated");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const noteMutation = useMutation({
    mutationFn: () =>
      logActivity({
        data: { leadId: id, channel, direction: channel === "note" ? "internal" : "outbound", body: note },
      }),
    onSuccess: () => {
      setNote("");
      toast.success("Logged to the timeline");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const waMutation = useMutation({
    mutationFn: () =>
      sendWa({ data: { leadId: id, to: lead?.phone ?? "", body: waText } }),
    onSuccess: () => {
      setWaText("");
      toast.success("WhatsApp message sent");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading lead…</p>;
  const lead = data?.lead as any;
  const activities = (data?.activities ?? []) as any[];
  if (!lead) return <p className="text-sm text-muted-foreground">Lead not found.</p>;

  return (
    <div className="space-y-6">
      <Link to="/admin/leads" className="text-sm text-muted-foreground hover:underline">
        ← Back to leads
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row flex-wrap items-center gap-3 space-y-0">
              <CardTitle>{fullName(lead.first_name, lead.last_name)}</CardTitle>
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-semibold ${scoreTone(lead.lead_score)}`}
              >
                score {lead.lead_score}
              </span>
              <Badge variant="secondary">{lead.interest}</Badge>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
              <Detail label="Phone" value={lead.phone} />
              <Detail label="Email" value={lead.email} />
              <Detail label="Preferred contact" value={lead.preferred_contact} />
              <Detail label="Persona" value={lead.persona ?? "—"} />
              <Detail label="Timeline" value={lead.timeline ?? "—"} />
              <Detail label="Budget" value={lead.budget ?? "—"} />
              <Detail label="Country" value={lead.country ?? "—"} />
              <Detail label="Source" value={lead.utm_source ?? lead.source} />
              <Detail label="Campaign" value={lead.utm_campaign ?? "—"} />
              <Detail label="Landing page" value={lead.landing_page ?? "—"} />
              {lead.message && (
                <div className="sm:col-span-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Message</p>
                  <p className="mt-1 whitespace-pre-wrap">{lead.message}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Log a touchpoint</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Select value={channel} onValueChange={setChannel}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CHANNELS.filter((c) => c.value !== "system" && c.value !== "form").map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder="What was discussed?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
              <Button
                size="sm"
                disabled={!note.trim() || noteMutation.isPending}
                onClick={() => noteMutation.mutate()}
              >
                Save to timeline
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Conversation timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activities.length === 0 && (
                <p className="text-sm text-muted-foreground">Nothing logged yet.</p>
              )}
              {activities.map((a) => (
                <div key={a.id} className="rounded-md border p-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">{channelLabel(a.channel)}</Badge>
                    <span>{a.direction}</span>
                    <span className="ml-auto">{timeAgo(a.occurred_at)}</span>
                  </div>
                  {a.subject && <p className="mt-2 text-sm font-medium">{a.subject}</p>}
                  {a.body && <p className="mt-1 whitespace-pre-wrap text-sm">{a.body}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={lead.stage}
                onValueChange={(value) => stageMutation.mutate(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">WhatsApp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                rows={4}
                placeholder={`Hi ${lead.first_name}, thanks for your interest in Cedar Homes…`}
                value={waText}
                onChange={(e) => setWaText(e.target.value)}
              />
              <Button
                size="sm"
                className="w-full"
                disabled={!waText.trim() || waMutation.isPending}
                onClick={() => waMutation.mutate()}
              >
                Send via WhatsApp Business
              </Button>
              <a
                href={whatsappLink(`Hi ${lead.first_name}, this is Cedar Homes.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xs text-muted-foreground hover:underline"
              >
                Or open in WhatsApp app
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <a className="block hover:underline" href={`tel:${lead.phone}`}>
                Call {lead.phone}
              </a>
              <a className="block hover:underline" href={`mailto:${lead.email}`}>
                Email {lead.email}
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5">{value}</p>
    </div>
  );
}
