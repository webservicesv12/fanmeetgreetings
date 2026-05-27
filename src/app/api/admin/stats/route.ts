import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [totalUsers, totalBookings, revenueAgg, pendingPayments, pendingApproval, recentBookings] = await Promise.all([
      prisma.user.count({ where: { role: "USER" } }),
      prisma.booking.count(),
      prisma.payment.aggregate({ where: { status: "VERIFIED" }, _sum: { amount: true } }),
      prisma.payment.count({ where: { status: "SUBMITTED" } }),
      prisma.booking.count({ where: { status: "PAYMENT_SUBMITTED" } }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          celebrity: { select: { name: true } },
          user: { select: { name: true, email: true } },
        },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalBookings,
      totalRevenue: revenueAgg._sum.amount || 0,
      pendingPayments,
      pendingApproval,
      recentBookings,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
