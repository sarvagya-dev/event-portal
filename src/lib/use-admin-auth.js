"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Returns { token, ready, logout } where:
 * - `token`  is the admin token from sessionStorage (or null)
 * - `ready`  is true once we've checked sessionStorage (avoids flash)
 * - `logout` is a stable function reference (memoized with useCallback)
 *
 * Automatically redirects to /admin/login if no token is present.
 */
export function useAdminAuth() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Read sessionStorage exactly once on mount.
    // router is intentionally excluded from deps: useRouter() returns a new
    // object on every render in Next.js App Router, which would cause this
    // effect to re-run every render → repeated setToken/setReady calls →
    // infinite re-render loop in any consumer that depends on token/logout.
    const stored = sessionStorage.getItem("adminToken");
    if (!stored) {
      router.replace("/admin/login");
    } else {
      setToken(stored);
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memoize logout so its reference is stable across renders.
  // Without this, every render produces a new function → useCallback in the
  // consumer recreates loadEvents → the fetch effect re-fires → loop.
  const logout = useCallback(() => {
    sessionStorage.removeItem("adminToken");
    router.replace("/admin/login");
  }, [router]);

  return { token, ready, logout };
}
