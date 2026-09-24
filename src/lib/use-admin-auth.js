"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Returns { token, ready } where:
 * - `token`  is the admin token from sessionStorage (or null)
 * - `ready`  is true once we've checked sessionStorage (avoids flash)
 *
 * Automatically redirects to /admin/login if no token is present.
 */
export function useAdminAuth() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("adminToken");
    if (!stored) {
      router.replace("/admin/login");
    } else {
      setToken(stored);
    }
    setReady(true);
  }, [router]);

  function logout() {
    sessionStorage.removeItem("adminToken");
    router.replace("/admin/login");
  }

  return { token, ready, logout };
}
