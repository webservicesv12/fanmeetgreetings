"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, CheckCircle, XCircle, Eye } from "lucide-react";
import { formatPrice, formatDate, BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS, EVENT_TYPE_LABELS } from "@/lib/utils";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "PAYMENT_SUBMITTED", label: "Awaiting" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function AdminBookingsPage() {
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchBookings = () => {
    setLoading(true);
    const url = `/api/admin/bookings${statusFilter ? `?status=${statusFilter}` : ""}`;
    fetch(url).then((r) => r.json()).then((d) => { setBookings(d.bookings || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, [statusFilter]);

  const handleAction = async (bookingId: string, action: "approve" | "reject") => {
    setActionLoading(bookingId);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Booking ${action}d!`);
      fetchBookings();
    } catch { toast.error("Action failed"); }
    finally { setActionLoading(null); }
  };

  const filtered = bookings.filter((b) =>
    !search ||
    b.reference?.toLowerCase().includes(search.toLowerCase()) ||
    b.celebrity?.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.contactName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
          Booking <span className="text-gradient-gold">Management</span>
        </h1>
        <p className="text-[#6B7280] mt-1 text-sm">Review, approve, and manage all platform bookings</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563]" />
          <input
            type="text"
            placeholder="Search by reference, celebrity, or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-luxury w-full pl-10 pr-4 py-2.5 text-sm rounded-xl"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                statusFilter === f.value ? "bg-[#D4AF37] text-black" : "btn-glass"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MOBILE: Cards (visible below md) ──────────────────────────── */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          [1, 2, 3, 4, 5].map((i) => <div key={i} className="skeleton h-28 rounded-2xl" />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-[#4B5563] text-sm">No bookings found</div>
        ) : (
          filtered.map((booking, i) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card-luxury p-4"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <p className="text-[#D4AF37] font-mono text-[11px] mb-0.5">{booking.reference}</p>
                  <p className="text-white text-sm font-semibold truncate">{booking.celebrity?.name || "—"}</p>
                  <p className="text-[#6B7280] text-xs truncate">{booking.contactName}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[#D4AF37] font-bold text-sm">{formatPrice(booking.totalAmount)}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${BOOKING_STATUS_COLORS[booking.status] || ""}`}>
                    {BOOKING_STATUS_LABELS[booking.status]}
                  </span>
                </div>
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <span>{EVENT_TYPE_LABELS[booking.eventType]}</span>
                  <span>·</span>
                  <span>{formatDate(booking.eventDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/bookings/${booking.id}`}
                    className="w-7 h-7 glass rounded-lg flex items-center justify-center text-[#6B7280] hover:text-[#D4AF37] transition-colors"
                  >
                    <Eye size={13} />
                  </Link>
                  {booking.status === "PAYMENT_SUBMITTED" && (
                    <>
                      <button
                        onClick={() => handleAction(booking.id, "approve")}
                        disabled={actionLoading === booking.id}
                        className="w-7 h-7 bg-green-400/10 border border-green-400/20 rounded-lg flex items-center justify-center text-green-400 disabled:opacity-50"
                      >
                        {actionLoading === booking.id
                          ? <div className="w-3 h-3 border border-green-400/30 border-t-green-400 rounded-full animate-spin" />
                          : <CheckCircle size={13} />}
                      </button>
                      <button
                        onClick={() => handleAction(booking.id, "reject")}
                        disabled={actionLoading === booking.id}
                        className="w-7 h-7 bg-red-400/10 border border-red-400/20 rounded-lg flex items-center justify-center text-red-400 disabled:opacity-50"
                      >
                        <XCircle size={13} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* ── DESKTOP: Table (hidden below md) ──────────────────────────── */}
      <div className="hidden md:block card-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {["Reference", "Celebrity", "Customer", "Type", "Date", "Amount", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[#6B7280] text-xs font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-8"><div className="space-y-3">{[1,2,3,4,5].map((i) => <div key={i} className="skeleton h-8 rounded-lg" />)}</div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-[#4B5563] text-sm">No bookings found</td></tr>
              ) : (
                filtered.map((booking, i) => (
                  <motion.tr key={booking.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                    className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3"><span className="text-[#D4AF37] font-mono text-xs">{booking.reference}</span></td>
                    <td className="px-4 py-3 text-white text-xs">{booking.celebrity?.name || "—"}</td>
                    <td className="px-4 py-3"><p className="text-white text-xs">{booking.contactName}</p><p className="text-[#4B5563] text-[11px]">{booking.contactEmail}</p></td>
                    <td className="px-4 py-3 text-[#9CA3AF] text-xs">{EVENT_TYPE_LABELS[booking.eventType]}</td>
                    <td className="px-4 py-3 text-[#9CA3AF] text-xs">{formatDate(booking.eventDate)}</td>
                    <td className="px-4 py-3 text-[#D4AF37] font-semibold text-xs">{formatPrice(booking.totalAmount)}</td>
                    <td className="px-4 py-3"><span className={`text-[10px] px-2 py-1 rounded-full border font-medium ${BOOKING_STATUS_COLORS[booking.status] || ""}`}>{BOOKING_STATUS_LABELS[booking.status]}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/bookings/${booking.id}`} className="w-7 h-7 glass rounded-lg flex items-center justify-center text-[#6B7280] hover:text-[#D4AF37] transition-colors"><Eye size={13} /></Link>
                        {booking.status === "PAYMENT_SUBMITTED" && (
                          <>
                            <button onClick={() => handleAction(booking.id, "approve")} disabled={actionLoading === booking.id}
                              className="w-7 h-7 bg-green-400/10 border border-green-400/20 rounded-lg flex items-center justify-center text-green-400 hover:bg-green-400/20 transition-colors disabled:opacity-50">
                              {actionLoading === booking.id ? <div className="w-3 h-3 border border-green-400/30 border-t-green-400 rounded-full animate-spin" /> : <CheckCircle size={13} />}
                            </button>
                            <button onClick={() => handleAction(booking.id, "reject")} disabled={actionLoading === booking.id}
                              className="w-7 h-7 bg-red-400/10 border border-red-400/20 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-400/20 transition-colors disabled:opacity-50"><XCircle size={13} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
