import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listLeads } from "@/lib/admin.functions";
import { STAGES, fullName, scoreTone, stageLabel, timeAgo } from "@/lib/admin-ui";

export const Route = createFileRoute("/_authenticated/admin/leads")({
  head: () => ({
    meta: [
      { title: "Leads pipeline | Cedar Homes Sales Desk" },
      { name: "description", content: "Every Cedar Homes enquiry, scored and ready to work." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LeadsPage,
});

type Lead = {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string;
  interest: string;
  persona: string | null;
  stage: string;
  lead_score: number;
  created_at: string;
  last_contacted_at: string | null;
};

function LeadsPage() {
  const fetchLeads = useServerFn(listLeads);
  const { data, isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: () => fetchLeads() as Promise<Lead[]>,
  });

  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("all");

  const leads = useMemo(() => {
    const rows = data ?? [];
    const q = search.trim().toLowerCase();
    return rows.filter((lead) => {
      if (stage !== "all" && lead.stage !== stage) return false;
      if (!q) return true;
      return [lead.first_name, lead.last_name, lead.email, lead.phone, lead.interest]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [data, search, stage]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground">
            {leads.length} of {(data ?? []).length} leads shown
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Search name, email, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56"
          />
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All stages</SelectItem>
              {STAGES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading leads…</p>}

      {!isLoading && leads.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No leads match this view yet.
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {leads.map((lead) => (
          <Link
            key={lead.id}
            to="/admin/leads/$id"
            params={{ id: lead.id }}
            className="block rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums ${scoreTone(lead.lead_score)}`}
              >
                {lead.lead_score}
              </span>
              <span className="font-medium">{fullName(lead.first_name, lead.last_name)}</span>
              <Badge variant="secondary">{stageLabel(lead.stage)}</Badge>
              <span className="text-sm text-muted-foreground">{lead.interest}</span>
              {lead.persona && (
                <span className="text-xs text-muted-foreground">· {lead.persona}</span>
              )}
              <span className="ml-auto text-xs text-muted-foreground">
                {timeAgo(lead.created_at)}
                {lead.last_contacted_at
                  ? ` · replied ${timeAgo(lead.last_contacted_at)}`
                  : " · no reply yet"}
              </span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {lead.phone} · {lead.email}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
