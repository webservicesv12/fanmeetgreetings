"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle, MessageSquare, Instagram, Twitter, Youtube } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

const SUBJECTS = [
  "General Inquiry", "Booking Support", "Celebrity Partnership",
  "Technical Issue", "Billing / Payment", "Media & Press", "Other",
];

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "hello@meetgreetings.com", href: "mailto:hello@meetgreetings.com" },
  { icon: Clock, label: "Response Time", value: "Within 24–48 hours", href: null },
  { icon: MapPin, label: "Headquarters", value: "Global — Serving Worldwide", href: null },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSent(true);
      toast.success("Message sent! We'll get back to you within 24 hours.");
    } catch (err: any) {
      toast.error(err.message || "Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20">
      {/* Hero */}
      <div className="container-luxury mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="luxury-divider mb-4">We're Here to Help</div>
          <h1 className="font-display text-5xl font-bold text-white mb-4">
            Get in <span className="text-gradient-gold">Touch</span>
          </h1>
          <p className="text-[#9CA3AF] max-w-xl mx-auto">
            Whether you have a question about a booking, want to partner with us, or just want to say hello —
            our team is ready to respond.
          </p>
        </motion.div>
      </div>

      <div className="container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left — Info */}
          <motion.div className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>

            {/* Contact Cards */}
            {CONTACT_INFO.map((item) => (
              <div key={item.label} className="card-luxury p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                  <item.icon size={18} className="text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-[#6B7280] text-xs uppercase tracking-wider font-medium mb-0.5">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-white text-sm font-medium hover:text-[#D4AF37] transition-colors">{item.value}</a>
                  ) : (
                    <p className="text-white text-sm font-medium">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* FAQ Shortcuts */}
            <div className="card-luxury p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <MessageSquare size={16} className="text-[#D4AF37]" /> Quick Help
              </h3>
              <div className="space-y-2">
                {[
                  { q: "How do I book a celebrity?", href: "/celebrities" },
                  { q: "What payment methods are accepted?", href: "/celebrities" },
                  { q: "How do I cancel a booking?", href: "/dashboard/bookings" },
                  { q: "When will my booking be confirmed?", href: "/dashboard" },
                ].map(item => (
                  <Link key={item.q} href={item.href}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                    <span className="text-[#C9C9D4] text-sm group-hover:text-white transition-colors">{item.q}</span>
                    <span className="text-[#4B5563] group-hover:text-[#D4AF37] transition-colors text-sm">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="card-luxury p-6">
              <h3 className="text-white font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { label: "Instagram", icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  ) },
                  { label: "Twitter/X", icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  ) },
                  { label: "YouTube", icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  ) },
                ].map(social => (
                  <button key={social.label}
                    className="w-10 h-10 glass rounded-xl flex items-center justify-center text-[#6B7280] hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all">
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="card-luxury p-7 md:p-9">
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} className="text-green-400" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white mb-3">Message Sent!</h3>
                  <p className="text-[#9CA3AF] mb-8">
                    Thanks for reaching out. We'll reply to <strong className="text-white">{form.email}</strong> within 24–48 hours.
                  </p>
                  <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: SUBJECTS[0], message: "" }); }}
                    className="btn-glass px-6 py-3 rounded-xl font-medium">
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-bold text-white mb-2">Send Us a Message</h2>
                  <p className="text-[#6B7280] text-sm mb-8">We typically respond within 24 hours on business days.</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Your Name *</label>
                        <input value={form.name} onChange={e => set("name", e.target.value)}
                          className="input-luxury w-full px-4 py-3 text-sm rounded-xl" placeholder="John Doe" required />
                      </div>
                      <div>
                        <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Email Address *</label>
                        <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                          className="input-luxury w-full px-4 py-3 text-sm rounded-xl" placeholder="john@example.com" required />
                      </div>
                    </div>

                    <div>
                      <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Subject *</label>
                      <select value={form.subject} onChange={e => set("subject", e.target.value)}
                        className="input-luxury w-full px-4 py-3 text-sm rounded-xl" style={{ background: "#111118" }}>
                        {SUBJECTS.map(s => <option key={s} value={s} style={{ background: "#111118" }}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Message *</label>
                      <textarea value={form.message} onChange={e => set("message", e.target.value)}
                        rows={6} required
                        className="input-luxury w-full px-4 py-3 text-sm rounded-xl resize-none"
                        placeholder="Tell us how we can help you..." />
                    </div>

                    <button type="submit" disabled={sending}
                      className="btn-gold w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                      {sending ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : <><Send size={18} /> Send Message</>}
                    </button>

                    <p className="text-[#4B5563] text-xs text-center">
                      By submitting, you agree to our privacy policy. We never share your data.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
