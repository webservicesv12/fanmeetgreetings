"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, ShieldOff, Calendar, Edit2, X, Mail, Phone, BookOpen, UserCheck, UserX } from "lucide-react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    const url = search ? `/api/admin/users?search=${encodeURIComponent(search)}` : "/api/admin/users";
    fetch(url).then((r) => r.json()).then((d) => { setUsers(d.users || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAction = async (userId: string, action: string) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      if (!res.ok) throw new Error("Action failed");
      toast.success("User updated successfully");
      fetchUsers();
      // Update editUser state too
      if (editUser?.id === userId) {
        const updated = await fetch(`/api/admin/users?search=${encodeURIComponent(editUser.email)}`).then(r => r.json());
        const found = updated.users?.find((u: any) => u.id === userId);
        if (found) setEditUser(found);
      }
    } catch {
      toast.error("Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const UserCard = ({ user, i }: { user: any; i: number }) => (
    <motion.div
      key={user.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.03 }}
      className="card-luxury p-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F2D060] flex items-center justify-center text-black text-xs font-bold shrink-0">
          {user.name?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">{user.name || "Unknown"}</p>
          <p className="text-[#4B5563] text-xs truncate">{user.email}</p>
        </div>
        <span className={`text-[10px] px-2 py-1 rounded-full border font-medium shrink-0 ${
          user.role === "ADMIN" ? "text-[#D4AF37] border-[#D4AF37]/20 bg-[#D4AF37]/10" : "text-[#6B7280] border-white/10 bg-white/5"
        }`}>{user.role}</span>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-3 text-xs text-[#6B7280]">
          <span className="flex items-center gap-1"><Calendar size={10} /> {formatDate(user.createdAt)}</span>
          <span>{user._count?.bookings || 0} bookings</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] border ${
            user.suspended ? "text-red-400 border-red-400/20 bg-red-400/10" : "text-green-400 border-green-400/20 bg-green-400/10"
          }`}>{user.suspended ? "Suspended" : "Active"}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setEditUser(user)}
            className="w-7 h-7 rounded-lg border border-blue-400/20 bg-blue-400/10 flex items-center justify-center text-blue-400 hover:bg-blue-400/20 transition-colors"
            title="Edit User">
            <Edit2 size={13} />
          </button>
          <button onClick={() => handleAction(user.id, user.suspended ? "unsuspend" : "suspend")}
            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
              user.suspended ? "bg-green-400/10 border-green-400/20 text-green-400" : "bg-amber-400/10 border-amber-400/20 text-amber-400"
            }`} title={user.suspended ? "Unsuspend" : "Suspend"}>
            {user.suspended ? <Shield size={13} /> : <ShieldOff size={13} />}
          </button>
        </div>
      </div>
    </motion.div>
  );

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
          <input type="text" placeholder="Search users by name or email..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
            className="input-luxury w-full pl-10 pr-4 py-2.5 text-sm rounded-xl" />
        </div>
        <button onClick={fetchUsers} className="btn-gold px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0">Search</button>
      </div>

      {/* MOBILE: Cards */}
      <div className="block md:hidden space-y-3">
        {loading ? [1,2,3,4,5].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />) :
          users.length === 0 ? <div className="text-center py-12 text-[#4B5563] text-sm">No users found</div> :
          users.map((user, i) => <UserCard key={user.id} user={user} i={i} />)}
      </div>

      {/* DESKTOP: Table */}
      <div className="hidden md:block card-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {["User", "Role", "Bookings", "Joined", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[#6B7280] text-xs font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8"><div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="skeleton h-8 rounded-lg" />)}</div></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-[#4B5563] text-sm">No users found</td></tr>
              ) : users.map((user, i) => (
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
                      <button onClick={() => setEditUser(user)}
                        className="w-7 h-7 rounded-lg border border-blue-400/20 bg-blue-400/10 flex items-center justify-center text-blue-400 hover:bg-blue-400/20 transition-colors"
                        title="Edit User"><Edit2 size={13} /></button>
                      <button onClick={() => handleAction(user.id, user.suspended ? "unsuspend" : "suspend")}
                        className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs transition-colors ${
                          user.suspended ? "bg-green-400/10 border-green-400/20 text-green-400 hover:bg-green-400/20" : "bg-amber-400/10 border-amber-400/20 text-amber-400 hover:bg-amber-400/20"
                        }`} title={user.suspended ? "Unsuspend" : "Suspend"}>
                        {user.suspended ? <Shield size={13} /> : <ShieldOff size={13} />}
                      </button>
                      {user.role !== "ADMIN" ? (
                        <button onClick={() => handleAction(user.id, "makeAdmin")}
                          className="w-7 h-7 rounded-lg border border-[#D4AF37]/20 bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors"
                          title="Make Admin"><UserCheck size={13} /></button>
                      ) : (
                        <button onClick={() => handleAction(user.id, "removeAdmin")}
                          className="w-7 h-7 rounded-lg border border-red-400/20 bg-red-400/10 flex items-center justify-center text-red-400 hover:bg-red-400/20 transition-colors"
                          title="Remove Admin"><UserX size={13} /></button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      <AnimatePresence>
        {editUser && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setEditUser(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="card-luxury p-6 w-full max-w-md"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F2D060] flex items-center justify-center text-black font-bold">
                    {editUser.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{editUser.name || "Unknown"}</p>
                    <p className="text-[#6B7280] text-xs">{editUser.email}</p>
                  </div>
                </div>
                <button onClick={() => setEditUser(null)} className="w-8 h-8 glass rounded-xl flex items-center justify-center text-[#6B7280] hover:text-white">
                  <X size={16} />
                </button>
              </div>

              {/* User Info */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-[#6B7280] text-xs">Role</span>
                  <span className={`text-xs px-2 py-1 rounded-full border font-medium ${
                    editUser.role === "ADMIN" ? "text-[#D4AF37] border-[#D4AF37]/20 bg-[#D4AF37]/10" : "text-[#6B7280] border-white/10 bg-white/5"
                  }`}>{editUser.role}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-[#6B7280] text-xs">Status</span>
                  <span className={`text-xs px-2 py-1 rounded-full border font-medium ${
                    editUser.suspended ? "text-red-400 border-red-400/20 bg-red-400/10" : "text-green-400 border-green-400/20 bg-green-400/10"
                  }`}>{editUser.suspended ? "Suspended" : "Active"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-[#6B7280] text-xs">Bookings</span>
                  <span className="text-white text-xs font-medium">{editUser._count?.bookings || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#6B7280] text-xs">Joined</span>
                  <span className="text-white text-xs">{formatDate(editUser.createdAt)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <p className="text-[#6B7280] text-xs uppercase tracking-wider font-semibold mb-3">Quick Actions</p>

                <button
                  onClick={() => handleAction(editUser.id, editUser.suspended ? "unsuspend" : "suspend")}
                  disabled={actionLoading}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    editUser.suspended
                      ? "bg-green-400/10 border border-green-400/20 text-green-400 hover:bg-green-400/20"
                      : "bg-amber-400/10 border border-amber-400/20 text-amber-400 hover:bg-amber-400/20"
                  }`}>
                  {editUser.suspended ? <><Shield size={15} /> Unsuspend Account</> : <><ShieldOff size={15} /> Suspend Account</>}
                </button>

                {editUser.role !== "ADMIN" ? (
                  <button onClick={() => handleAction(editUser.id, "makeAdmin")} disabled={actionLoading}
                    className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all">
                    <UserCheck size={15} /> Promote to Admin
                  </button>
                ) : (
                  <button onClick={() => handleAction(editUser.id, "removeAdmin")} disabled={actionLoading}
                    className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 bg-red-400/10 border border-red-400/20 text-red-400 hover:bg-red-400/20 transition-all">
                    <UserX size={15} /> Remove Admin Role
                  </button>
                )}

                <Link href={`/admin/bookings?userId=${editUser.id}`}
                  className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 glass hover:border-white/20 transition-all">
                  <BookOpen size={15} /> View Bookings ({editUser._count?.bookings || 0})
                </Link>

                <a href={`mailto:${editUser.email}`}
                  className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 glass hover:border-white/20 transition-all">
                  <Mail size={15} /> Send Email
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
