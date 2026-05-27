"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Star, Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      toast.success("Account created! Signing you in...");
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const PASSWORD_REQUIREMENTS = [
    { label: "At least 8 characters", met: form.password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(form.password) },
    { label: "One number", met: /[0-9]/.test(form.password) },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-[#080808] via-[#0d0d1a] to-[#080808]" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, rgba(212,175,55,0.5) 0%, transparent 70%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-dark rounded-3xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F2D060] flex items-center justify-center">
                <Star size={20} className="text-black fill-black" />
              </div>
              <span className="font-display font-bold text-2xl">
                <span className="text-gradient-gold">Meet</span>
                <span className="text-white">Greetings</span>
              </span>
            </Link>
            <h1 className="font-display text-2xl font-bold text-white">Create Account</h1>
            <p className="text-[#6B7280] text-sm mt-2">Join thousands of fans worldwide</p>
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full btn-glass py-3 rounded-xl flex items-center justify-center gap-3 mb-6 font-medium text-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="luxury-divider mb-6 text-xs">or create with email</div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider mb-2 block">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563]" />
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required className="input-luxury w-full pl-10 pr-4 py-3 text-sm rounded-xl" />
                </div>
              </div>
              <div>
                <label className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563]" />
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required className="input-luxury w-full pl-10 pr-4 py-3 text-sm rounded-xl" />
                </div>
              </div>
              <div>
                <label className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider mb-2 block">Phone (Optional)</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563]" />
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555 000 0000" className="input-luxury w-full pl-10 pr-4 py-3 text-sm rounded-xl" />
                </div>
              </div>
              <div>
                <label className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider mb-2 block">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563]" />
                  <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Create a strong password" required className="input-luxury w-full pl-10 pr-12 py-3 text-sm rounded-xl" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4B5563]">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="mt-2 space-y-1">
                  {PASSWORD_REQUIREMENTS.map((req) => (
                    <div key={req.label} className={`flex items-center gap-2 text-xs transition-colors ${req.met ? "text-green-400" : "text-[#4B5563]"}`}>
                      <CheckCircle size={12} className={req.met ? "text-green-400" : "text-[#4B5563]"} />
                      {req.label}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider mb-2 block">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563]" />
                  <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Repeat your password" required className="input-luxury w-full pl-10 pr-4 py-3 text-sm rounded-xl" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-gold py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><ArrowRight size={16} /> Create Account</>}
            </button>
          </form>

          <p className="text-center text-[#6B7280] text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#D4AF37] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
