import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const celebrity = await prisma.celebrity.findUnique({
    where: { slug },
    include: {
      packages: { where: { active: true }, orderBy: { price: "asc" } },
      reviews: {
        where: { approved: true },
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      _count: { select: { reviews: true, bookings: true } },
    },
  });

  if (!celebrity) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ celebrity });
}
