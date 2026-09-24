"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/events", label: "All Events" },
  { href: "/events?category=Hackathon", label: "Hackathons" },
  { href: "/events?category=Workshop", label: "Workshops" },
  { href: "/events?category=Competition", label: "Competitions" },
  { href: "/admin", label: "Admin" },
];

export default function NavMobile() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        id="nav-mobile-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted hover:text-foreground hover:bg-surface transition"
      >
        {open ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-14 z-50 border-b border-border bg-background px-4 py-3 shadow-lg">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-surface transition"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
