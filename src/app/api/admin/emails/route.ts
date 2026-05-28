import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "MeetGreetings";
const FROM = process.env.RESEND_FROM_EMAIL
  ? `${APP_NAME} <${process.env.RESEND_FROM_EMAIL}>`
  : `${APP_NAME} <noreply@meetgreetings.com>`;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { recipientType, singleEmail, subject, message } = await req.json();

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    const htmlBody = `
      <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0d0d1a; color: #f8f8f8; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #D4AF37, #F2D060); padding: 24px 32px;">
          <h1 style="margin: 0; color: #000; font-size: 22px; font-weight: 800;">MeetGreetings</h1>
          <p style="margin: 4px 0 0; color: #111; font-size: 13px; opacity: 0.7;">Premium Celebrity Experiences</p>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #D4AF37; margin-top: 0; font-size: 18px;">${subject}</h2>
          <div style="color: #C9C9D4; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message}</div>
          <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 32px 0;" />
          <p style="color: #4B5563; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} MeetGreetings. All rights reserved.
          </p>
        </div>
      </div>
    `;

    if (recipientType === "single") {
      if (!singleEmail?.trim()) {
        return NextResponse.json({ error: "Recipient email is required" }, { status: 400 });
      }
      await resend.emails.send({
        from: FROM,
        to: [singleEmail.trim()],
        subject,
        html: htmlBody,
      });
      return NextResponse.json({ message: `Email sent to ${singleEmail}` });
    }

    // Send to all users in batches
    const users = await prisma.user.findMany({
      where: { suspended: false },
      select: { email: true, name: true },
    });

    const emails = users
      .map((u) => u.email)
      .filter((e): e is string => !!e);

    if (emails.length === 0) {
      return NextResponse.json({ message: "No active users to send to" });
    }

    // Resend batch limit: 100 per request
    const BATCH_SIZE = 100;
    let sent = 0;
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);
      await resend.emails.send({
        from: FROM,
        to: batch,
        subject,
        html: htmlBody,
      });
      sent += batch.length;
    }

    return NextResponse.json({ message: `Email sent to ${sent} user${sent !== 1 ? "s" : ""}` });
  } catch (error: any) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
