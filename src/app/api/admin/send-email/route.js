import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { resend, fromEmail } from "@/lib/resend";
import { buildAdminBroadcastEmail } from "@/lib/emails/admin-broadcast";

// ---------------------------------------------------------------------------
// POST /api/admin/send-email
// Send a real email to all candidates registered for an event.
// Requires: Authorization: Bearer <ADMIN_PASSWORD>
// ---------------------------------------------------------------------------
export async function POST(request) {
  // ── Auth gate ─────────────────────────────────────────────────────
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { slug, subject, message } = body;

    // ── Input validation ──────────────────────────────────────────────
    if (!slug?.trim()) {
      return Response.json({ error: "Event slug is required." }, { status: 400 });
    }
    if (!subject?.trim()) {
      return Response.json({ error: "Email subject is required." }, { status: 400 });
    }
    if (!message?.trim()) {
      return Response.json({ error: "Email message body is required." }, { status: 400 });
    }
    if (subject.trim().length > 200) {
      return Response.json({ error: "Subject must be 200 characters or fewer." }, { status: 400 });
    }
    if (message.trim().length > 10000) {
      return Response.json({ error: "Message must be 10,000 characters or fewer." }, { status: 400 });
    }

    // ── Verify event exists ───────────────────────────────────────────
    const { data: event, error: eventError } = await supabaseAdmin
      .from("events")
      .select("id, title, organizer")
      .eq("slug", slug.trim())
      .single();

    if (eventError || !event) {
      return Response.json({ error: "Event not found." }, { status: 404 });
    }

    // ── Fetch candidates ──────────────────────────────────────────────
    const { data: candidates, error: candidatesError } = await supabaseAdmin
      .from("registrations")
      .select("name, email")
      .eq("event_id", event.id)
      .order("created_at", { ascending: true });

    if (candidatesError) {
      console.error("Failed to fetch candidates:", candidatesError);
      return Response.json(
        { error: "Failed to retrieve candidates. Please try again." },
        { status: 500 }
      );
    }

    if (!candidates || candidates.length === 0) {
      return Response.json(
        { error: "No candidates are registered for this event." },
        { status: 400 }
      );
    }

    if (!resend) {
      return Response.json(
        { error: "Email service is not configured." },
        { status: 500 }
      );
    }

    // ── Build the shared email HTML once ─────────────────────────────
    const html = buildAdminBroadcastEmail({
      eventTitle: event.title,
      organizer: event.organizer,
      subject: subject.trim(),
      message: message.trim(),
    });

    // ── Send individually — candidates never see each other's emails ──
    // We intentionally send one email per candidate so each `to:` field
    // contains only that candidate's address.
    let sent = 0;
    let failed = 0;
    const failures = [];

    for (const candidate of candidates) {
      try {
        const { error: sendError } = await resend.emails.send({
          from: fromEmail,
          to: candidate.email,
          subject: subject.trim(),
          html,
        });

        if (sendError) {
          failed++;
          failures.push({ email: candidate.email, reason: sendError.message });
          console.error(`Failed to send to ${candidate.email}:`, sendError);
        } else {
          sent++;
        }
      } catch (err) {
        failed++;
        failures.push({ email: candidate.email, reason: String(err) });
        console.error(`Exception sending to ${candidate.email}:`, err);
      }
    }

    const total = candidates.length;
    const allFailed = sent === 0;
    const partialFailure = failed > 0 && sent > 0;

    return Response.json({
      success: !allFailed,
      total,
      sent,
      failed,
      // Only include failure details server-side (not leaked to candidates)
      ...(failures.length > 0 && { failureDetails: failures }),
      message: allFailed
        ? `Email failed for all ${total} candidates.`
        : partialFailure
          ? `Sent to ${sent} of ${total} candidates. ${failed} failed.`
          : `Email sent successfully to all ${total} candidates.`,
    });
  } catch (err) {
    console.error("Admin send-email error:", err);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
