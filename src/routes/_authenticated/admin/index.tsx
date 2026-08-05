import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMetrics } from "@/lib/admin.functions";
import { STAGES, stageLabel } from "@/lib/admin-ui";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Pipeline overview | Cedar Homes Sales Desk" },
      { name: "description", content: "Lead volume, sources and pipeline health for Cedar Homes." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: OverviewPage,
});

type MetricRow = {
  stage: string;
  persona: string | null;
  source: string;
  utm_source: string | null;
  lead_score: number;
  created_at: string;
  last_contacted_at: string | null;
};

function countBy(rows: MetricRow[], key: (row: MetricRow) => string) {
  const out = new Map<string, number>();
  for (const row of rows) {
    const k = key(row) || "unknown";
    out.set(k, (out.get(k) ?? 0) + 1);
  }
  return [...out.entries()].sort((a, b) => b[1] - a[1]);
}

function OverviewPage() {
  const fetchMetrics = useServerFn(getMetrics);
  const { data, isLoading } = useQuery({
    queryKey: ["metrics"],
    queryFn: () => fetchMetrics() as Promise<MetricRow[]>,
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading metrics…</p>;
  const rows = data ?? [];

  const now = Date.now();
  const last7 = rows.filter((r) => now - new Date(r.created_at).getTime() < 7 * 864e5);
  const last30 = rows.filter((r) => now - new Date(r.created_at).getTime() < 30 * 864e5);
  const hot = rows.filter((r) => r.lead_score >= 70);
  const untouched = rows.filter((r) => r.stage === "new" && !r.last_contacted_at);
  const won = rows.filter((r) => r.stage === "deposit_paid").length;
  const conversion = rows.length ? ((won / rows.length) * 100).toFixed(1) : "0.0";

  const responded = rows.filter((r) => r.last_contacted_at);
  const avgResponseMins = responded.length
    ? Math.round(
        responded.reduce(
          (acc, r) =>
            acc +
            (new Date(r.last_contacted_at as string).getTime() -
              new Date(r.created_at).getTime()) /
              60000,
          0,
        ) / responded.length,
      )
    : null;

  const stats = [
    { label: "Total leads", value: rows.length },
    { label: "Last 7 days", value: last7.length },
    { label: "Last 30 days", value: last30.length },
    { label: "Hot leads (70+)", value: hot.length },
    { label: "Awaiting first reply", value: untouched.length },
    { label: "Deposit paid", value: won },
    { label: "Conversion", value: `${conversion}%` },
    {
      label: "Avg first response",
      value: avgResponseMins === null ? "—" : `${avgResponseMins}m`,
    },
  ];

  const byStage = STAGES.map((s) => ({
    label: s.label,
    value: s.value,
    count: rows.filter((r) => r.stage === s.value).length,
  }));
  const maxStage = Math.max(1, ...byStage.map((s) => s.count));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pipeline overview</h1>
        <p className="text-sm text-muted-foreground">
          Live view of every enquiry captured from the Cedar Homes site.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-2xl font-semibold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {untouched.length > 0 && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
            <p className="text-sm">
              <strong>{untouched.length}</strong> lead{untouched.length === 1 ? "" : "s"} have
              never been contacted. Your target is a reply within 5 minutes.
            </p>
            <Link
              to="/admin/leads"
              className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
            >
              Work the queue
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Leads by stage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {byStage.map((s) => (
              <div key={s.value} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-xs text-muted-foreground">{s.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(s.count / maxStage) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-sm tabular-nums">{s.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              {countBy(rows, (r) => r.utm_source ?? r.source)
                .slice(0, 6)
                .map(([key, count]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="tabular-nums">{count}</span>
                  </div>
                ))}
              {rows.length === 0 && <p className="text-muted-foreground">No leads yet.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Personas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              {countBy(rows, (r) => r.persona ?? "not set")
                .slice(0, 6)
                .map(([key, count]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="tabular-nums">{count}</span>
                  </div>
                ))}
              {rows.length === 0 && <p className="text-muted-foreground">No leads yet.</p>}
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Stage names: {STAGES.map((s) => stageLabel(s.value)).join(" → ")}
      </p>
    </div>
  );
}
