"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAdminAuth } from "@/lib/use-admin-auth";

export default function CandidatesPage() {
  const { slug } = useParams();
  const { token, ready, logout } = useAdminAuth();

  const [data, setData] = useState(null); // { event, candidates, total }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Email composer state
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailResult, setEmailResult] = useState(null); // { success, message, sent, failed, total }
  const [emailError, setEmailError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const loadCandidates = useCallback(async () => {
    if (!token || !slug) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/events/${slug}/candidates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { logout(); return; }
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load candidates.");
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, slug, logout]);

  useEffect(() => {
    if (ready && token) loadCandidates();
  }, [ready, token, loadCandidates]);

  async function handleSendEmail(e) {
    e.preventDefault();
    setEmailError(null);
    setEmailResult(null);

    if (!subject.trim()) { setEmailError("Subject is required."); return; }
    if (!message.trim()) { setEmailError("Message body is required."); return; }
    setShowConfirm(true);
  }

  async function confirmSend() {
    setShowConfirm(false);
    setEmailSending(true);
    setEmailError(null);
    setEmailResult(null);

    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slug, subject: subject.trim(), message: message.trim() }),
      });
      if (res.status === 401) { logout(); return; }
      const json = await res.json();
      if (!res.ok) {
        setEmailError(json.error || "Failed to send email.");
      } else {
        setEmailResult(json);
        setSubject("");
        setMessage("");
      }
    } catch {
      setEmailError("Unable to reach the server. Please try again.");
    } finally {
      setEmailSending(false);
    }
  }

  if (!ready) return null;

  const candidates = data?.candidates ?? [];
  const total = data?.total ?? 0;
  const eventTitle = data?.event?.title ?? "";

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="mb-3 inline-block text-sm text-foreground/50 underline underline-offset-4 hover:text-foreground/80 transition"
          >
            ← Admin Dashboard
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            {loading ? "Loading…" : eventTitle || "Candidates"}
          </h1>
          {!loading && (
            <p className="mt-0.5 text-sm text-foreground/50">
              {total === 0
                ? "No registrations yet."
                : `${total} candidate${total !== 1 ? "s" : ""} registered`}
            </p>
          )}
        </div>
        <button
          id="admin-logout-btn-candidates"
          onClick={logout}
          className="shrink-0 rounded-lg border border-foreground/15 px-4 py-2 text-sm font-medium transition hover:bg-foreground/5"
        >
          Sign Out
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Candidate table */}
      {!loading && candidates.length === 0 && !error && (
        <div className="mb-8 rounded-xl border border-foreground/10 px-6 py-12 text-center">
          <p className="text-sm text-foreground/40">
            No candidates have registered for this event yet.
          </p>
        </div>
      )}

      {!loading && candidates.length > 0 && (
        <div className="mb-10 overflow-x-auto rounded-xl border border-foreground/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-foreground/10 bg-foreground/[0.02]">
                {["Name","Email","Phone","College","Year","Branch","LinkedIn","GitHub","Registered"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-foreground/50 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {candidates.map((c, idx) => (
                <tr
                  key={c.id}
                  className={`border-b border-foreground/5 hover:bg-foreground/[0.02] transition ${idx === candidates.length - 1 ? "border-none" : ""}`}
                >
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{c.name}</td>
                  <td className="px-4 py-3 text-foreground/70 whitespace-nowrap">{c.email}</td>
                  <td className="px-4 py-3 text-foreground/60 whitespace-nowrap">{c.phone}</td>
                  <td className="px-4 py-3 text-foreground/60">{c.college}</td>
                  <td className="px-4 py-3 text-foreground/60 whitespace-nowrap">{c.year}</td>
                  <td className="px-4 py-3 text-foreground/60">{c.branch}</td>
                  <td className="px-4 py-3">
                    {c.linkedin ? (
                      <a href={c.linkedin} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-foreground/50 underline underline-offset-2 hover:text-foreground transition">
                        LinkedIn ↗
                      </a>
                    ) : <span className="text-foreground/25">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {c.github ? (
                      <a href={c.github} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-foreground/50 underline underline-offset-2 hover:text-foreground transition">
                        GitHub ↗
                      </a>
                    ) : <span className="text-foreground/25">—</span>}
                  </td>
                  <td className="px-4 py-3 text-foreground/40 whitespace-nowrap text-xs">
                    {new Date(c.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Email composer — only show if there are candidates */}
      {!loading && candidates.length > 0 && (
        <div className="rounded-xl border border-foreground/10 p-6">
          <h2 className="mb-1 text-base font-semibold">Email Candidates</h2>
          <p className="mb-5 text-sm text-foreground/50">
            Send a message to all {total} registered candidate{total !== 1 ? "s" : ""} for this event.
            Each email is sent individually — recipients cannot see each other&apos;s addresses.
          </p>

          <form onSubmit={handleSendEmail} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email-subject" className="block text-sm font-medium text-foreground/80">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                id="email-subject"
                type="text"
                maxLength={200}
                required
                value={subject}
                onChange={(e) => { setSubject(e.target.value); setEmailError(null); setEmailResult(null); }}
                placeholder="e.g. Important update about Code Clash 2026"
                className="w-full rounded-lg border border-foreground/15 bg-foreground/[0.03] px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground/35 outline-none transition focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email-message" className="block text-sm font-medium text-foreground/80">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="email-message"
                rows={6}
                maxLength={10000}
                required
                value={message}
                onChange={(e) => { setMessage(e.target.value); setEmailError(null); setEmailResult(null); }}
                placeholder="Write your message here…"
                className="w-full rounded-lg border border-foreground/15 bg-foreground/[0.03] px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground/35 outline-none transition focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 resize-y"
              />
              <p className="text-xs text-foreground/30 text-right">{message.length}/10000</p>
            </div>

            {emailError && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {emailError}
              </div>
            )}

            {emailResult && (
              <div className={`rounded-lg border px-4 py-3 text-sm ${
                emailResult.success
                  ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
                  : "border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-400"
              }`}>
                <p className="font-medium">{emailResult.message}</p>
                <p className="mt-0.5 text-xs opacity-70">
                  Total: {emailResult.total} · Sent: {emailResult.sent} · Failed: {emailResult.failed}
                </p>
              </div>
            )}

            <button
              id="send-email-btn"
              type="submit"
              disabled={emailSending || !subject.trim() || !message.trim()}
              className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {emailSending ? "Sending…" : `Send to ${total} Candidate${total !== 1 ? "s" : ""}`}
            </button>
          </form>
        </div>
      )}

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-sm rounded-2xl border border-foreground/10 bg-background p-6 shadow-xl">
            <h3 className="mb-2 text-base font-semibold">Confirm Email Send</h3>
            <p className="mb-1 text-sm text-foreground/60">
              You are about to send an email to{" "}
              <strong>{total} candidate{total !== 1 ? "s" : ""}</strong>.
            </p>
            <p className="mb-5 text-sm text-foreground/60">
              Subject: <em>&ldquo;{subject}&rdquo;</em>
            </p>
            <div className="flex gap-3">
              <button
                id="confirm-send-btn"
                onClick={confirmSend}
                className="flex-1 rounded-lg bg-foreground py-2 text-sm font-semibold text-background transition hover:opacity-90"
              >
                Confirm Send
              </button>
              <button
                id="cancel-send-btn"
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-lg border border-foreground/15 py-2 text-sm font-medium transition hover:bg-foreground/5"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
