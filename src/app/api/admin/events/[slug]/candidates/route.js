import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

// ---------------------------------------------------------------------------
// GET /api/admin/events/[slug]/candidates
// Returns all registrations for an event.
// Requires: Authorization: Bearer <ADMIN_PASSWORD>
// ---------------------------------------------------------------------------
export async function GET(request, { params }) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { slug } = await params;

    // Verify event exists
    const { data: event, error: eventError } = await supabaseAdmin
      .from("events")
      .select("id, title, slug")
      .eq("slug", slug)
      .single();

    if (eventError || !event) {
      return Response.json({ error: "Event not found." }, { status: 404 });
    }

    // Fetch candidates
    const { data: candidates, error: candidatesError } = await supabaseAdmin
      .from("registrations")
      .select("id, name, email, phone, college, year, branch, linkedin, github, created_at")
      .eq("event_id", event.id)
      .order("created_at", { ascending: true });

    if (candidatesError) {
      console.error("Candidates fetch error:", candidatesError);
      return Response.json({ error: "Failed to load candidates." }, { status: 500 });
    }

    return Response.json({
      event: { title: event.title, slug: event.slug },
      candidates: candidates || [],
      total: candidates?.length ?? 0,
    });
  } catch (err) {
    console.error("Admin candidates API error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
