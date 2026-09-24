"use client";

import { useState } from "react";
import Link from "next/link";

const YEAR_OPTIONS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "5th Year",
  "Postgraduate",
  "Alumni",
  "Other",
];

function Field({ label, id, required, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground/80">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-foreground/15 bg-foreground/[0.03] px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground/35 outline-none transition focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10";

export default function RegistrationForm({ event }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    year: "",
    branch: "",
    linkedin: "",
    github: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successTitle, setSuccessTitle] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: event.slug, ...form }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccessTitle(data.eventTitle || event.title);
      setEmailSent(!!data.emailSent);
      setSuccess(true);
    } catch {
      setError("Unable to reach the server. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success state ─────────────────────────────────────────────────
  if (success) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-2xl border border-foreground/10 px-6 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-2xl">
          ✓
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">You&apos;re registered!</h2>
          <p className="text-sm text-foreground/60 max-w-sm">
            Your registration for <span className="font-medium text-foreground/90">{successTitle}</span> has been received.
          </p>
          <p className="text-xs text-foreground/40 max-w-xs mx-auto">
            {emailSent
              ? "A confirmation email has been sent to your inbox."
              : "Your spot is secured. We couldn\u2019t send a confirmation email right now, but your registration is saved."}
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Link
            href={`/events/${event.slug}`}
            className="rounded-lg border border-foreground/15 px-4 py-2 text-sm font-medium transition hover:bg-foreground/5"
          >
            ← Event Details
          </Link>
          <Link
            href="/events"
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
          >
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  // ── Registration form ─────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ── Personal info ──────────────────────────────────────────── */}
      <fieldset className="space-y-4">
        <legend className="mb-1 text-xs font-semibold uppercase tracking-wider text-foreground/40">
          Personal Information
        </legend>

        <Field label="Full Name" id="name" required>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="e.g. Priya Sharma"
            value={form.name}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" id="email" required>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>

          <Field label="Phone" id="phone" required>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
        </div>
      </fieldset>

      {/* ── Academic info ──────────────────────────────────────────── */}
      <fieldset className="space-y-4">
        <legend className="mb-1 text-xs font-semibold uppercase tracking-wider text-foreground/40">
          Academic Details
        </legend>

        <Field label="College / University" id="college" required>
          <input
            id="college"
            name="college"
            type="text"
            autoComplete="organization"
            required
            placeholder="e.g. IIT Delhi"
            value={form.college}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Year of Study" id="year" required>
            <select
              id="year"
              name="year"
              required
              value={form.year}
              onChange={handleChange}
              className={`${inputClass} ${!form.year ? "text-foreground/35" : ""}`}
            >
              <option value="" disabled>
                Select year
              </option>
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Branch / Specialization" id="branch" required>
            <input
              id="branch"
              name="branch"
              type="text"
              required
              placeholder="e.g. Computer Science"
              value={form.branch}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
        </div>
      </fieldset>

      {/* ── Online profiles (optional) ─────────────────────────────── */}
      <fieldset className="space-y-4">
        <legend className="mb-1 text-xs font-semibold uppercase tracking-wider text-foreground/40">
          Online Profiles
          <span className="ml-2 text-[10px] font-normal normal-case tracking-normal text-foreground/30">
            optional
          </span>
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="LinkedIn URL" id="linkedin">
            <input
              id="linkedin"
              name="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/yourname"
              value={form.linkedin}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>

          <Field label="GitHub URL" id="github">
            <input
              id="github"
              name="github"
              type="url"
              placeholder="https://github.com/yourname"
              value={form.github}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
        </div>
      </fieldset>

      {/* ── Error banner ───────────────────────────────────────────── */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* ── Submit ─────────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-foreground py-3 text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Registering…" : "Confirm Registration"}
      </button>

      <p className="text-center text-xs text-foreground/30">
        By registering you agree to share the information above with the event organizer.
      </p>
    </form>
  );
}
