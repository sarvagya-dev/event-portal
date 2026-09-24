"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Verify the password by calling a protected admin endpoint.
      // If it returns 200, the password is correct.
      const res = await fetch("/api/admin/events", {
        headers: { Authorization: `Bearer ${password}` },
      });

      if (res.ok) {
        // Store only in sessionStorage (cleared when tab closes, never in localStorage)
        sessionStorage.setItem("adminToken", password);
        router.push("/admin");
      } else {
        setError("Incorrect password. Please try again.");
        setPassword("");
      }
    } catch {
      setError("Unable to reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-24 bg-background">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background text-lg">
            ⚙
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Access</h1>
          <p className="mt-1 text-sm text-foreground/50">
            Enter the admin password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium text-foreground/80"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="••••••••••••"
              className="w-full rounded-lg border border-foreground/15 bg-foreground/[0.03] px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground/25 outline-none transition focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-lg bg-foreground py-2.5 text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying…" : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
