import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const users = await prisma.user.findMany({
    where: search ? {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    } : undefined,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, suspended: true, createdAt: true, _count: { select: { bookings: true } } },
  });
  return NextResponse.json({ users });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { userId, action } = await req.json();
  let update: any = {};
  if (action === "suspend") update.suspended = true;
  if (action === "unsuspend") update.suspended = false;
  if (action === "makeAdmin") update.role = "ADMIN";
  if (action === "removeAdmin") update.role = "USER";
  const user = await prisma.user.update({ where: { id: userId }, data: update });
  await prisma.adminLog.create({
    data: { adminId: session.user.id, action: `USER_${action.toUpperCase()}`, target: "User", targetId: userId },
  });
  return NextResponse.json({ user });
}
