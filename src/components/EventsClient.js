"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Maps navbar keyword → substring match against event.category (case-insensitive).
// Allows "Hackathon" to match "HackSprint Winter 2026" category, etc.
const NAV_CATEGORY_MAP = {
  Hackathon:   "hackathon",
  Workshop:    "workshop",
  Competition: "competition",
};

// ── Deterministic gradient thumbnail (no image field in schema) ─────────
// Hashes the category string into one of 9 palettes so the same category
// always gets the same colour combination.
function categoryGradientIndex(category = "") {
  let h = 0;
  for (let i = 0; i < category.length; i++) {
    h = (h * 31 + category.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(h) % 9;
}

// Returns a short 2-letter abbreviation for the category thumbnail.
function categoryAbbr(category = "") {
  const words = category.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return category.slice(0, 2).toUpperCase();
}

// ── Format helpers ────────────────────────────────────────────────────
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function modeLabel(mode, venue) {
  if (mode === "online") return "Online";
  if (mode === "hybrid") return `Hybrid${venue ? ` · ${venue}` : ""}`;
  return venue || "Offline";
}

// ── Category Badge ────────────────────────────────────────────────────
function CategoryBadge({ category, size = "sm" }) {
  return (
    <span
      className={`inline-block rounded-full border border-accent/20 bg-accent-light text-accent font-medium ${
        size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
      }`}
    >
      {category}
    </span>
  );
}

// ── Event Thumbnail ───────────────────────────────────────────────────
function EventThumbnail({ category, large = false }) {
  const idx = categoryGradientIndex(category);
  const abbr = categoryAbbr(category);
  return (
    <div
      className={`cat-gradient-${idx} flex items-center justify-center ${
        large ? "h-52 sm:h-64" : "h-36"
      } w-full rounded-t-xl select-none`}
    >
      <span
        className={`font-black text-white/90 drop-shadow ${
          large ? "text-5xl" : "text-3xl"
        }`}
      >
        {abbr}
      </span>
    </div>
  );
}

// ── Single Event Card ─────────────────────────────────────────────────
function EventCard({ event, featured = false }) {
  if (featured) {
    return (
      <Link
        href={`/events/${event.slug}`}
        className="group flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-border bg-surface hover:border-accent/40 hover:shadow-lg transition-all duration-200"
      >
        {/* Thumbnail */}
        <div className="sm:w-64 shrink-0">
          <EventThumbnail category={event.category} large />
        </div>
        {/* Content */}
        <div className="flex flex-col justify-between p-5 sm:p-6 gap-4 flex-1">
          <div>
            <CategoryBadge category={event.category} size="md" />
            <h3 className="mt-3 text-xl font-bold leading-snug group-hover:text-accent transition-colors">
              {event.title}
            </h3>
            <p className="mt-2 text-sm text-muted line-clamp-3 leading-relaxed">
              {event.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted border-t border-border pt-4">
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {modeLabel(event.mode, event.venue)}
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {event.organizer}
            </span>
            <span className="ml-auto inline-flex items-center gap-1 text-accent font-semibold">
              View Event
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface hover:border-accent/40 hover:shadow-md transition-all duration-200"
    >
      <EventThumbnail category={event.category} />
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex items-start justify-between gap-2">
          <CategoryBadge category={event.category} />
        </div>
        <h3 className="text-sm font-semibold leading-snug group-hover:text-accent transition-colors line-clamp-2">
          {event.title}
        </h3>
        <p className="text-xs text-muted line-clamp-2 leading-relaxed flex-1">
          {event.description}
        </p>
        <div className="border-t border-border pt-3 space-y-1.5 text-[11px] text-muted">
          <div className="flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {formatDate(event.date)}
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {modeLabel(event.mode, event.venue)}
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {event.organizer}
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent mt-1">
          View Event
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </span>
      </div>
    </Link>
  );
}

// ── Mode pill ─────────────────────────────────────────────────────────
const MODE_FILTERS = ["All", "Online", "Offline", "Hybrid"];

// ── Main client component ─────────────────────────────────────────────
export default function EventsClient({ events }) {
  // Read the ?category= query param reactively so navbar links work on
  // client-side navigation (useState initial value only fires on mount).
  const searchParams = useSearchParams();
  const navCategory = searchParams.get("category") || "All";

  const [search, setSearch] = useState("");
  // category chip state tracks the FULL category string ("All" or exact DB value)
  // but is initialised/synced from the URL nav keyword via useEffect.
  const [category, setCategory] = useState("All");
  const [mode, setMode] = useState("All");

  // Sync chip state whenever the URL ?category changes (client-side navigation).
  useEffect(() => {
    setCategory(navCategory);
    setSearch("");  // clear search so the filter result is clean
    setMode("All");
  }, [navCategory]);

  // Derive all unique categories from data
  const categories = useMemo(() => {
    const cats = ["All", ...new Set(events.map((e) => e.category))];
    return cats;
  }, [events]);

  // Filter logic
  const filtered = useMemo(() => {
    return events.filter((e) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.organizer?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q);
      // Category matching: if the chip value exactly equals a DB category, use
      // exact match. If it's a navbar keyword (e.g. "Hackathon"), use substring
      // containment so "Coding Competition" matches "Competition" etc.
      const navKeyword = NAV_CATEGORY_MAP[category];
      const matchesCategory =
        category === "All" ||
        (navKeyword
          ? e.category?.toLowerCase().includes(navKeyword)
          : e.category === category);
      const matchesMode =
        mode === "All" ||
        e.mode?.toLowerCase() === mode.toLowerCase();
      return matchesSearch && matchesCategory && matchesMode;
    });
  }, [events, search, category, mode]);

  // Featured = first 2 events (no filter applied — always from full list)
  const featured = events.slice(0, 2);
  const isFiltering = search || category !== "All" || mode !== "All";

  return (
    <div>
      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-light px-3 py-1 text-xs font-medium text-accent">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
              </span>
              Events open for registration
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Discover.{" "}
              <span className="text-accent">Participate.</span>{" "}
              Build.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted max-w-xl leading-relaxed">
              Find hackathons, workshops, coding competitions, and seminars.
              Register in seconds. Level up your profile.
            </p>
          </div>

          {/* ── Search + filters ─────────────────────────────────── */}
          <div className="mt-8 flex flex-col gap-4">
            {/* Search bar */}
            <div className="relative max-w-xl">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                id="event-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, organizers, topics…"
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition"
              />
            </div>

            {/* Category chips */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  id={`filter-cat-${cat.replace(/\s+/g, "-").toLowerCase()}`}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full border px-3.5 py-1 text-xs font-medium transition ${
                    category === cat
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-border bg-background text-muted hover:border-accent/40 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Mode pills */}
            <div className="flex gap-2">
              {MODE_FILTERS.map((m) => (
                <button
                  key={m}
                  id={`filter-mode-${m.toLowerCase()}`}
                  onClick={() => setMode(m)}
                  className={`rounded-md border px-3 py-1 text-[11px] font-medium transition ${
                    mode === m
                      ? "border-foreground/30 bg-foreground text-background"
                      : "border-border bg-background text-muted hover:border-foreground/20 hover:text-foreground"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-14">
        {/* ── FEATURED (only when not filtering) ──────────────────── */}
        {!isFiltering && featured.length > 0 && (
          <section>
            <div className="mb-5 flex items-center gap-3">
              <h2 className="text-lg font-bold">Featured Events</h2>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="flex flex-col gap-4">
              {featured.map((ev) => (
                <EventCard key={ev.id} event={ev} featured />
              ))}
            </div>
          </section>
        )}

        {/* ── ALL / FILTERED EVENTS ────────────────────────────────── */}
        <section>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold">
                {isFiltering ? "Results" : "All Events"}
              </h2>
              <span className="h-px flex-1 bg-border hidden sm:block w-20" />
            </div>
            <span className="text-xs text-muted">
              {filtered.length} event{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-3xl">
                🔍
              </div>
              <p className="font-semibold text-foreground">No events found</p>
              <p className="text-sm text-muted max-w-xs">
                Try a different search term, category, or mode filter.
              </p>
              <button
                onClick={() => { setSearch(""); setCategory("All"); setMode("All"); }}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-surface transition"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
