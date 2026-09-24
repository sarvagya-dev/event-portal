import { supabase } from "@/lib/supabase";
import EventsClient from "@/components/EventsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Events — BasicUnstop",
  description:
    "Browse upcoming hackathons, workshops, coding competitions, and seminars. Register now.",
};

// ── Loading skeleton (used by Suspense boundary if needed) ────────────
function ErrorState() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-24 flex flex-col items-center gap-5 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl">⚠️</div>
      <div>
        <p className="font-semibold text-foreground">Unable to load events</p>
        <p className="mt-1 text-sm text-muted">There was a problem connecting to the database. Please try again later.</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-24 flex flex-col items-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-3xl">📅</div>
      <div>
        <p className="font-semibold text-foreground">No upcoming events</p>
        <p className="mt-1 text-sm text-muted">Check back soon — new events are added regularly.</p>
      </div>
    </div>
  );
}

export default async function EventsPage() {
  const today = new Date().toISOString().split("T")[0];

  const { data: events, error } = await supabase
    .from("events")
    .select(
      "id, slug, title, description, category, date, time, mode, venue, organizer, capacity"
    )
    .gte("date", today)
    .order("date", { ascending: true });

  if (error) {
    console.error("Failed to load events:", error);
    return <ErrorState />;
  }

  if (!events || events.length === 0) {
    return <EmptyState />;
  }

  return (
    <EventsClient events={events} />
  );
}
