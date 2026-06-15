import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { EventType } from "@prisma/client";

// Public GET — upcoming events
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventType = searchParams.get("type");
  const celebrityId = searchParams.get("celebrity");

  const events = await prisma.event.findMany({
    where: {
      active: true,
      OR: [
        { date: { gte: new Date() } },
        { date: null }
      ],
      ...(eventType ? { eventType: eventType as EventType } : {}),
      ...(celebrityId ? { celebrityId } : {}),
    },
    include: {
      celebrity: { select: { id: true, name: true, slug: true, image: true, category: true, verified: true } },
    },
    orderBy: { date: "asc" },
  });

  return NextResponse.json({ events });
}
