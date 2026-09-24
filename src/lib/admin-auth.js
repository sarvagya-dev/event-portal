/**
 * Server-side admin authentication helpers.
 * NEVER import this file from client components.
 *
 * Strategy: stateless bearer token.
 * The client sends the raw password in the Authorization header:
 *   Authorization: Bearer <ADMIN_PASSWORD>
 * The server compares it against the env var server-side.
 * No sessions, no JWTs, no cookies — keeps it simple and secure for an MVP.
 */

/** Returns true if the request carries a valid admin token. */
export function isAdminAuthorized(request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error("ADMIN_PASSWORD env var is not set.");
    return false;
  }

  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : "";

  return token === adminPassword;
}

/** Convenience: returns a 401 Response if not authorized, else null. */
export function requireAdmin(request) {
  if (!isAdminAuthorized(request)) {
    return Response.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }
  return null;
}
