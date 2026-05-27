"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { formatPrice, formatRelativeTime, BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from "@/lib/utils";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    pendingApproval: 0,
    recentBookings: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const KPI_CARDS = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-400", bg: "from-blue-400/10 to-transparent", change: "+12%" },
    { label: "Total Bookings", value: stats.totalBookings, icon: Calendar, color: "text-[#D4AF37]", bg: "from-[#D4AF37]/10 to-transparent", change: "+8%" },
    { label: "Total Revenue", value: formatPrice(stats.totalRevenue), icon: DollarSign, color: "text-green-400", bg: "from-green-400/10 to-transparent", change: "+23%" },
    { label: "Pending Payments", value: stats.pendingPayments, icon: AlertCircle, color: "text-amber-400", bg: "from-amber-400/10 to-transparent", urgent: stats.pendingPayments > 0 },
  ];

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
          Admin <span className="text-gradient-gold">Dashboard</span>
        </h1>
        <p className="text-[#6B7280] mt-1 text-sm">Overview of platform activity and performance</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {KPI_CARDS.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`card-luxury p-5 relative overflow-hidden ${card.urgent ? "border-amber-400/30" : ""}`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${card.bg} opacity-50`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${card.bg}`}>
                  <card.icon size={20} className={card.color} />
                </div>
                {card.change && (
                  <span className="text-green-400 text-xs font-semibold flex items-center gap-0.5">
                    <ArrowUpRight size={12} /> {card.change}
                  </span>
                )}
              </div>
              <p className={`text-2xl font-bold font-display ${card.color}`}>{card.value}</p>
              <p className="text-[#6B7280] text-xs mt-1">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Recent Bookings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-luxury p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-[#D4AF37] text-xs flex items-center gap-1">View All <ArrowRight size={12} /></Link>
          </div>

          {loading ? (
            <div className="space-y-3">{[1,2,3,4].map((i) => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
          ) : stats.recentBookings.length === 0 ? (
            <div className="text-center py-8 text-[#4B5563]">
              <Calendar size={32} className="mx-auto mb-2" />
              <p className="text-sm">No bookings yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.recentBookings.slice(0, 6).map((booking: any) => (
                <Link key={booking.id} href={`/admin/bookings/${booking.id}`}
                  className="flex items-center justify-between p-3 glass rounded-xl hover:border-[#D4AF37]/20 transition-all group">
                  <div>
                    <p className="text-white text-xs font-medium">{booking.celebrity?.name || "Unknown"}</p>
                    <p className="text-[#4B5563] text-[11px] font-mono">{booking.reference}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#D4AF37] text-xs font-semibold">{formatPrice(booking.totalAmount)}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${BOOKING_STATUS_COLORS[booking.status] || ""}`}>
                      {BOOKING_STATUS_LABELS[booking.status]}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-luxury p-6">
          <h2 className="font-semibold text-white mb-5">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { href: "/admin/bookings?status=PAYMENT_SUBMITTED", label: "Review Pending Payments", desc: "Verify submitted payment proofs", icon: AlertCircle, badge: stats.pendingPayments, color: "text-amber-400" },
              { href: "/admin/celebrities/new", label: "Add New Celebrity", desc: "Create a new celebrity profile", icon: Star, color: "text-[#D4AF37]" },
              { href: "/admin/emails", label: "Send Bulk Email", desc: "Email all users or newsletter subscribers", icon: AlertCircle, color: "text-purple-400" },
              { href: "/admin/payments", label: "Manage Wallets", desc: "Update crypto wallet addresses", icon: DollarSign, color: "text-green-400" },
            ].map((action) => (
              <Link key={action.href} href={action.href}
                className="flex items-center gap-4 p-4 glass rounded-xl hover:border-[#D4AF37]/20 transition-all group">
                <div className="w-9 h-9 glass rounded-xl flex items-center justify-center shrink-0">
                  <action.icon size={17} className={action.color} />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium group-hover:text-[#D4AF37] transition-colors">{action.label}</p>
                  <p className="text-[#4B5563] text-xs">{action.desc}</p>
                </div>
                {action.badge ? (
                  <span className="w-6 h-6 bg-amber-400 text-black text-xs font-bold rounded-full flex items-center justify-center">{action.badge}</span>
                ) : (
                  <ArrowRight size={16} className="text-[#4B5563] group-hover:text-[#D4AF37] transition-colors" />
                )}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Pending Approvals Alert */}
      {stats.pendingApproval > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-gold rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-[#D4AF37] shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm">
                {stats.pendingApproval} booking{stats.pendingApproval > 1 ? "s" : ""} awaiting approval
              </p>
              <p className="text-[#9CA3AF] text-xs">Review and approve or reject these bookings</p>
            </div>
          </div>
          <Link href="/admin/bookings?status=PAYMENT_SUBMITTED" className="btn-gold px-4 py-2 rounded-xl text-sm font-semibold w-full sm:w-auto text-center">
            Review Now
          </Link>
        </motion.div>
      )}
    </div>
  );
}
