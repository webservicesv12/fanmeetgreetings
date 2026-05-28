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
  const bank = await prisma.bankAccount.update({ where: { id }, data: body });
  return NextResponse.json({ bank });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await isAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await prisma.bankAccount.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
