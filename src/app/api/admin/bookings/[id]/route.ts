import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendBookingApprovedEmail, sendBookingRejectedEmail } from "@/lib/resend";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { action, reason, adminNotes } = await req.json();
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { celebrity: true, payment: true },
  });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  let newStatus = booking.status;
  if (action === "approve") newStatus = "APPROVED";
  if (action === "reject") newStatus = "REJECTED";
  if (action === "complete") newStatus = "COMPLETED";
  if (action === "cancel") newStatus = "CANCELLED";

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: newStatus as any, adminNotes: adminNotes || booking.adminNotes },
  });

  if (action === "approve" && booking.payment) {
    await prisma.payment.update({
      where: { bookingId: booking.id },
      data: { status: "VERIFIED", verifiedAt: new Date(), verifiedBy: session.user.id },
    });
  }

  // Send notification
  await prisma.notification.create({
    data: {
      userId: booking.userId,
      type: `BOOKING_${action.toUpperCase()}D`,
      title: `Booking ${action === "approve" ? "Approved" : action === "reject" ? "Rejected" : "Updated"}`,
      message: `Your booking ${booking.reference} has been ${action}d.${reason ? ` Reason: ${reason}` : ""}`,
      link: `/dashboard/bookings/${booking.id}`,
    },
  });

  // Log admin action
  await prisma.adminLog.create({
    data: {
      adminId: session.user.id,
      action: `BOOKING_${action.toUpperCase()}`,
      target: "Booking",
      targetId: booking.id,
      details: { reference: booking.reference, reason },
    },
  });

  // Send email
  try {
    if (action === "approve") {
      await sendBookingApprovedEmail({
        to: booking.contactEmail || "",
        name: booking.contactName || "Customer",
        reference: booking.reference,
        celebrity: booking.celebrity?.name || "Celebrity",
        eventDate: booking.eventDate.toLocaleString(),
      });
    } else if (action === "reject") {
      await sendBookingRejectedEmail({
        to: booking.contactEmail || "",
        name: booking.contactName || "Customer",
        reference: booking.reference,
        reason,
      });
    }
  } catch (e) { console.error("Email failed:", e); }

  return NextResponse.json({ booking: updated });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      celebrity: true,
      user: true,
      payment: true,
      documents: true,
    },
  });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ booking });
}
