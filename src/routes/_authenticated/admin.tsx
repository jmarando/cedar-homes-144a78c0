import { useQuery } from "@tanstack/react-query";
import { Link, Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { getMe } from "@/lib/admin.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const NAV: Array<{ to: string; label: string; exact?: boolean }> = [
  { to: "/admin", label: "Overview", exact: true },
  { to: "/admin/leads", label: "Leads" },
  { to: "/admin/inbox", label: "Inbox" },
  { to: "/admin/team", label: "Team" },
];

function AdminLayout() {
  const fetchMe = useServerFn(getMe);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const { data: me, isLoading } = useQuery({ queryKey: ["me"], queryFn: () => fetchMe() });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", search: { redirect: undefined }, replace: true });
  }

  if (isLoading) {
    return <div className="p-10 text-sm text-muted-foreground">Loading workspace…</div>;
  }

  if (!me?.isStaff) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No dashboard access yet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Your account ({me?.email}) is signed in but has not been given a sales or admin
              role. Ask an admin to grant you access from the Team page.
            </p>
            <Button variant="outline" onClick={signOut}>
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3">
          <Link to="/" className="text-sm font-semibold tracking-tight">
            Cedar Homes <span className="text-muted-foreground">· Sales desk</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {me.fullName ?? me.email} · {me.isAdmin ? "Admin" : "Sales"}
            </span>
            <Button size="sm" variant="ghost" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
