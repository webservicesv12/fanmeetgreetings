import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const featured = searchParams.get("featured");
  const celebrities = await prisma.celebrity.findMany({
    where: {
      active: true,
      ...(category && category !== "All" && category !== "" ? { category: category as any } : {}),
      ...(featured === "true" ? { featured: true } : {}),
      ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
    },
    include: { packages: { where: { active: true }, take: 3 }, _count: { select: { reviews: true, bookings: true } } },
    orderBy: { rating: "desc" },
  });
  return NextResponse.json({ celebrities });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const slug = slugify(body.name);
  const celebrity = await prisma.celebrity.create({
    data: { ...body, slug },
  });
  return NextResponse.json({ celebrity }, { status: 201 });
}
