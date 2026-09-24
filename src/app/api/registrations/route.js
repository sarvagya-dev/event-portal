import { supabaseAdmin } from "@/lib/supabase-admin";
import { resend, fromEmail } from "@/lib/resend";
import { buildConfirmationEmail } from "@/lib/emails/registration-confirmation";

// ---------------------------------------------------------------------------
// GET /api/registrations — placeholder (to be expanded in admin phase)
// ---------------------------------------------------------------------------
export async function GET() {
  return Response.json({ message: "Registrations API — not yet implemented" });
}

// ---------------------------------------------------------------------------
// POST /api/registrations — register a candidate for an event
// ---------------------------------------------------------------------------
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      slug,
      name,
      email,
      phone,
      college,
      year,
      branch,
      linkedin,
      github,
    } = body;

    // ── Required-field validation ──────────────────────────────────────
    const missing = [];
    if (!name?.trim()) missing.push("Full Name");
    if (!email?.trim()) missing.push("Email");
    if (!phone?.trim()) missing.push("Phone");
    if (!college?.trim()) missing.push("College / University");
    if (!year?.trim()) missing.push("Year of Study");
    if (!branch?.trim()) missing.push("Branch / Specialization");

    if (!slug) {
      return Response.json(
        { error: "Event identifier is missing." },
        { status: 400 }
      );
    }

    if (missing.length > 0) {
      return Response.json(
        {
          error: `Please fill in the following required fields: ${missing.join(", ")}.`,
        },
        { status: 400 }
      );
    }

    // ── Format validation ─────────────────────────────────────────────
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return Response.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Accept 7–15 digits with optional leading +, spaces, or hyphens
    const normalizedPhone = phone.trim().replace(/[\s\-()]/g, "");
    const phoneRegex = /^\+?\d{7,15}$/;
    if (!phoneRegex.test(normalizedPhone)) {
      return Response.json(
        { error: "Please enter a valid phone number (7–15 digits)." },
        { status: 400 }
      );
    }

    // LinkedIn URL (optional)
    if (linkedin?.trim()) {
      try {
        const url = new URL(linkedin.trim());
        if (!url.hostname.endsWith("linkedin.com")) {
          throw new Error();
        }
      } catch {
        return Response.json(
          { error: "Please enter a valid LinkedIn URL (e.g. https://linkedin.com/in/yourname)." },
          { status: 400 }
        );
      }
    }

    // GitHub URL (optional)
    if (github?.trim()) {
      try {
        const url = new URL(github.trim());
        if (!url.hostname.endsWith("github.com")) {
          throw new Error();
        }
      } catch {
        return Response.json(
          { error: "Please enter a valid GitHub URL (e.g. https://github.com/yourname)." },
          { status: 400 }
        );
      }
    }

    // ── Verify event exists (include fields needed for email) ─────────
    const { data: event, error: eventError } = await supabaseAdmin
      .from("events")
      .select("id, title, date, time, mode, venue, organizer, registration_deadline")
      .eq("slug", slug)
      .single();

    if (eventError || !event) {
      return Response.json(
        { error: "The event you're trying to register for does not exist." },
        { status: 404 }
      );
    }

    // ── Check registration deadline ───────────────────────────────────
    if (new Date(event.registration_deadline) < new Date()) {
      return Response.json(
        { error: "Registration for this event has closed." },
        { status: 400 }
      );
    }

    // ── Check for duplicate registration ──────────────────────────────
    const trimmedEmail = email.trim().toLowerCase();

    const { data: existing } = await supabaseAdmin
      .from("registrations")
      .select("id")
      .eq("event_id", event.id)
      .eq("email", trimmedEmail)
      .maybeSingle();

    if (existing) {
      return Response.json(
        { error: "You're already registered for this event." },
        { status: 409 }
      );
    }

    // ── Insert registration ───────────────────────────────────────────
    const { error: insertError } = await supabaseAdmin
      .from("registrations")
      .insert({
        event_id: event.id,
        name: name.trim(),
        email: trimmedEmail,
        phone: normalizedPhone,
        college: college.trim(),
        year: year.trim(),
        branch: branch.trim(),
        linkedin: linkedin?.trim() || null,
        github: github?.trim() || null,
      });

    if (insertError) {
      // Unique-constraint violation (belt-and-suspenders with the check above)
      if (insertError.code === "23505") {
        return Response.json(
          { error: "You're already registered for this event." },
          { status: 409 }
        );
      }
      console.error("Registration insert error:", insertError);
      return Response.json(
        { error: "Something went wrong while saving your registration. Please try again." },
        { status: 500 }
      );
    }

    // ── Send confirmation email (only after successful insert) ────────
    let emailSent = false;

    if (resend) {
      try {
        const eventDate = new Date(event.date).toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        const html = buildConfirmationEmail({
          candidateName: name.trim(),
          eventTitle: event.title,
          eventDate,
          eventTime: event.time || null,
          mode: event.mode,
          venue: event.venue,
          organizer: event.organizer,
        });

        const { error: emailError } = await resend.emails.send({
          from: fromEmail,
          to: trimmedEmail,
          subject: `Registration Confirmed — ${event.title}`,
          html,
        });

        if (emailError) {
          console.error("Resend email error:", emailError);
        } else {
          emailSent = true;
        }
      } catch (emailErr) {
        console.error("Failed to send confirmation email:", emailErr);
      }
    }

    return Response.json({
      success: true,
      message: "Registration successful!",
      eventTitle: event.title,
      emailSent,
    });
  } catch (err) {
    console.error("Registrations API error:", err);
    return Response.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
