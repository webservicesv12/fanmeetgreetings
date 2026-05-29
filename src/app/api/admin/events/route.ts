import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { EventType } from "@prisma/client";

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

  const body = await req.json();
  const {
    title, description, celebrityId, eventType, date, duration,
    location, isOnline, capacity, price, image, active,
  } = body;

  if (!title || !celebrityId || !eventType || !date || !price) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      title,
      description: description || "",
      celebrityId,
      eventType: eventType as EventType,
      date: new Date(date),
      duration: Number(duration) || 60,
      location: location || null,
      isOnline: Boolean(isOnline),
      capacity: Number(capacity) || 1,
      price: Number(price),
      image: image || null,
      active: active !== false,
    },
    include: { celebrity: { select: { id: true, name: true, slug: true } } },
  });

  return NextResponse.json({ event }, { status: 201 });
}
