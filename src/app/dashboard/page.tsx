"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Star, Heart, Bell, ArrowRight, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { formatPrice, formatRelativeTime, BOOKING_STATUS_LABELS } from "@/lib/utils";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((d) => { setBookings(d.bookings || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total Bookings", value: bookings.length, icon: Calendar, color: "text-[#D4AF37]" },
    { label: "Approved", value: bookings.filter((b) => b.status === "APPROVED").length, icon: CheckCircle, color: "text-green-400" },
    { label: "Pending", value: bookings.filter((b) => ["PENDING","AWAITING_PAYMENT","PAYMENT_SUBMITTED"].includes(b.status)).length, icon: AlertCircle, color: "text-amber-400" },
    { label: "Completed", value: bookings.filter((b) => b.status === "COMPLETED").length, icon: Star, color: "text-purple-400" },
  ];

  const STATUS_ICONS: Record<string, any> = {
    APPROVED: CheckCircle,
    REJECTED: XCircle,
    PENDING: Clock,
    COMPLETED: Star,
    CANCELLED: XCircle,
    AWAITING_PAYMENT: AlertCircle,
    PAYMENT_SUBMITTED: AlertCircle,
  };

  return (
    <div className="p-4 md:p-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
          Welcome back, <span className="text-gradient-gold">{session?.user?.name?.split(" ")[0]}</span> ✨
        </h1>
        <p className="text-[#6B7280] mt-1 text-sm">Here&apos;s an overview of your celebrity experiences</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card-luxury p-5">
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className={`text-3xl font-bold font-display ${stat.color}`}>{stat.value}</p>
            <p className="text-[#6B7280] text-xs mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="card-luxury p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white">Recent Bookings</h2>
          <Link href="/dashboard/bookings" className="text-[#D4AF37] text-sm flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map((i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={40} className="text-[#4B5563] mx-auto mb-3" />
            <p className="text-[#6B7280]">No bookings yet</p>
            <Link href="/celebrities" className="btn-gold px-6 py-2.5 rounded-xl text-sm font-semibold inline-block mt-4">
              Browse Celebrities
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking) => {
              const StatusIcon = (STATUS_ICONS as Record<string, any>)[booking.status as string] || Clock;
              const statusClass = ({
                APPROVED: "text-green-400",
                REJECTED: "text-red-400",
                COMPLETED: "text-purple-400",
                PENDING: "text-amber-400",
                PAYMENT_SUBMITTED: "text-blue-400",
                CANCELLED: "text-gray-400",
              } as Record<string, string>)[booking.status as string] || "text-[#6B7280]";
              return (
                <Link key={booking.id} href={`/dashboard/bookings/${booking.id}`}
                  className="flex items-center justify-between p-3 md:p-4 glass rounded-xl hover:border-[#D4AF37]/20 transition-all group gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#7C3AED]/20 flex items-center justify-center shrink-0">
                      <Star size={16} className="text-[#D4AF37]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{booking.celebrity?.name || "Celebrity"}</p>
                      <p className="text-[#6B7280] text-xs">{formatRelativeTime(booking.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-3 shrink-0">
                    <span className="text-[#D4AF37] font-semibold text-sm">{formatPrice(booking.totalAmount)}</span>
                    <span className={`flex items-center gap-1 text-xs font-medium ${statusClass}`}>
                      <StatusIcon size={12} />
                      <span className="hidden sm:inline">{BOOKING_STATUS_LABELS[booking.status]}</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {[
          { href: "/celebrities", label: "Browse Celebrities", desc: "Find your next experience", icon: Star, color: "text-[#D4AF37]" },
          { href: "/dashboard/favorites", label: "My Favorites", desc: "View saved celebrities", icon: Heart, color: "text-red-400" },
          { href: "/dashboard/profile", label: "Edit Profile", desc: "Update your information", icon: Bell, color: "text-purple-400" },
        ].map((item) => (
          <Link key={item.href} href={item.href}
            className="card-luxury p-5 flex items-center gap-4 group">
            <div className="w-10 h-10 glass rounded-xl flex items-center justify-center">
              <item.icon size={18} className={item.color} />
            </div>
            <div>
              <p className="text-white text-sm font-medium group-hover:text-[#D4AF37] transition-colors">{item.label}</p>
              <p className="text-[#6B7280] text-xs">{item.desc}</p>
            </div>
            <ArrowRight size={16} className="text-[#4B5563] ml-auto group-hover:text-[#D4AF37] transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
