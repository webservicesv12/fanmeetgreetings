"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Users, User, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

type RecipientType = "all" | "single";

export default function AdminEmailsPage() {
  const [recipientType, setRecipientType] = useState<RecipientType>("all");
  const [singleEmail, setSingleEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are required");
      return;
    }
    if (recipientType === "single" && !singleEmail.trim()) {
      toast.error("Please enter a recipient email");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/admin/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientType,
          singleEmail: recipientType === "single" ? singleEmail : undefined,
          subject,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send email");
      toast.success(data.message || "Email sent successfully!");
      setSent(true);
      // Reset after 3s
      setTimeout(() => {
        setSent(false);
        setSubject("");
        setMessage("");
        setSingleEmail("");
      }, 3000);
    } catch (err: any) {
      toast.error(err.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
          Email <span className="text-gradient-gold">Center</span>
        </h1>
        <p className="text-[#6B7280] mt-1 text-sm">Send emails to users from the platform</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSend}
        className="card-luxury p-5 md:p-6 space-y-5"
      >
        {/* Recipient Type */}
        <div>
          <label className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider mb-3 block">
            Recipients
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRecipientType("all")}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                recipientType === "all"
                  ? "border-[#D4AF37]/40 bg-[#D4AF37]/8 text-white"
                  : "border-white/8 bg-white/3 text-[#6B7280] hover:border-white/15"
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                recipientType === "all" ? "bg-[#D4AF37]/20" : "bg-white/5"
              }`}>
                <Users size={18} className={recipientType === "all" ? "text-[#D4AF37]" : "text-[#4B5563]"} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">All Users</p>
                <p className="text-xs text-[#4B5563]">Send to everyone</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRecipientType("single")}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                recipientType === "single"
                  ? "border-[#D4AF37]/40 bg-[#D4AF37]/8 text-white"
                  : "border-white/8 bg-white/3 text-[#6B7280] hover:border-white/15"
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                recipientType === "single" ? "bg-[#D4AF37]/20" : "bg-white/5"
              }`}>
                <User size={18} className={recipientType === "single" ? "text-[#D4AF37]" : "text-[#4B5563]"} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Single User</p>
                <p className="text-xs text-[#4B5563]">One recipient</p>
              </div>
            </button>
          </div>
        </div>

        {/* Single email input */}
        {recipientType === "single" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <label className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider mb-2 block">
              Recipient Email
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563]" />
              <input
                type="email"
                value={singleEmail}
                onChange={(e) => setSingleEmail(e.target.value)}
                placeholder="user@example.com"
                className="input-luxury w-full pl-10 pr-4 py-3 text-sm rounded-xl"
              />
            </div>
          </motion.div>
        )}

        {/* Subject */}
        <div>
          <label className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider mb-2 block">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject line..."
            required
            className="input-luxury w-full px-4 py-3 text-sm rounded-xl"
          />
        </div>

        {/* Message */}
        <div>
          <label className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider mb-2 block">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your email message here..."
            required
            rows={8}
            className="input-luxury w-full px-4 py-3 text-sm rounded-xl resize-none"
          />
          <p className="text-[#4B5563] text-xs mt-1.5">{message.length} characters</p>
        </div>

        {/* Send button */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={sending || sent}
            className={`btn-gold px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              sent ? "opacity-90" : ""
            }`}
          >
            {sending ? (
              <><Loader2 size={16} className="animate-spin" /> Sending...</>
            ) : sent ? (
              <><CheckCircle size={16} /> Sent!</>
            ) : (
              <><Send size={16} /> Send Email</>
            )}
          </button>

          {recipientType === "all" && (
            <div className="flex items-center gap-1.5 text-[#6B7280] text-xs">
              <AlertCircle size={13} className="text-amber-400" />
              This will email all registered users
            </div>
          )}
        </div>
      </motion.form>

      {/* Info card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 glass-gold rounded-2xl p-4 flex items-start gap-3"
      >
        <Mail size={18} className="text-[#D4AF37] shrink-0 mt-0.5" />
        <div>
          <p className="text-white text-sm font-medium mb-1">Powered by Resend</p>
          <p className="text-[#9CA3AF] text-xs leading-relaxed">
            Emails are sent from <span className="text-[#D4AF37]">no-reply@meetgreetings.com</span> via Resend.
            Make sure your Resend API key and sending domain are configured in your environment.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
