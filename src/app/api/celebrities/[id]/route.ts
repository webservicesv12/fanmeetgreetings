import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const celebrity = await prisma.celebrity.findUnique({
    where: { id: params.id },
    include: { packages: { where: { active: true } }, reviews: { where: { approved: true }, include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } } },
  });
  if (!celebrity) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ celebrity });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const celebrity = await prisma.celebrity.update({ where: { id: params.id }, data: body });
  return NextResponse.json({ celebrity });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await prisma.celebrity.update({ where: { id: params.id }, data: { active: false } });
  return NextResponse.json({ success: true });
}
