"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, Save, Camera, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [profileForm, setProfileForm] = useState({
    name: session?.user?.name || "",
    phone: "",
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      await update({ name: profileForm.name });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      });
      if (!res.ok) throw new Error("Failed to change password");
      toast.success("Password changed!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      toast.error("Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "avatars");
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) toast.success("Avatar uploaded!");
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">My <span className="text-gradient-gold">Profile</span></h1>
        <p className="text-[#6B7280] mt-1">Manage your account information</p>
      </div>

      {/* Avatar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-luxury p-6 mb-6">
        <h2 className="font-semibold text-white mb-5">Profile Photo</h2>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F2D060] flex items-center justify-center text-black text-2xl font-bold">
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#F2D060] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
              <Camera size={14} className="text-black" />
              <input type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) { setAvatar(e.target.files[0]); handleAvatarUpload(e.target.files[0]); }}} className="hidden" />
            </label>
          </div>
          <div>
            <p className="text-white font-medium">{session?.user?.name}</p>
            <p className="text-[#6B7280] text-sm">{session?.user?.email}</p>
            <p className="text-[#4B5563] text-xs mt-1">Click the camera icon to update your photo</p>
          </div>
        </div>
      </motion.div>

      {/* Profile Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-luxury p-6 mb-6">
        <h2 className="font-semibold text-white mb-5">Personal Information</h2>
        <div className="space-y-4">
          <div>
            <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Full Name</label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563]" />
              <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="input-luxury w-full pl-10 pr-4 py-3 text-sm rounded-xl" />
            </div>
          </div>
          <div>
            <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563]" />
              <input type="email" value={session?.user?.email || ""} disabled className="input-luxury w-full pl-10 pr-4 py-3 text-sm rounded-xl opacity-50 cursor-not-allowed" />
            </div>
          </div>
          <div>
            <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Phone Number</label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563]" />
              <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="+1 555 000 0000" className="input-luxury w-full pl-10 pr-4 py-3 text-sm rounded-xl" />
            </div>
          </div>
        </div>
        <button onClick={handleSaveProfile} disabled={savingProfile} className="btn-gold mt-5 px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2">
          {savingProfile ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><Save size={16} /> Save Changes</>}
        </button>
      </motion.div>

      {/* Change Password */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-luxury p-6">
        <h2 className="font-semibold text-white mb-5">Change Password</h2>
        <div className="space-y-4">
          {[{ label: "Current Password", key: "currentPassword" }, { label: "New Password", key: "newPassword" }, { label: "Confirm New Password", key: "confirmPassword" }].map(({ label, key }) => (
            <div key={key}>
              <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">{label}</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563]" />
                <input type="password" value={(passwordForm as any)[key]} onChange={(e) => setPasswordForm({ ...passwordForm, [key]: e.target.value })} className="input-luxury w-full pl-10 pr-4 py-3 text-sm rounded-xl" />
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleChangePassword} disabled={savingPassword} className="btn-glass mt-5 px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 border border-white/10">
          {savingPassword ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Lock size={16} /> Change Password</>}
        </button>
      </motion.div>
    </div>
  );
}
