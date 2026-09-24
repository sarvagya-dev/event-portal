"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/lib/use-admin-auth";

export default function AdminDashboardPage() {
  const { token, ready, logout } = useAdminAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEvents = useCallback(async () => {
    if (!token) {
      setLoading(false); // ← was missing: token null → loading stuck forever
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        logout();
        return;
      }
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server error (HTTP ${res.status}) — check Vercel logs.`);
      }
      if (!res.ok) throw new Error(data.error || `Server error (HTTP ${res.status}).`);
      setEvents(data.events || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    if (ready && token) loadEvents();
  }, [ready, token, loadEvents]);

  if (!ready) return null;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="mt-0.5 text-sm text-foreground/50">
            All events and registration counts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/events"
            className="text-sm text-foreground/50 underline underline-offset-4 hover:text-foreground/80 transition"
          >
            Public site
          </Link>
          <button
            id="admin-logout-btn"
            onClick={logout}
            className="rounded-lg border border-foreground/15 px-4 py-2 text-sm font-medium transition hover:bg-foreground/5"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* States */}
      {loading && (
        <p className="text-sm text-foreground/50">Loading events…</p>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <p className="text-sm text-foreground/50">No events found.</p>
      )}

      {/* Events table */}
      {!loading && events.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-foreground/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-foreground/10 bg-foreground/[0.02]">
                <th className="px-4 py-3 text-left font-semibold text-foreground/60">Event</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground/60">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground/60">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground/60">Organizer</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground/60">Registrations</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, idx) => (
                <tr
                  key={event.id}
                  className={`border-b border-foreground/5 transition hover:bg-foreground/[0.02] ${idx === events.length - 1 ? "border-none" : ""}`}
                >
                  <td className="px-4 py-3 font-medium">{event.title}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-foreground/5 px-2.5 py-0.5 text-xs">
                      {event.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground/60">
                    {new Date(event.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-foreground/60">{event.organizer}</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`font-semibold tabular-nums ${
                        event.registrationCount === 0 ? "text-foreground/30" : "text-foreground"
                      }`}
                    >
                      {event.registrationCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/events/${event.slug}/candidates`}
                      className="rounded-lg border border-foreground/15 px-3 py-1.5 text-xs font-medium transition hover:bg-foreground/5"
                    >
                      View Candidates →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
