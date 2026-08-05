import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMe, listTeam, setTeamRole } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/team")({
  head: () => ({
    meta: [
      { title: "Team access | Cedar Homes Sales Desk" },
      { name: "description", content: "Grant admin or sales access to Cedar Homes team members." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: TeamPage,
});

type Member = {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  roles: string[];
};

function TeamPage() {
  const fetchTeam = useServerFn(listTeam);
  const fetchMe = useServerFn(getMe);
  const saveRole = useServerFn(setTeamRole);
  const queryClient = useQueryClient();

  const { data: me } = useQuery({ queryKey: ["me"], queryFn: () => fetchMe() });
  const { data, isLoading } = useQuery({
    queryKey: ["team"],
    queryFn: () => fetchTeam() as Promise<Member[]>,
  });

  const mutation = useMutation({
    mutationFn: (input: { userId: string; role: string; grant: boolean }) =>
      saveRole({ data: input }),
    onSuccess: () => {
      toast.success("Access updated");
      void queryClient.invalidateQueries({ queryKey: ["team"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Team access</h1>
        <p className="text-sm text-muted-foreground">
          Anyone can create an account, but only admins and sales reps can see leads.
        </p>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading team…</p>}

      <div className="space-y-2">
        {(data ?? []).map((member) => (
          <Card key={member.id}>
            <CardHeader className="flex flex-row flex-wrap items-center gap-3 space-y-0 pb-3">
              <CardTitle className="text-base">{member.full_name ?? member.email}</CardTitle>
              <span className="text-xs text-muted-foreground">{member.email}</span>
              <div className="flex gap-1">
                {member.roles.length === 0 && <Badge variant="outline">No access</Badge>}
                {member.roles.map((r) => (
                  <Badge key={r} variant="secondary">
                    {r}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {["admin", "sales"].map((role) => {
                const has = member.roles.includes(role);
                return (
                  <Button
                    key={role}
                    size="sm"
                    variant={has ? "outline" : "default"}
                    disabled={!me?.isAdmin || mutation.isPending}
                    onClick={() =>
                      mutation.mutate({ userId: member.id, role, grant: !has })
                    }
                  >
                    {has ? `Remove ${role}` : `Make ${role}`}
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      {!me?.isAdmin && (
        <p className="text-xs text-muted-foreground">
          Only admins can change roles.
        </p>
      )}
    </div>
  );
}
