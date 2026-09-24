/**
 * Builds the HTML for an admin broadcast email to event candidates.
 *
 * @param {object} opts
 * @param {string} opts.eventTitle
 * @param {string} opts.organizer
 * @param {string} opts.subject   — admin-written subject (used in body header)
 * @param {string} opts.message   — admin-written message body (plain text, line-breaks respected)
 */
export function buildAdminBroadcastEmail({ eventTitle, organizer, subject, message }) {
  // Convert newlines to <br> for HTML display, escape everything else
  const messageHtml = escapeHtml(message).replace(/\n/g, "<br />");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
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

          <!-- Event context bar -->
          <tr>
            <td style="background-color:#fafafa;padding:12px 32px;border-bottom:1px solid #eeeeee;">
              <p style="margin:0;font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">
                Message regarding
              </p>
              <p style="margin:4px 0 0;font-size:14px;font-weight:600;color:#333333;">
                ${escapeHtml(eventTitle)}
              </p>
              <p style="margin:2px 0 0;font-size:12px;color:#aaaaaa;">
                Organised by ${escapeHtml(organizer)}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 20px;font-size:16px;font-weight:600;color:#111111;line-height:1.4;">
                ${escapeHtml(subject)}
              </p>
              <p style="margin:0 0 4px;font-size:14px;line-height:1.7;color:#444444;">
                ${messageHtml}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #eeeeee;">
              <p style="margin:0;font-size:12px;color:#aaaaaa;line-height:1.5;">
                You received this email because you are registered for ${escapeHtml(eventTitle)} on Event Portal.
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

/** Basic HTML entity escaping. */
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
