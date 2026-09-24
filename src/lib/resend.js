import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.warn(
    "RESEND_API_KEY is not set. Confirmation emails will be skipped."
  );
}

// Server-only Resend client.
// NEVER import this file from client components.
export const resend = apiKey ? new Resend(apiKey) : null;

export const fromEmail =
  process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
