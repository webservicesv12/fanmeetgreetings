"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, Star, CheckCircle, XCircle, AlertCircle, ArrowRight, Filter } from "lucide-react";
import { formatPrice, formatDate, BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS, EVENT_TYPE_LABELS } from "@/lib/utils";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "PAYMENT_SUBMITTED", label: "Payment Submitted" },
  { value: "APPROVED", label: "Approved" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    const url = statusFilter ? `/api/bookings?status=${statusFilter}` : "/api/bookings";
    fetch(url)
      .then((r) => r.json())
      .then((d) => { setBookings(d.bookings || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [statusFilter]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">My <span className="text-gradient-gold">Bookings</span></h1>
        <p className="text-[#6B7280] mt-1">Track all your celebrity booking requests</p>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUS_FILTERS.map((f) => (
          <button key={f.value} onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              statusFilter === f.value ? "bg-[#D4AF37] text-black" : "btn-glass"
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4].map((i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
      ) : bookings.length === 0 ? (
        <div className="card-luxury p-16 text-center">
          <Calendar size={48} className="text-[#4B5563] mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">No bookings found</h3>
          <p className="text-[#6B7280] text-sm mb-6">You haven&apos;t made any bookings yet</p>
          <Link href="/celebrities" className="btn-gold px-6 py-3 rounded-xl font-semibold">Browse Celebrities</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, i) => (
            <motion.div key={booking.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Link href={`/dashboard/bookings/${booking.id}`} className="card-luxury p-5 block hover:border-[#D4AF37]/30 group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#7C3AED]/20 flex items-center justify-center shrink-0">
                      <Star size={24} className="text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold text-sm">{booking.celebrity?.name || "Celebrity"}</h3>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${BOOKING_STATUS_COLORS[booking.status] || ""}`}>
                          {BOOKING_STATUS_LABELS[booking.status]}
                        </span>
                      </div>
                      <p className="text-[#6B7280] text-xs">{EVENT_TYPE_LABELS[booking.eventType]} · {formatDate(booking.eventDate)}</p>
                      <p className="text-[#4B5563] text-xs mt-0.5">Ref: <span className="font-mono text-[#D4AF37]">{booking.reference}</span></p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[#D4AF37] font-bold text-lg font-display">{formatPrice(booking.totalAmount)}</p>
                    <p className="text-[#4B5563] text-xs">{booking.duration} min</p>
                    <ArrowRight size={16} className="text-[#4B5563] group-hover:text-[#D4AF37] ml-auto mt-2 transition-colors" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
