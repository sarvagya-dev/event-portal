// Server component — no "use client" needed.
// Mobile hamburger toggling handled by a sibling client component below.
import Link from "next/link";
import NavMobile from "./NavMobile";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand */}
        <Link
          href="/events"
          className="flex items-center gap-2 text-base font-bold tracking-tight text-foreground hover:opacity-80 transition shrink-0"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-fg text-sm font-black select-none">
            B
          </span>
          <span>BasicUnstop</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/events" className="rounded-md px-3 py-1.5 text-sm font-medium text-muted hover:text-foreground hover:bg-surface transition">
            Events
          </Link>
          <Link href="/events?category=Hackathon" className="rounded-md px-3 py-1.5 text-sm font-medium text-muted hover:text-foreground hover:bg-surface transition">
            Hackathons
          </Link>
          <Link href="/events?category=Workshop" className="rounded-md px-3 py-1.5 text-sm font-medium text-muted hover:text-foreground hover:bg-surface transition">
            Workshops
          </Link>
          <Link href="/events?category=Competition" className="rounded-md px-3 py-1.5 text-sm font-medium text-muted hover:text-foreground hover:bg-surface transition">
            Competitions
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted hover:text-foreground hover:bg-surface transition"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Admin
          </Link>
          <Link
            href="/events"
            className="inline-flex items-center rounded-md bg-accent px-3.5 py-1.5 text-sm font-semibold text-accent-fg hover:opacity-90 transition"
          >
            Explore
          </Link>
          {/* Mobile menu */}
          <NavMobile />
        </div>
      </div>
    </header>
  );
}
