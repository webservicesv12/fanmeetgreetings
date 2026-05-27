"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Search, Star, Edit, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import { formatPrice, CELEB_CATEGORY_LABELS } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminCelebritiesPage() {
  const [celebrities, setCelebrities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/celebrities${search ? `?q=${encodeURIComponent(search)}` : ""}`)
      .then((r) => r.json())
      .then((d) => { setCelebrities(d.celebrities || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search]);

  const handleToggle = async (id: string, field: "featured" | "verified" | "active", current: boolean) => {
    try {
      const res = await fetch(`/api/celebrities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !current }),
      });
      if (!res.ok) throw new Error();
      toast.success("Updated!");
      setCelebrities((prev) => prev.map((c) => c.id === id ? { ...c, [field]: !current } : c));
    } catch { toast.error("Update failed"); }
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
            Celebrity <span className="text-gradient-gold">Management</span>
          </h1>
          <p className="text-[#6B7280] mt-1 text-sm">Add, edit and manage celebrity profiles</p>
        </div>
        <Link href="/admin/celebrities/new" className="btn-gold px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0">
          <Plus size={14} /> Add
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563]" />
        <input
          type="text"
          placeholder="Search celebrities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-luxury w-full max-w-md pl-10 pr-4 py-2.5 text-sm rounded-xl"
        />
      </div>

      {/* ── MOBILE: Cards (visible below md) ──────────────────────────── */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="skeleton h-24 rounded-2xl" />)
        ) : celebrities.length === 0 ? (
          <div className="text-center py-12 text-[#4B5563] text-sm">
            No celebrities found.{" "}
            <Link href="/admin/celebrities/new" className="text-[#D4AF37]">Add one</Link>
          </div>
        ) : (
          celebrities.map((celeb, i) => (
            <motion.div
              key={celeb.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card-luxury p-4"
            >
              {/* Top row */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#7C3AED]/20 flex items-center justify-center shrink-0">
                  <Star size={16} className="text-[#D4AF37]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{celeb.name}</p>
                  <p className="text-[#4B5563] text-xs">{CELEB_CATEGORY_LABELS[celeb.category] || celeb.category}</p>
                </div>
                <span className="text-[#D4AF37] font-bold text-sm shrink-0">{formatPrice(celeb.basePrice)}</span>
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                    <Star size={10} className="text-[#D4AF37] fill-[#D4AF37]" />
                    {celeb.rating} ({celeb.reviewCount})
                  </span>
                  <button onClick={() => handleToggle(celeb.id, "featured", celeb.featured)} className="flex items-center gap-0.5">
                    {celeb.featured
                      ? <ToggleRight size={20} className="text-[#D4AF37]" />
                      : <ToggleLeft size={20} className="text-[#4B5563]" />}
                    <span className={`text-[10px] font-medium ${celeb.featured ? "text-[#D4AF37]" : "text-[#4B5563]"}`}>Featured</span>
                  </button>
                  <button onClick={() => handleToggle(celeb.id, "verified", celeb.verified)} className="flex items-center gap-0.5">
                    {celeb.verified
                      ? <ToggleRight size={20} className="text-green-400" />
                      : <ToggleLeft size={20} className="text-[#4B5563]" />}
                    <span className={`text-[10px] font-medium ${celeb.verified ? "text-green-400" : "text-[#4B5563]"}`}>Verified</span>
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <Link href={`/celebrities/${celeb.slug}`} className="w-7 h-7 glass rounded-lg flex items-center justify-center text-[#6B7280] hover:text-[#D4AF37] transition-colors">
                    <Eye size={13} />
                  </Link>
                  <Link href={`/admin/celebrities/${celeb.id}/edit`} className="w-7 h-7 glass rounded-lg flex items-center justify-center text-[#6B7280] hover:text-blue-400 transition-colors">
                    <Edit size={13} />
                  </Link>
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
                {["Celebrity", "Category", "Base Price", "Rating", "Featured", "Verified", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[#6B7280] text-xs font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8"><div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="skeleton h-10 rounded-lg" />)}</div></td></tr>
              ) : celebrities.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-[#4B5563] text-sm">No celebrities found. <Link href="/admin/celebrities/new" className="text-[#D4AF37]">Add one</Link></td></tr>
              ) : (
                celebrities.map((celeb, i) => (
                  <motion.tr key={celeb.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                    className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#7C3AED]/20 flex items-center justify-center shrink-0">
                          <Star size={16} className="text-[#D4AF37]" />
                        </div>
                        <div>
                          <p className="text-white text-xs font-medium">{celeb.name}</p>
                          <p className="text-[#4B5563] text-[11px]">/{celeb.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#9CA3AF] text-xs">{CELEB_CATEGORY_LABELS[celeb.category] || celeb.category}</td>
                    <td className="px-4 py-3 text-[#D4AF37] font-semibold text-xs">{formatPrice(celeb.basePrice)}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                        <Star size={11} className="text-[#D4AF37] fill-[#D4AF37]" /> {celeb.rating} ({celeb.reviewCount})
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggle(celeb.id, "featured", celeb.featured)} className="transition-colors">
                        {celeb.featured ? <ToggleRight size={22} className="text-[#D4AF37]" /> : <ToggleLeft size={22} className="text-[#4B5563]" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggle(celeb.id, "verified", celeb.verified)} className="transition-colors">
                        {celeb.verified ? <ToggleRight size={22} className="text-green-400" /> : <ToggleLeft size={22} className="text-[#4B5563]" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link href={`/celebrities/${celeb.slug}`} className="w-7 h-7 glass rounded-lg flex items-center justify-center text-[#6B7280] hover:text-[#D4AF37] transition-colors"><Eye size={13} /></Link>
                        <Link href={`/admin/celebrities/${celeb.id}/edit`} className="w-7 h-7 glass rounded-lg flex items-center justify-center text-[#6B7280] hover:text-blue-400 transition-colors"><Edit size={13} /></Link>
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
