import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

const isAdmin = async () => {
  const session = await auth();
  return session?.user && (session.user as any).role === "ADMIN" ? session : null;
};

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await isAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const event = await prisma.event.update({
    where: { id },
    data: {
      ...body,
      date: body.date ? new Date(body.date) : undefined,
      eventType: body.eventType,
      duration: body.duration ? Number(body.duration) : undefined,
      capacity: body.capacity ? Number(body.capacity) : undefined,
      price: body.price ? Number(body.price) : undefined,
    },
    include: { celebrity: { select: { id: true, name: true, slug: true } } },
  });

  return NextResponse.json({ event });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await isAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
