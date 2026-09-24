/**
 * Builds the HTML for a registration confirmation email.
 *
 * @param {object} opts
 * @param {string} opts.candidateName
 * @param {string} opts.eventTitle
 * @param {string} opts.eventDate     — pre-formatted date string
 * @param {string} opts.eventTime     — e.g. "10:00" or null
 * @param {string} opts.mode          — "online" | "offline" | "hybrid"
 * @param {string|null} opts.venue
 * @param {string} opts.organizer
 * @returns {string} HTML string
 */
export function buildConfirmationEmail({
  candidateName,
  eventTitle,
  eventDate,
  eventTime,
  mode,
  venue,
  organizer,
}) {
  const locationText =
    mode === "online"
      ? "Online"
      : mode === "hybrid"
        ? `Hybrid — ${venue || "Venue TBA"}`
        : venue || "Venue TBA";

  const timeText = eventTime
    ? `${eventDate} at ${eventTime}`
    : eventDate;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Registration Confirmed</title>
</head>
<body style="margin:0;padding:0;background-color:#f6f6f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#1a1a1a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f6f6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:12px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color:#171717;padding:28px 32px;">
              <h1 style="margin:0;font-size:18px;font-weight:600;color:#ffffff;letter-spacing:-0.3px;">
                Event Portal
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#333333;">
                Hi ${escapeHtml(candidateName)},
              </p>

              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#333333;">
                Your registration for <strong>${escapeHtml(eventTitle)}</strong> has been confirmed.
              </p>

              <!-- Event details card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa;border:1px solid #e5e5e5;border-radius:8px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:0 0 12px;font-size:13px;color:#888888;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">
                          Event Details
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:14px;">
                          <strong style="display:inline-block;width:90px;color:#666666;">Event</strong>
                          ${escapeHtml(eventTitle)}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:14px;">
                          <strong style="display:inline-block;width:90px;color:#666666;">When</strong>
                          ${escapeHtml(timeText)}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:14px;">
                          <strong style="display:inline-block;width:90px;color:#666666;">Where</strong>
                          ${escapeHtml(locationText)}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:14px;">
                          <strong style="display:inline-block;width:90px;color:#666666;">Organizer</strong>
                          ${escapeHtml(organizer)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 4px;font-size:14px;line-height:1.6;color:#555555;">
                No further action is required. We look forward to seeing you there!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #eeeeee;">
              <p style="margin:0;font-size:12px;color:#aaaaaa;line-height:1.5;">
                You received this email because you registered on Event Portal.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

/** Basic HTML entity escaping to prevent injection in email content. */
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
