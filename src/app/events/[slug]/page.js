import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({ params }) {
  const { slug } = await params;

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !event) {
    notFound();
  }

  const eventDate = new Date(event.date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const deadlineDate = new Date(event.registration_deadline).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isPastDeadline = new Date(event.registration_deadline) < new Date();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <Link
        href="/events"
        className="mb-8 inline-block text-sm underline underline-offset-4 hover:opacity-80"
      >
        ← All Events
      </Link>

      <span className="mb-3 inline-block rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium">
        {event.category}
      </span>

      <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{event.title}</h1>

      <p className="mb-8 text-foreground/70 leading-relaxed">{event.description}</p>

      <div className="mb-8 grid gap-4 rounded-xl border border-foreground/10 p-5 text-sm sm:grid-cols-2">
        <div>
          <p className="mb-0.5 font-medium text-foreground/40">Date</p>
          <p>{eventDate}</p>
        </div>
        {event.time && (
          <div>
            <p className="mb-0.5 font-medium text-foreground/40">Time</p>
            <p>{event.time}</p>
          </div>
        )}
        <div>
          <p className="mb-0.5 font-medium text-foreground/40">Mode</p>
          <p className="capitalize">{event.mode}</p>
        </div>
        <div>
          <p className="mb-0.5 font-medium text-foreground/40">Venue</p>
          <p>{event.mode === "online" ? "Online" : event.venue || "TBA"}</p>
        </div>
        <div>
          <p className="mb-0.5 font-medium text-foreground/40">Organizer</p>
          <p>{event.organizer}</p>
        </div>
        <div>
          <p className="mb-0.5 font-medium text-foreground/40">Capacity</p>
          <p>{event.capacity} participants</p>
        </div>
        <div className="sm:col-span-2">
          <p className="mb-0.5 font-medium text-foreground/40">Registration Deadline</p>
          <p>{deadlineDate}</p>
        </div>
      </div>

      {isPastDeadline ? (
        <p className="rounded-lg border border-foreground/10 px-5 py-3 text-center text-sm text-foreground/50">
          Registration for this event has closed.
        </p>
      ) : (
        <Link
          href={`/events/${event.slug}/register`}
          className="inline-block rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90"
        >
          Register Now
        </Link>
      )}
    </main>
  );
}
