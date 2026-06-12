import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

const isAdmin = async () => {
  const session = await auth();
  return session?.user && (session.user as any).role === "ADMIN" ? session : null;
};

export async function GET() {
  const session = await isAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const events = await prisma.event.findMany({
    include: { celebrity: { select: { id: true, name: true, slug: true } } },
    orderBy: { date: "asc" },
  });

  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  const session = await isAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const {
      title, description, celebrityId, eventType, date, duration,
      location, isOnline, capacity, price, image, active, isTimedEvent,
    } = body;

    // Validate required fields with specific messages
    if (!title?.trim())       return NextResponse.json({ error: "Event title is required" }, { status: 400 });
    if (!celebrityId)         return NextResponse.json({ error: "Please select a celebrity" }, { status: 400 });
    if (!eventType)           return NextResponse.json({ error: "Please select an experience type" }, { status: 400 });
    if (!price && price !== 0) return NextResponse.json({ error: "Price is required" }, { status: 400 });

    // Date is only required for non-timed events
    let parsedDate: Date | undefined = undefined;
    if (date) {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
      }
      parsedDate = d;
    } else if (!isTimedEvent) {
      return NextResponse.json({ error: "Date & time is required for this experience type" }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        description: description?.trim() || "",
        celebrityId,
        eventType,
        // Spread date only when defined — timed events have no scheduled date
        ...(parsedDate ? { date: parsedDate } : {}),
        isTimedEvent: Boolean(isTimedEvent),
        duration: Number(duration) || 60,
        location: location?.trim() || null,
        isOnline: Boolean(isOnline),
        capacity: Number(capacity) || 1,
        price: Number(price),
        image: image?.trim() || null,
        active: active !== false,
      } as any,
      include: { celebrity: { select: { id: true, name: true, slug: true } } },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (err: any) {
    console.error("Event create error:", err);
    return NextResponse.json({ error: err.message || "Failed to create event" }, { status: 500 });
  }
}
