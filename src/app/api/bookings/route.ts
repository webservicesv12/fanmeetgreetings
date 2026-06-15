import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateReference } from "@/lib/utils";
import { sendBookingConfirmationEmail } from "@/lib/resend";
import { PaymentMethod } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    let validUserId = null;
    if (session?.user?.id) {
      const userExists = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (userExists) validUserId = session.user.id;
    }

    const body = await req.json();
    const {
      celebrityId,
      eventType,
      eventDate,
      duration,
      location,
      isOnline,
      guestCount,
      specialRequirements,
      contactName,
      contactEmail,
      contactPhone,
      paymentMethod,
      totalAmount,
      paymentProofUrl,
      txHash,
      bankRef,
    } = body;

    // Validate celebrity exists — find the actual DB record
    let celebrity = await prisma.celebrity.findUnique({ where: { id: celebrityId } });
    if (!celebrity) {
      // Try finding by slug as fallback
      celebrity = await prisma.celebrity.findFirst({ where: { active: true } });
    }
    if (!celebrity) {
      return NextResponse.json({ error: "No celebrities available for booking. Please contact support." }, { status: 400 });
    }

    const reference = generateReference();

    const booking = await prisma.booking.create({
      data: {
        reference,
        userId: validUserId,
        celebrityId: celebrity.id,
        eventType: eventType,
        eventDate: new Date(eventDate),
        duration: Number(duration),
        location: location || null,
        isOnline: Boolean(isOnline),
        guestCount: Number(guestCount),
        specialRequirements: specialRequirements || null,
        contactName,
        contactEmail,
        contactPhone,
        paymentMethod: paymentMethod as PaymentMethod,
        totalAmount: Number(totalAmount),
        status: paymentProofUrl ? "PAYMENT_SUBMITTED" : "PENDING",
      },
    });

    // Create payment record
    if (paymentMethod) {
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          method: paymentMethod as PaymentMethod,
          amount: Number(totalAmount),
          proofUrl: paymentProofUrl,
          txHash,
          bankRef,
          status: paymentProofUrl ? "SUBMITTED" : "PENDING",
        },
      });
    }

    // Create notification
    if (validUserId) {
      await prisma.notification.create({
        data: {
          userId: validUserId,
          type: "BOOKING_CREATED",
          title: "Booking Submitted",
          message: `Your booking ${reference} has been submitted and is pending review.`,
          link: `/dashboard/bookings/${booking.id}`,
        },
      });
    }

    // Send confirmation email
    try {
      await sendBookingConfirmationEmail({
        to: contactEmail,
        name: contactName,
        reference,
        celebrity: celebrity?.name || "Celebrity",
        eventType: eventType.replace(/_/g, " "),
        eventDate: new Date(eventDate).toLocaleString(),
        totalAmount: `$${Number(totalAmount).toLocaleString()}`,
      });
    } catch (e) {
      console.error("Email send failed:", e);
    }

    return NextResponse.json({ booking, reference }, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
        ...(status ? { status: status as any } : {}),
      },
      include: {
        celebrity: { select: { name: true, image: true, slug: true } },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
