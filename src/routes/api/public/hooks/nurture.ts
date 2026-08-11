/*
 * Cron endpoint that dispatches due follow-up messages.
 * Called every few minutes by the database scheduler.
 */
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/hooks/nurture")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env["SUPABASE_PUBLISHABLE_KEY"];
        const provided =
          request.headers.get("apikey") ??
          request.headers.get("authorization")?.replace("Bearer ", "");

        if (!expected || provided !== expected) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const { runDueNurtureTasks } = await import("@/lib/nurture.server");
          const result = await runDueNurtureTasks();
          console.log("[nurture] run", JSON.stringify(result));
          return Response.json({ ok: true, ...result });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          console.error("[nurture] run failed", message);
          return new Response(JSON.stringify({ ok: false, error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
