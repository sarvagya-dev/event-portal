import { supabase } from "@/lib/supabase";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    // Fetch a single event by slug
    if (slug) {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return Response.json({ error: "Event not found" }, { status: 404 });
        }
        throw error;
      }

      return Response.json(data);
    }

    // Fetch all upcoming events (date >= today), ordered by date ascending
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("date", today)
      .order("date", { ascending: true });

    if (error) {
      throw error;
    }

    return Response.json(data);
  } catch (err) {
    console.error("Events API error:", err);
    return Response.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
