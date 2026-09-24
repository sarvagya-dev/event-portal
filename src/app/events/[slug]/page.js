import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// ── Helpers ──────────────────────────────────────────────────────────
function categoryGradientIndex(category = "") {
  let h = 0;
  for (let i = 0; i < category.length; i++) {
    h = (h * 31 + category.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(h) % 9;
}

function categoryAbbr(category = "") {
  const words = category.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return category.slice(0, 2).toUpperCase();
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-2 text-muted text-sm">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: event } = await supabase
    .from("events")
    .select("title, description")
    .eq("slug", slug)
    .single();
  if (!event) return { title: "Event Not Found" };
  return {
    title: `${event.title} — BasicUnstop`,
    description: event.description,
  };
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params;

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !event) notFound();

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
  const gradIdx = categoryGradientIndex(event.category);
  const abbr = categoryAbbr(event.category);
  const locationText =
    event.mode === "online" ? "Online" :
    event.mode === "hybrid" ? `Hybrid${event.venue ? ` · ${event.venue}` : ""}` :
    event.venue || "TBA";

  return (
    <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
      {/* ── Breadcrumb ─────────────────────────────────────────────── */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted">
        <Link href="/events" className="hover:text-foreground transition">Events</Link>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        <span className="text-foreground font-medium truncate max-w-xs">{event.title}</span>
      </nav>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* ── LEFT COLUMN ──────────────────────────────────────────── */}
        <div>
          {/* Hero banner */}
          <div className={`cat-gradient-${gradIdx} relative h-52 sm:h-72 w-full rounded-2xl flex items-center justify-center overflow-hidden mb-6`}>
            <span className="text-7xl sm:text-8xl font-black text-white/20 select-none">
              {abbr}
            </span>
            {/* Category badge overlaid */}
            <div className="absolute bottom-4 left-4">
              <span className="rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1 text-xs font-semibold text-white">
                {event.category}
              </span>
            </div>
          </div>

          {/* Title + description */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mb-4">
            {event.title}
          </h1>

          <div className="prose prose-sm max-w-none text-muted leading-relaxed">
            {event.description.split("\n").map((para, i) => (
              para.trim() ? <p key={i}>{para}</p> : null
            ))}
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ─────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* CTA card */}
          <div className="rounded-2xl border border-border bg-surface p-5">
            {isPastDeadline ? (
              <div className="text-center py-2">
                <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-full bg-surface-2 mb-3 text-muted text-lg">🔒</div>
                <p className="font-semibold text-foreground">Registration Closed</p>
                <p className="mt-1 text-xs text-muted">Deadline was {deadlineDate}.</p>
                <Link
                  href="/events"
                  className="mt-4 inline-block text-xs font-medium text-accent hover:underline"
                >
                  ← Browse other events
                </Link>
              </div>
            ) : (
              <>
                <p className="text-xs text-muted mb-1">
                  Deadline: <span className="font-medium text-foreground">{deadlineDate}</span>
                </p>
                <Link
                  id="register-now-btn"
                  href={`/events/${event.slug}/register`}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-bold text-accent-fg hover:opacity-90 transition"
                >
                  Register Now
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
                <p className="mt-3 text-center text-[11px] text-muted">
                  {event.capacity} seats · Free to register
                </p>
              </>
            )}
          </div>

          {/* Details card */}
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">Event Details</h2>
            <div>
              <InfoRow
                icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
                label="Date"
                value={eventDate}
              />
              {event.time && (
                <InfoRow
                  icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                  label="Time"
                  value={event.time}
                />
              )}
              <InfoRow
                icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}
                label="Location"
                value={locationText}
              />
              <InfoRow
                icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                label="Organizer"
                value={event.organizer}
              />
              <InfoRow
                icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                label="Capacity"
                value={`${event.capacity} participants`}
              />
              <InfoRow
                icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                label="Registration Deadline"
                value={deadlineDate}
              />
            </div>
          </div>

          {/* Back link */}
          <Link
            href="/events"
            className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to all events
          </Link>
        </div>
      </div>
    </main>
  );
}
