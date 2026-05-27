"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Shield, ShieldOff, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    const url = search ? `/api/admin/users?search=${encodeURIComponent(search)}` : "/api/admin/users";
    fetch(url).then((r) => r.json()).then((d) => { setUsers(d.users || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAction = async (userId: string, action: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      if (!res.ok) throw new Error("Action failed");
      toast.success("User updated successfully");
      fetchUsers();
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
          User <span className="text-gradient-gold">Management</span>
        </h1>
        <p className="text-[#6B7280] mt-1 text-sm">Manage all platform users</p>
      </div>

      <div className="flex gap-2 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563]" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
            className="input-luxury w-full pl-10 pr-4 py-2.5 text-sm rounded-xl"
          />
        </div>
        <button onClick={fetchUsers} className="btn-gold px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0">
          Search
        </button>
      </div>

      {/* ── MOBILE: Cards (visible below md) ──────────────────────────── */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          [1, 2, 3, 4, 5].map((i) => <div key={i} className="skeleton h-20 rounded-2xl" />)
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-[#4B5563] text-sm">No users found</div>
        ) : (
          users.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="card-luxury p-4"
            >
              {/* Top row */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F2D060] flex items-center justify-center text-black text-xs font-bold shrink-0">
                  {user.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{user.name || "Unknown"}</p>
                  <p className="text-[#4B5563] text-xs truncate">{user.email}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full border font-medium shrink-0 ${
                  user.role === "ADMIN"
                    ? "text-[#D4AF37] border-[#D4AF37]/20 bg-[#D4AF37]/10"
                    : "text-[#6B7280] border-white/10 bg-white/5"
                }`}>
                  {user.role}
                </span>
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                  <span className="flex items-center gap-1">
                    <Calendar size={10} /> {formatDate(user.createdAt)}
                  </span>
                  <span>{user._count?.bookings || 0} bookings</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] border ${
                    user.suspended
                      ? "text-red-400 border-red-400/20 bg-red-400/10"
                      : "text-green-400 border-green-400/20 bg-green-400/10"
                  }`}>
                    {user.suspended ? "Suspended" : "Active"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleAction(user.id, user.suspended ? "unsuspend" : "suspend")}
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
                      user.suspended
                        ? "bg-green-400/10 border-green-400/20 text-green-400"
                        : "bg-amber-400/10 border-amber-400/20 text-amber-400"
                    }`}
                    title={user.suspended ? "Unsuspend" : "Suspend"}
                  >
                    {user.suspended ? <Shield size={13} /> : <ShieldOff size={13} />}
                  </button>
                  {user.role !== "ADMIN" && (
                    <button
                      onClick={() => handleAction(user.id, "makeAdmin")}
                      className="w-7 h-7 rounded-lg border border-[#D4AF37]/20 bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] transition-colors"
                      title="Make Admin"
                    >
                      <Shield size={13} />
                    </button>
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
                {["User", "Role", "Bookings", "Joined", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[#6B7280] text-xs font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8"><div className="space-y-3">{[1,2,3,4,5].map((i) => <div key={i} className="skeleton h-8 rounded-lg" />)}</div></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-[#4B5563] text-sm">No users found</td></tr>
              ) : (
                users.map((user, i) => (
                  <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                    className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F2D060] flex items-center justify-center text-black text-xs font-bold shrink-0">
                          {user.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="text-white text-xs font-medium">{user.name || "Unknown"}</p>
                          <p className="text-[#4B5563] text-[11px]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-1 rounded-full border font-medium ${
                        user.role === "ADMIN" ? "text-[#D4AF37] border-[#D4AF37]/20 bg-[#D4AF37]/10" : "text-[#6B7280] border-white/10 bg-white/5"
                      }`}>{user.role}</span>
                    </td>
                    <td className="px-4 py-3 text-[#9CA3AF] text-xs">{user._count?.bookings || 0}</td>
                    <td className="px-4 py-3 text-[#6B7280] text-xs">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-1 rounded-full border font-medium ${
                        user.suspended ? "text-red-400 border-red-400/20 bg-red-400/10" : "text-green-400 border-green-400/20 bg-green-400/10"
                      }`}>{user.suspended ? "Suspended" : "Active"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleAction(user.id, user.suspended ? "unsuspend" : "suspend")}
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs transition-colors ${
                            user.suspended ? "bg-green-400/10 border-green-400/20 text-green-400 hover:bg-green-400/20" : "bg-amber-400/10 border-amber-400/20 text-amber-400 hover:bg-amber-400/20"
                          }`} title={user.suspended ? "Unsuspend" : "Suspend"}>
                          {user.suspended ? <Shield size={13} /> : <ShieldOff size={13} />}
                        </button>
                        {user.role !== "ADMIN" && (
                          <button onClick={() => handleAction(user.id, "makeAdmin")}
                            className="w-7 h-7 rounded-lg border border-[#D4AF37]/20 bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors"
                            title="Make Admin"><Shield size={13} /></button>
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
