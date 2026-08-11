import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getMe, listNurture, runNurtureNow, updateNurtureTemplate } from "@/lib/admin.functions";
import { channelLabel, fullName, timeAgo } from "@/lib/admin-ui";

export const Route = createFileRoute("/_authenticated/admin/nurture")({
  head: () => ({
    meta: [
      { title: "Follow-up automation | Cedar Homes Sales Desk" },
      {
        name: "description",
        content: "The day-based WhatsApp and email sequence that works every Cedar Homes lead.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: NurturePage,
});

const STATUS_TONE: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  sent: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  failed: "bg-destructive/15 text-destructive",
  cancelled: "bg-muted text-muted-foreground line-through",
  skipped: "bg-muted text-muted-foreground",
};

function NurturePage() {
  const fetchNurture = useServerFn(listNurture);
  const fetchMe = useServerFn(getMe);
  const saveTemplate = useServerFn(updateNurtureTemplate);
  const runNow = useServerFn(runNurtureNow);
  const queryClient = useQueryClient();

  const { data: me } = useQuery({ queryKey: ["me"], queryFn: () => fetchMe() });
  const { data, isLoading } = useQuery({ queryKey: ["nurture"], queryFn: () => fetchNurture() });

  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["nurture"] });

  const saveMutation = useMutation({
    mutationFn: (input: { id: string; body?: string; isActive?: boolean }) =>
      saveTemplate({ data: input }),
    onSuccess: () => {
      toast.success("Sequence updated");
      void invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const runMutation = useMutation({
    mutationFn: () => runNow(),
    onSuccess: (r) => {
      toast.success(
        `Sent ${r.sent}, waiting ${r.deferred}, skipped ${r.skipped} of ${r.due} due follow-ups`,
      );
      void invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const templates = (data?.templates ?? []) as any[];
  const tasks = (data?.tasks ?? []) as any[];
  const pending = tasks.filter((t) => t.status === "pending");
  const dueNow = pending.filter((t) => new Date(t.scheduled_for) <= new Date());
  const blocked = tasks.filter((t) => t.last_error && t.status !== "sent");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Follow-up automation</h1>
          <p className="text-sm text-muted-foreground">
            Every new enquiry is enrolled automatically. The sequence stops itself when a lead
            pays a deposit or is marked lost.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          disabled={runMutation.isPending}
          onClick={() => runMutation.mutate()}
        >
          Send due follow-ups now
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Scheduled" value={pending.length} />
        <Stat label="Due right now" value={dueNow.length} />
        <Stat label="Waiting on setup" value={blocked.length} />
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading sequence…</p>}

      <div className="space-y-3">
        <h2 className="text-lg font-medium">The sequence</h2>
        {templates.map((t) => {
          const body = drafts[t.id] ?? t.body;
          const dirty = drafts[t.id] !== undefined && drafts[t.id] !== t.body;
          return (
            <Card key={t.id}>
              <CardHeader className="flex flex-row flex-wrap items-center gap-3 space-y-0 pb-3">
                <CardTitle className="text-base">{t.title}</CardTitle>
                <Badge variant="outline">{channelLabel(t.channel)}</Badge>
                {t.subject && (
                  <span className="text-xs text-muted-foreground">“{t.subject}”</span>
                )}
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {t.is_active ? "Active" : "Paused"}
                  </span>
                  <Switch
                    checked={t.is_active}
                    disabled={!me?.isAdmin || saveMutation.isPending}
                    onCheckedChange={(checked) =>
                      saveMutation.mutate({ id: t.id, isActive: checked })
                    }
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Textarea
                  rows={5}
                  value={body}
                  disabled={!me?.isAdmin}
                  onChange={(e) => setDrafts((d) => ({ ...d, [t.id]: e.target.value }))}
                />
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    disabled={!dirty || saveMutation.isPending}
                    onClick={() => saveMutation.mutate({ id: t.id, body })}
                  >
                    Save message
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Use {"{{first_name}}"} to personalise.
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Upcoming and recent</h2>
        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nothing queued yet — follow-ups appear here as leads come in.
          </p>
        )}
        {tasks.slice(0, 60).map((task) => (
          <div key={task.id} className="rounded-lg border p-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-medium ${STATUS_TONE[task.status] ?? ""}`}
              >
                {task.status}
              </span>
              <span className="font-medium">
                {task.leads
                  ? fullName(task.leads.first_name, task.leads.last_name)
                  : "Deleted lead"}
              </span>
              <span className="text-muted-foreground">
                {task.nurture_templates?.title ?? "Step"} · {channelLabel(task.channel)}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">
                {task.sent_at
                  ? `sent ${timeAgo(task.sent_at)}`
                  : `due ${new Date(task.scheduled_for).toLocaleString()}`}
              </span>
            </div>
            {task.last_error && task.status !== "sent" && (
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">{task.last_error}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}
