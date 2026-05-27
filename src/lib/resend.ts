import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL || "noreply@meetgreetings.com";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "MeetGreetings";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ─── Email Templates ─────────────────────────────────────────────────────────

function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${APP_NAME}</title>
</head>
<body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:16px 16px 0 0;padding:32px;text-align:center;border-bottom:1px solid rgba(212,175,55,0.3);">
              <h1 style="margin:0;font-size:28px;font-weight:800;background:linear-gradient(135deg,#D4AF37,#F2D060);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
                ✦ ${APP_NAME}
              </h1>
              <p style="margin:8px 0 0;color:#9CA3AF;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Premium Celebrity Experiences</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background:#111118;padding:40px 32px;border-left:1px solid rgba(255,255,255,0.05);border-right:1px solid rgba(255,255,255,0.05);">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#0a0a0f;border-radius:0 0 16px 16px;padding:24px 32px;text-align:center;border:1px solid rgba(255,255,255,0.05);border-top:none;">
              <p style="margin:0;color:#4B5563;font-size:12px;">
                &copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.<br/>
                <a href="${APP_URL}" style="color:#D4AF37;text-decoration:none;">${APP_URL}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// ─── Send Functions ───────────────────────────────────────────────────────────

export async function sendBookingConfirmationEmail(data: {
  to: string;
  name: string;
  reference: string;
  celebrity: string;
  eventType: string;
  eventDate: string;
  totalAmount: string;
}) {
  const content = `
    <h2 style="color:#F8F8F8;font-size:22px;margin:0 0 8px;">Booking Confirmed! 🎉</h2>
    <p style="color:#9CA3AF;margin:0 0 24px;">Hi ${data.name}, your booking request has been received.</p>
    <div style="background:rgba(212,175,55,0.08);border:1px solid rgba(212,175,55,0.2);border-radius:12px;padding:24px;margin:0 0 24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="color:#9CA3AF;font-size:13px;padding:6px 0;">Reference</td><td style="color:#D4AF37;font-weight:700;text-align:right;">${data.reference}</td></tr>
        <tr><td style="color:#9CA3AF;font-size:13px;padding:6px 0;">Celebrity</td><td style="color:#F8F8F8;text-align:right;">${data.celebrity}</td></tr>
        <tr><td style="color:#9CA3AF;font-size:13px;padding:6px 0;">Event Type</td><td style="color:#F8F8F8;text-align:right;">${data.eventType}</td></tr>
        <tr><td style="color:#9CA3AF;font-size:13px;padding:6px 0;">Date</td><td style="color:#F8F8F8;text-align:right;">${data.eventDate}</td></tr>
        <tr><td colspan="2" style="border-top:1px solid rgba(255,255,255,0.1);padding-top:12px;margin-top:12px;"></td></tr>
        <tr><td style="color:#F8F8F8;font-weight:700;padding:6px 0;">Total Amount</td><td style="color:#D4AF37;font-weight:800;font-size:18px;text-align:right;">${data.totalAmount}</td></tr>
      </table>
    </div>
    <p style="color:#9CA3AF;font-size:14px;line-height:1.6;">
      Please complete your payment to confirm your booking. Once payment is verified by our team, you will receive a booking approval email.
    </p>
    <div style="text-align:center;margin:32px 0 0;">
      <a href="${APP_URL}/dashboard/bookings" style="background:linear-gradient(135deg,#D4AF37,#F2D060);color:#000;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">View My Booking</a>
    </div>
  `;
  return resend.emails.send({
    from: FROM,
    to: data.to,
    subject: `Booking Confirmed — ${data.reference} | ${APP_NAME}`,
    html: baseTemplate(content),
  });
}

export async function sendBookingApprovedEmail(data: {
  to: string;
  name: string;
  reference: string;
  celebrity: string;
  eventDate: string;
}) {
  const content = `
    <h2 style="color:#4ade80;font-size:22px;margin:0 0 8px;">Booking Approved! ✅</h2>
    <p style="color:#9CA3AF;margin:0 0 24px;">Great news, ${data.name}! Your booking has been approved.</p>
    <div style="background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.2);border-radius:12px;padding:24px;margin:0 0 24px;">
      <p style="color:#9CA3AF;margin:0 0 8px;">Reference: <strong style="color:#D4AF37;">${data.reference}</strong></p>
      <p style="color:#9CA3AF;margin:0 0 8px;">Celebrity: <strong style="color:#F8F8F8;">${data.celebrity}</strong></p>
      <p style="color:#9CA3AF;margin:0;">Event Date: <strong style="color:#F8F8F8;">${data.eventDate}</strong></p>
    </div>
    <p style="color:#9CA3AF;font-size:14px;">Your experience is confirmed. Our team will be in touch with additional details closer to the date.</p>
    <div style="text-align:center;margin:32px 0 0;">
      <a href="${APP_URL}/dashboard/bookings" style="background:linear-gradient(135deg,#D4AF37,#F2D060);color:#000;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">View Booking Details</a>
    </div>
  `;
  return resend.emails.send({
    from: FROM,
    to: data.to,
    subject: `Booking Approved — ${data.celebrity} | ${APP_NAME}`,
    html: baseTemplate(content),
  });
}

export async function sendBookingRejectedEmail(data: {
  to: string;
  name: string;
  reference: string;
  reason?: string;
}) {
  const content = `
    <h2 style="color:#f87171;font-size:22px;margin:0 0 8px;">Booking Update</h2>
    <p style="color:#9CA3AF;margin:0 0 24px;">Hi ${data.name}, unfortunately we were unable to process your booking.</p>
    <div style="background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.2);border-radius:12px;padding:24px;margin:0 0 24px;">
      <p style="color:#9CA3AF;margin:0 0 8px;">Reference: <strong style="color:#D4AF37;">${data.reference}</strong></p>
      ${data.reason ? `<p style="color:#9CA3AF;margin:0;">Reason: <strong style="color:#F8F8F8;">${data.reason}</strong></p>` : ""}
    </div>
    <p style="color:#9CA3AF;font-size:14px;">Please contact our support team if you have any questions or would like to make a new booking.</p>
    <div style="text-align:center;margin:32px 0 0;">
      <a href="${APP_URL}/celebrities" style="background:linear-gradient(135deg,#D4AF37,#F2D060);color:#000;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">Browse Celebrities</a>
    </div>
  `;
  return resend.emails.send({
    from: FROM,
    to: data.to,
    subject: `Booking Update — ${data.reference} | ${APP_NAME}`,
    html: baseTemplate(content),
  });
}

export async function sendPaymentReceivedEmail(data: {
  to: string;
  name: string;
  reference: string;
  amount: string;
  method: string;
}) {
  const content = `
    <h2 style="color:#F8F8F8;font-size:22px;margin:0 0 8px;">Payment Received 💳</h2>
    <p style="color:#9CA3AF;margin:0 0 24px;">Hi ${data.name}, we've received your payment proof for booking <strong style="color:#D4AF37;">${data.reference}</strong>.</p>
    <div style="background:rgba(124,58,237,0.08);border:1px solid rgba(124,58,237,0.2);border-radius:12px;padding:24px;margin:0 0 24px;">
      <p style="color:#9CA3AF;margin:0 0 8px;">Amount: <strong style="color:#F8F8F8;">${data.amount}</strong></p>
      <p style="color:#9CA3AF;margin:0;">Method: <strong style="color:#F8F8F8;">${data.method}</strong></p>
    </div>
    <p style="color:#9CA3AF;font-size:14px;">Our team is currently verifying your payment. You will be notified once it's confirmed (usually within 24 hours).</p>
  `;
  return resend.emails.send({
    from: FROM,
    to: data.to,
    subject: `Payment Received — ${data.reference} | ${APP_NAME}`,
    html: baseTemplate(content),
  });
}

export async function sendWelcomeEmail(data: { to: string; name: string }) {
  const content = `
    <h2 style="color:#F8F8F8;font-size:22px;margin:0 0 8px;">Welcome to ${APP_NAME}! ✨</h2>
    <p style="color:#9CA3AF;margin:0 0 24px;">Hi ${data.name}, your account has been created successfully.</p>
    <p style="color:#9CA3AF;font-size:14px;line-height:1.6;">You now have access to exclusive celebrity meet-and-greet experiences, VIP events, and personalized fan experiences.</p>
    <div style="text-align:center;margin:32px 0 0;">
      <a href="${APP_URL}/celebrities" style="background:linear-gradient(135deg,#D4AF37,#F2D060);color:#000;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">Explore Celebrities</a>
    </div>
  `;
  return resend.emails.send({
    from: FROM,
    to: data.to,
    subject: `Welcome to ${APP_NAME}!`,
    html: baseTemplate(content),
  });
}

export async function sendBulkEmail(data: {
  recipients: string[];
  subject: string;
  htmlContent: string;
}) {
  const emails = data.recipients.map((to) => ({
    from: FROM,
    to,
    subject: data.subject,
    html: baseTemplate(data.htmlContent),
  }));

  // Send in batches of 50
  const batches = [];
  for (let i = 0; i < emails.length; i += 50) {
    batches.push(emails.slice(i, i + 50));
  }

  const results = [];
  for (const batch of batches) {
    const result = await resend.batch.send(batch);
    results.push(result);
  }
  return results;
}
