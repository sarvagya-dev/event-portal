import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import RegistrationForm from "./RegistrationForm";

export const dynamic = "force-dynamic";

export default async function RegisterPage({ params }) {
  const { slug } = await params;

  const { data: event, error } = await supabase
    .from("events")
    .select("id, slug, title, description, category, date, time, mode, venue, organizer, registration_deadline, capacity")
    .eq("slug", slug)
    .single();

  if (error || !event) {
    notFound();
  }

  const eventDate = new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const isPastDeadline = new Date(event.registration_deadline) < new Date();

  const deadlineDate = new Date(event.registration_deadline).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12 sm:py-16">
      <Link
        href={`/events/${slug}`}
        className="mb-8 inline-block text-sm underline underline-offset-4 hover:opacity-80"
      >
        ← Back to event
      </Link>

      {/* ── Event summary card ───────────────────────────────────── */}
      <div className="mb-8 rounded-xl border border-foreground/10 p-5">
        <span className="mb-2 inline-block rounded-full bg-foreground/5 px-2.5 py-0.5 text-xs font-medium">
          {event.category}
        </span>
        <h1 className="mb-1 text-xl font-bold sm:text-2xl">{event.title}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground/50">
          <span>📅 {eventDate}{event.time ? ` · ${event.time}` : ""}</span>
          <span>📍 {event.mode === "online" ? "Online" : event.venue || "TBA"}</span>
          <span>👤 {event.organizer}</span>
        </div>
      </div>

      {isPastDeadline ? (
        <div className="rounded-xl border border-foreground/10 px-6 py-10 text-center">
          <p className="mb-1 text-lg font-semibold">Registration Closed</p>
          <p className="mb-4 text-sm text-foreground/50">
            The deadline was {deadlineDate}. Registration for this event is no longer available.
          </p>
          <Link
            href="/events"
            className="text-sm underline underline-offset-4 hover:opacity-80"
          >
            Browse other events →
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Register</h2>
            <p className="text-sm text-foreground/50">
              Deadline: {deadlineDate}
            </p>
          </div>
          <RegistrationForm event={{ slug: event.slug, title: event.title }} />
        </>
      )}
    </main>
  );
}
