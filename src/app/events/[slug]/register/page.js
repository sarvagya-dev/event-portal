import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import RegistrationForm from "./RegistrationForm";

export const dynamic = "force-dynamic";

function categoryGradientIndex(category = "") {
  let h = 0;
  for (let i = 0; i < category.length; i++) {
    h = (h * 31 + category.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(h) % 9;
}

export default async function RegisterPage({ params }) {
  const { slug } = await params;

  const { data: event, error } = await supabase
    .from("events")
    .select(
      "id, slug, title, description, category, date, time, mode, venue, organizer, registration_deadline, capacity"
    )
    .eq("slug", slug)
    .single();

  if (error || !event) notFound();

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

  const locationText =
    event.mode === "online" ? "Online" :
    event.mode === "hybrid" ? `Hybrid${event.venue ? ` · ${event.venue}` : ""}` :
    event.venue || "TBA";

  const gradIdx = categoryGradientIndex(event.category);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted">
        <Link href="/events" className="hover:text-foreground transition">Events</Link>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        <Link href={`/events/${slug}`} className="hover:text-foreground transition truncate max-w-[160px]">{event.title}</Link>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        <span className="text-foreground font-medium">Register</span>
      </nav>

      {/* ── Event summary card ─────────────────────────────────────── */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-surface">
        {/* Mini banner */}
        <div className={`cat-gradient-${gradIdx} h-14 w-full`} />
        <div className="p-5">
          <span className="inline-block rounded-full border border-accent/20 bg-accent-light px-2.5 py-0.5 text-[11px] font-medium text-accent mb-2">
            {event.category}
          </span>
          <h1 className="text-xl font-bold leading-snug mb-3">{event.title}</h1>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {eventDate}{event.time ? ` · ${event.time}` : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {locationText}
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {event.organizer}
            </span>
          </div>
        </div>
      </div>

      {/* ── Closed / Open ──────────────────────────────────────────── */}
      {isPastDeadline ? (
        <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-2 text-2xl">🔒</div>
          <p className="text-lg font-semibold">Registration Closed</p>
          <p className="mt-2 text-sm text-muted">
            The deadline was {deadlineDate}. This event is no longer accepting registrations.
          </p>
          <Link
            href="/events"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            Browse other events →
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-base font-bold">Complete Registration</h2>
            <p className="mt-0.5 text-xs text-muted">
              Registration deadline: <span className="font-medium text-foreground">{deadlineDate}</span>
            </p>
          </div>
          <RegistrationForm event={{ slug: event.slug, title: event.title }} />
        </>
      )}
    </main>
  );
}
