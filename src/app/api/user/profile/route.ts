import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, phone } = await req.json();
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { name, phone },
  });
  return NextResponse.json({ user });
}
