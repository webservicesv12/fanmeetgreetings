import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@meetgreetings.com";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "MeetGreetings";
const FROM = process.env.RESEND_FROM_EMAIL
  ? `${APP_NAME} <${process.env.RESEND_FROM_EMAIL}>`
  : `${APP_NAME} <noreply@meetgreetings.com>`;

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0d0d1a;color:#f8f8f8;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#D4AF37,#F2D060);padding:24px 32px;">
            <h1 style="margin:0;color:#000;font-size:20px;font-weight:800;">${APP_NAME} — Contact Form</h1>
          </div>
          <div style="padding:32px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="color:#9CA3AF;padding:8px 0;width:100px;">Name</td><td style="color:#f8f8f8;font-weight:600;">${name}</td></tr>
              <tr><td style="color:#9CA3AF;padding:8px 0;">Email</td><td style="color:#D4AF37;">${email}</td></tr>
              <tr><td style="color:#9CA3AF;padding:8px 0;">Subject</td><td style="color:#f8f8f8;font-weight:600;">${subject}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;" />
            <p style="color:#9CA3AF;font-size:13px;margin-bottom:8px;">Message:</p>
            <div style="background:#111118;border-radius:8px;padding:16px;color:#C9C9D4;font-size:14px;line-height:1.7;white-space:pre-wrap;">${message}</div>
            <p style="color:#4B5563;font-size:12px;margin-top:24px;">Reply directly to this email to respond to ${name}.</p>
          </div>
        </div>
      `,
    });

    // Auto-reply to sender
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `We received your message — ${APP_NAME}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0d0d1a;color:#f8f8f8;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#D4AF37,#F2D060);padding:24px 32px;">
            <h1 style="margin:0;color:#000;font-size:20px;font-weight:800;">${APP_NAME}</h1>
          </div>
          <div style="padding:32px;">
            <h2 style="color:#D4AF37;margin-top:0;">Thanks for reaching out, ${name}!</h2>
            <p style="color:#C9C9D4;line-height:1.7;">We've received your message and our team will get back to you within 24–48 hours.</p>
            <div style="background:#111118;border-radius:8px;padding:16px;margin:24px 0;">
              <p style="color:#9CA3AF;margin:0 0 4px;font-size:12px;">Your message:</p>
              <p style="color:#C9C9D4;margin:0;font-size:14px;line-height:1.7;white-space:pre-wrap;">${message}</p>
            </div>
            <p style="color:#6B7280;font-size:13px;">— The ${APP_NAME} Team</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ message: "Message sent successfully!" });
  } catch (error: any) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
