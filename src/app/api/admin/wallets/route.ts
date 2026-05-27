import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const wallets = await prisma.cryptoWallet.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ wallets });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const wallet = await prisma.cryptoWallet.create({ data: body });
  return NextResponse.json({ wallet }, { status: 201 });
}
