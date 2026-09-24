import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const today = new Date().toISOString().split("T")[0];

  const { data: events, error } = await supabase
    .from("events")
    .select("id, slug, title, description, category, date, time, mode, venue, organizer, capacity")
    .gte("date", today)
    .order("date", { ascending: true });

  if (error) {
    console.error("Failed to load events:", error);
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <p className="text-lg text-red-500">
          Unable to load events. Please try again later.
        </p>
      </main>
    );
  }

  if (!events || events.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
        <h1 className="text-3xl font-bold">Upcoming Events</h1>
        <p className="text-foreground/60">No upcoming events at the moment. Check back soon!</p>
        <Link href="/" className="text-sm underline underline-offset-4 hover:opacity-80">
          ← Back home
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Upcoming Events</h1>
        <Link href="/" className="text-sm underline underline-offset-4 hover:opacity-80">
          ← Home
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.slug}`}
            className="group flex flex-col rounded-xl border border-foreground/10 p-5 transition hover:border-foreground/25 hover:shadow-md"
          >
            <span className="mb-2 inline-block w-fit rounded-full bg-foreground/5 px-3 py-0.5 text-xs font-medium">
              {event.category}
            </span>
            <h2 className="mb-1 text-lg font-semibold group-hover:underline">
              {event.title}
            </h2>
            <p className="mb-4 line-clamp-2 text-sm text-foreground/60">
              {event.description}
            </p>
            <div className="mt-auto space-y-1 text-xs text-foreground/50">
              <p>📅 {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
              <p>📍 {event.mode === "online" ? "Online" : event.venue || "TBA"}</p>
              <p>👤 {event.organizer}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
