import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

// ---------------------------------------------------------------------------
// GET /api/admin/events — all events with registration counts
// Requires: Authorization: Bearer <ADMIN_PASSWORD>
// ---------------------------------------------------------------------------
export async function GET(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    // Fetch all events ordered by date descending
    const { data: events, error: eventsError } = await supabaseAdmin
      .from("events")
      .select("id, slug, title, date, category, organizer")
      .order("date", { ascending: false });

    if (eventsError) {
      console.error("Admin events fetch error:", eventsError);
      return Response.json({ error: "Failed to load events." }, { status: 500 });
    }

    // Fetch registration counts per event
    const { data: counts, error: countsError } = await supabaseAdmin
      .from("registrations")
      .select("event_id");

    if (countsError) {
      console.error("Admin registration count error:", countsError);
      return Response.json({ error: "Failed to load registration counts." }, { status: 500 });
    }

    // Build a quick lookup: event_id → count
    const countMap = {};
    for (const row of counts || []) {
      countMap[row.event_id] = (countMap[row.event_id] || 0) + 1;
    }

    const eventsWithCounts = (events || []).map((e) => ({
      ...e,
      registrationCount: countMap[e.id] || 0,
    }));

    return Response.json({ events: eventsWithCounts });
  } catch (err) {
    console.error("Admin events API error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
