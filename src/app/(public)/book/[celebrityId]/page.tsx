"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Bitcoin,
  Copy,
  Upload,
  Building2,
  Star,
  AlertCircle,
  Wifi,
  WifiOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice, getDurationLabel, EVENT_TYPE_LABELS, PAYMENT_METHOD_LABELS } from "@/lib/utils";

// ─── Types & Constants ────────────────────────────────────────────────────────

// Removed hardcoded EVENT_TYPES

const PAYMENT_METHODS = [
  { value: "BITCOIN", label: "Bitcoin", symbol: "BTC", icon: "₿", color: "#F7931A" },
  { value: "ETHEREUM", label: "Ethereum", symbol: "ETH", icon: "Ξ", color: "#627EEA" },
  { value: "USDT_TRC20", label: "USDT TRC20", symbol: "USDT", icon: "₮", color: "#26A17B" },
  { value: "LITECOIN", label: "Litecoin", symbol: "LTC", icon: "Ł", color: "#345D9D" },
  { value: "BUSD", label: "BUSD", symbol: "BUSD", icon: "$", color: "#F0B90B" },
  { value: "BANK_TRANSFER", label: "Bank / Wire Transfer", symbol: "BANK", icon: "🏦", color: "#4B5563" },
];

// Placeholder wallet addresses — replaced by admin-managed wallets from DB
const WALLET_ADDRESSES: Record<string, string> = {
  BITCOIN: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  ETHEREUM: "0x742d35Cc6634C0532925a3b8D4C9C4B7e2A1234",
  USDT_TRC20: "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
  LITECOIN: "ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  BUSD: "0x742d35Cc6634C0532925a3b8D4C9C4B7e2A5678",
};

const BANK_DETAILS = {
  bankName: "Chase Bank",
  accountName: "MeetGreetings LLC",
  accountNumber: "1234567890",
  routingNumber: "021000021",
  swiftCode: "CHASUS33",
};

const STEPS = [
  { id: 1, label: "Event Details" },
  { id: 2, label: "Contact Info" },
  { id: 3, label: "Payment" },
  { id: 4, label: "Review" },
  { id: 5, label: "Confirmation" },
];

// ─── Step Components ──────────────────────────────────────────────────────────

function StepIndicator({ currentStep, total }: { currentStep: number; total: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center flex-1">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                currentStep > step.id
                  ? "bg-gradient-to-br from-[#D4AF37] to-[#F2D060] text-black"
                  : currentStep === step.id
                  ? "border-2 border-[#D4AF37] text-[#D4AF37]"
                  : "border-2 border-white/10 text-[#4B5563]"
              }`}
            >
              {currentStep > step.id ? <CheckCircle size={16} /> : step.id}
            </div>
            <span className={`text-xs hidden sm:block whitespace-nowrap ${currentStep >= step.id ? "text-[#D4AF37]" : "text-[#4B5563]"}`}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all duration-500 ${currentStep > step.id ? "bg-gradient-to-r from-[#D4AF37] to-[#D4AF37]" : "bg-white/5"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Booking Page ────────────────────────────────────────────────────────

export default function BookingPage({ params }: { params: Promise<{ celebrityId: string }> }) {
  const resolvedParams = React.use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingRef, setBookingRef] = useState<string>("");

  // Form State
  const [experiences, setExperiences] = useState<any[]>([]);

  React.useEffect(() => {
    fetch("/api/experiences")
      .then((res) => res.json())
      .then((data) => setExperiences(data.experiences || []));
  }, []);
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("14:00");
  const [duration, setDuration] = useState(30);
  const [location, setLocation] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [specialRequirements, setSpecialRequirements] = useState("");

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [txHash, setTxHash] = useState("");
  const [bankRef, setBankRef] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const selectedEventType = experiences.find((e) => e.type === eventType);
  const totalAmount = selectedEventType ? selectedEventType.defaultPrice * guestCount : 0;

  // ─── File Upload ───────────────────────────────────────────────────────────

  const handleFileUpload = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "payment-proofs");

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.url as string;
  }, []);

  // ─── Submit Booking ────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    setLoading(true);
    try {
      let proofUrl = "";
      if (paymentProof) {
        proofUrl = await handleFileUpload(paymentProof);
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          celebrityId: resolvedParams.celebrityId,
          eventType,
          eventDate: `${eventDate}T${eventTime}:00`,
          duration,
          location,
          isOnline,
          guestCount,
          specialRequirements,
          contactName,
          contactEmail,
          contactPhone,
          paymentMethod,
          totalAmount,
          paymentProofUrl: proofUrl,
          txHash,
          bankRef,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      setBookingRef(data.reference);
      setStep(5);
      toast.success("Booking submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Copy to Clipboard ─────────────────────────────────────────────────────

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const canProceed = () => {
    const isTimed = selectedEventType?.isTimedEvent !== false;
    if (step === 1) return eventType && (!isTimed || (eventDate && eventTime));
    if (step === 2) return contactName && contactEmail && contactPhone;
    if (step === 3) return paymentMethod;
    if (step === 4) return agreedToTerms;
    return true;
  };

  return (
    <div className="min-h-screen pt-24 pb-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#0a0a12] to-[#080808]" />
      <div className="absolute top-0 right-0 w-96 h-96 opacity-10" style={{ background: "radial-gradient(circle, rgba(212,175,55,0.5) 0%, transparent 70%)" }} />

      <div className="container-luxury max-w-3xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            Book Your <span className="text-gradient-gold">Experience</span>
          </h1>
          <p className="text-[#6B7280] text-sm">Complete your booking in just a few steps</p>
        </div>

        {/* Stepper */}
        <StepIndicator currentStep={step} total={STEPS.length} />

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {/* ── Step 1: Event Details ─────────────────────────────────── */}
            {step === 1 && (
              <div className="card-luxury p-6 md:p-8">
                <h2 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Calendar size={20} className="text-[#D4AF37]" /> Event Details
                </h2>

                {/* Event Type */}
                <div className="mb-6">
                  <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-3 block">
                    Select Experience Type *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {experiences.map((et) => (
                      <button
                        key={et.type}
                        onClick={() => { setEventType(et.type); setDuration(et.defaultDuration); }}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          eventType === et.type
                            ? "border-[#D4AF37] bg-[#D4AF37]/5"
                            : "border-white/5 glass hover:border-white/15"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xl">{et.icon}</span>
                          <span className="text-[#D4AF37] font-bold text-sm">{formatPrice(et.defaultPrice)}</span>
                        </div>
                        <p className="text-white text-sm font-medium">{et.label}</p>
                        <p className="text-[#6B7280] text-xs">{et.defaultDuration} minutes</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date & Time */}
                {(!selectedEventType || selectedEventType.isTimedEvent !== false) && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Event Date *</label>
                      <div className="relative">
                        <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" />
                        <input
                          type="date"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="input-luxury w-full pl-9 pr-3 py-3 text-sm rounded-xl"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Event Time *</label>
                      <div className="relative">
                        <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" />
                        <input
                          type="time"
                          value={eventTime}
                          onChange={(e) => setEventTime(e.target.value)}
                          className="input-luxury w-full pl-9 pr-3 py-3 text-sm rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Duration */}
                <div className="mb-4">
                  <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">
                    Duration: <span className="text-[#D4AF37]">{getDurationLabel(duration)}</span>
                  </label>
                  <input
                    type="range"
                    min={15}
                    max={180}
                    step={15}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full accent-[#D4AF37]"
                  />
                  <div className="flex justify-between text-xs text-[#4B5563] mt-1">
                    <span>15 min</span><span>3 hrs</span>
                  </div>
                </div>

                {/* Event Format */}
                <div className="mb-4">
                  <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-3 block">Event Format</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsOnline(false)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${!isOnline ? "border-[#D4AF37] bg-[#D4AF37]/5 text-white" : "border-white/5 text-[#6B7280]"}`}
                    >
                      <WifiOff size={16} /> In-Person
                    </button>
                    <button
                      onClick={() => setIsOnline(true)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${isOnline ? "border-[#D4AF37] bg-[#D4AF37]/5 text-white" : "border-white/5 text-[#6B7280]"}`}
                    >
                      <Wifi size={16} /> Online
                    </button>
                  </div>
                </div>

                {/* Location */}
                {!isOnline && (
                  <div className="mb-4">
                    <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Location</label>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, Country or Venue"
                        className="input-luxury w-full pl-9 pr-3 py-3 text-sm rounded-xl"
                      />
                    </div>
                  </div>
                )}

                {/* Guests */}
                <div className="mb-4">
                  <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Number of Guests</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white font-bold text-lg"
                    >-</button>
                    <span className="text-white font-semibold text-lg w-8 text-center">{guestCount}</span>
                    <button
                      onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                      className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white font-bold text-lg"
                    >+</button>
                  </div>
                </div>

                {/* Special Requirements */}
                <div className="mb-4">
                  <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Special Requirements</label>
                  <textarea
                    value={specialRequirements}
                    onChange={(e) => setSpecialRequirements(e.target.value)}
                    placeholder="Any special requests, accessibility needs, or important information..."
                    rows={3}
                    className="input-luxury w-full px-4 py-3 text-sm rounded-xl resize-none"
                  />
                </div>

                {/* Live Total */}
                {selectedEventType && (
                  <div className="glass-gold rounded-xl p-4 flex items-center justify-between">
                    <span className="text-[#9CA3AF] text-sm">Estimated Total</span>
                    <span className="text-2xl font-bold text-gradient-gold font-display">{formatPrice(totalAmount)}</span>
                  </div>
                )}
              </div>
            )}

            {/* ── Step 2: Contact Info ───────────────────────────────────── */}
            {step === 2 && (
              <div className="card-luxury p-6 md:p-8">
                <h2 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <User size={20} className="text-[#D4AF37]" /> Contact Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Full Name *</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" />
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Your full name"
                        required
                        className="input-luxury w-full pl-9 pr-4 py-3 text-sm rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Email Address *</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" />
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="input-luxury w-full pl-9 pr-4 py-3 text-sm rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Phone Number *</label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" />
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+1 555 000 0000"
                        required
                        className="input-luxury w-full pl-9 pr-4 py-3 text-sm rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 glass rounded-xl p-4">
                  <p className="text-[#6B7280] text-xs leading-relaxed">
                    🔒 Your contact information is kept strictly confidential and used only to coordinate your booking experience.
                  </p>
                </div>
              </div>
            )}

            {/* ── Step 3: Payment Method ─────────────────────────────────── */}
            {step === 3 && (
              <div className="card-luxury p-6 md:p-8">
                <h2 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <CreditCard size={20} className="text-[#D4AF37]" /> Payment Method
                </h2>

                {/* Method Selection */}
                <div className="mb-6">
                  <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-3 block">
                    Choose Payment Method *
                  </label>
                  <div className="space-y-2">
                    {PAYMENT_METHODS.map((pm) => (
                      <button
                        key={pm.value}
                        onClick={() => setPaymentMethod(pm.value)}
                        className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                          paymentMethod === pm.value
                            ? "border-[#D4AF37] bg-[#D4AF37]/5"
                            : "border-white/5 glass hover:border-white/15"
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                          style={{ background: `${pm.color}20`, color: pm.color }}
                        >
                          {pm.icon}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{pm.label}</p>
                          <p className="text-[#6B7280] text-xs">{pm.value === "BANK_TRANSFER" ? "Wire transfer / Bank deposit" : `Pay with ${pm.symbol}`}</p>
                        </div>
                        {paymentMethod === pm.value && (
                          <CheckCircle size={18} className="text-[#D4AF37] ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Crypto Payment Details */}
                {paymentMethod && paymentMethod !== "BANK_TRANSFER" && WALLET_ADDRESSES[paymentMethod] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Instructions */}
                    <div className="glass-gold rounded-xl p-4">
                      <h4 className="text-[#D4AF37] font-semibold text-sm mb-3 flex items-center gap-2">
                        <AlertCircle size={14} /> Payment Instructions
                      </h4>
                      <ol className="space-y-1.5 text-[#9CA3AF] text-xs">
                        <li>1. Send exactly <strong className="text-white">{formatPrice(totalAmount)} worth of {PAYMENT_METHODS.find(p => p.value === paymentMethod)?.symbol}</strong></li>
                        <li>2. Use the wallet address or QR code below</li>
                        <li>3. Upload a screenshot of your transaction</li>
                        <li>4. Submit and wait for verification (up to 24 hours)</li>
                      </ol>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* QR Code */}
                      <div className="glass rounded-xl p-4 text-center">
                        <p className="text-[#9CA3AF] text-xs font-medium mb-3">QR Code Payment</p>
                        <div className="w-32 h-32 mx-auto bg-white rounded-xl flex items-center justify-center mb-2">
                          <div className="w-28 h-28 bg-[#111] rounded-lg flex items-center justify-center text-4xl">
                            {PAYMENT_METHODS.find(p => p.value === paymentMethod)?.icon}
                          </div>
                        </div>
                        <p className="text-[#6B7280] text-xs">Scan to pay</p>
                      </div>

                      {/* Address */}
                      <div className="glass rounded-xl p-4">
                        <p className="text-[#9CA3AF] text-xs font-medium mb-3">
                          {PAYMENT_METHODS.find(p => p.value === paymentMethod)?.label} Address
                        </p>
                        <div className="bg-[#080808] rounded-lg p-3 flex items-center gap-2 mb-3">
                          <code className="text-[#D4AF37] text-xs font-mono flex-1 break-all">
                            {WALLET_ADDRESSES[paymentMethod]}
                          </code>
                          <button
                            onClick={() => copyToClipboard(WALLET_ADDRESSES[paymentMethod])}
                            className="shrink-0 w-8 h-8 glass rounded-lg flex items-center justify-center hover:text-[#D4AF37] transition-colors"
                          >
                            <Copy size={13} />
                          </button>
                        </div>

                        {/* TX Hash */}
                        <div>
                          <label className="text-[#9CA3AF] text-xs mb-1.5 block">Transaction Hash (optional)</label>
                          <input
                            type="text"
                            value={txHash}
                            onChange={(e) => setTxHash(e.target.value)}
                            placeholder="0x..."
                            className="input-luxury w-full px-3 py-2.5 text-xs rounded-lg font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Upload Proof */}
                    <div>
                      <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">
                        Upload Payment Proof (optional)
                      </label>
                      <label
                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all ${
                          paymentProof
                            ? "border-[#D4AF37] bg-[#D4AF37]/5"
                            : "border-white/10 hover:border-[#D4AF37]/40"
                        }`}
                      >
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <Upload size={28} className={paymentProof ? "text-[#D4AF37]" : "text-[#4B5563]"} />
                        {paymentProof ? (
                          <div className="text-center">
                            <p className="text-[#D4AF37] text-sm font-medium">{paymentProof.name}</p>
                            <p className="text-[#6B7280] text-xs mt-1">Click to change file</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="text-[#C9C9D4] text-sm">Choose file or drag & drop</p>
                            <p className="text-[#4B5563] text-xs mt-1">PNG, JPG, GIF up to 10MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* Bank Transfer Details */}
                {paymentMethod === "BANK_TRANSFER" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="glass rounded-xl p-5">
                      <h4 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                        <Building2 size={16} className="text-[#D4AF37]" /> Bank Account Details
                      </h4>
                      <div className="space-y-3">
                        {Object.entries(BANK_DETAILS).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between py-2 border-b border-white/5">
                            <span className="text-[#6B7280] text-xs capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-white text-sm font-medium">{value}</span>
                              <button onClick={() => copyToClipboard(value)} className="text-[#4B5563] hover:text-[#D4AF37]">
                                <Copy size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="flex items-center justify-between py-2">
                          <span className="text-[#6B7280] text-xs">Amount</span>
                          <span className="text-[#D4AF37] font-bold">{formatPrice(totalAmount)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Reference */}
                    <div>
                      <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Bank Reference / Transfer ID</label>
                      <input
                        type="text"
                        value={bankRef}
                        onChange={(e) => setBankRef(e.target.value)}
                        placeholder="Reference number from your bank"
                        className="input-luxury w-full px-4 py-3 text-sm rounded-xl"
                      />
                    </div>

                    {/* Upload Receipt */}
                    <div>
                      <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Upload Transfer Receipt (optional)</label>
                      <label className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all ${paymentProof ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-white/10 hover:border-[#D4AF37]/40"}`}>
                        <input type="file" accept="image/*,.pdf" onChange={(e) => setPaymentProof(e.target.files?.[0] || null)} className="hidden" />
                        <Upload size={28} className={paymentProof ? "text-[#D4AF37]" : "text-[#4B5563]"} />
                        {paymentProof ? (
                          <p className="text-[#D4AF37] text-sm font-medium">{paymentProof.name}</p>
                        ) : (
                          <div className="text-center">
                            <p className="text-[#C9C9D4] text-sm">Upload bank receipt</p>
                            <p className="text-[#4B5563] text-xs mt-1">PNG, JPG, PDF up to 10MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* ── Step 4: Review & Confirm ───────────────────────────────── */}
            {step === 4 && (
              <div className="card-luxury p-6 md:p-8">
                <h2 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <CheckCircle size={20} className="text-[#D4AF37]" /> Review Your Booking
                </h2>

                <div className="space-y-4 mb-6">
                  {/* Event Details */}
                  <div className="glass rounded-xl p-5">
                    <h3 className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-4">Event Details</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><p className="text-[#6B7280] text-xs mb-1">Experience</p><p className="text-white">{selectedEventType?.label || EVENT_TYPE_LABELS[eventType] || "—"}</p></div>
                      {(!selectedEventType || selectedEventType.isTimedEvent !== false) && (
                        <div><p className="text-[#6B7280] text-xs mb-1">Date & Time</p><p className="text-white">{eventDate} at {eventTime}</p></div>
                      )}
                      <div><p className="text-[#6B7280] text-xs mb-1">Duration</p><p className="text-white">{getDurationLabel(duration)}</p></div>
                      <div><p className="text-[#6B7280] text-xs mb-1">Format</p><p className="text-white">{isOnline ? "Online" : "In-Person"}</p></div>
                      {location && <div className="col-span-2"><p className="text-[#6B7280] text-xs mb-1">Location</p><p className="text-white">{location}</p></div>}
                      <div><p className="text-[#6B7280] text-xs mb-1">Guests</p><p className="text-white">{guestCount}</p></div>
                    </div>
                    {specialRequirements && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <p className="text-[#6B7280] text-xs mb-1">Special Requirements</p>
                        <p className="text-white text-sm">{specialRequirements}</p>
                      </div>
                    )}
                  </div>

                  {/* Contact */}
                  <div className="glass rounded-xl p-5">
                    <h3 className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-4">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-[#6B7280]">Name</span><span className="text-white">{contactName}</span></div>
                      <div className="flex justify-between"><span className="text-[#6B7280]">Email</span><span className="text-white">{contactEmail}</span></div>
                      <div className="flex justify-between"><span className="text-[#6B7280]">Phone</span><span className="text-white">{contactPhone}</span></div>
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="glass rounded-xl p-5">
                    <h3 className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-4">Payment</h3>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-[#6B7280]">Method</span>
                      <span className="text-white">{PAYMENT_METHOD_LABELS[paymentMethod] || "—"}</span>
                    </div>
                    {paymentProof && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B7280]">Proof</span>
                        <span className="text-green-400 flex items-center gap-1"><CheckCircle size={12} /> {paymentProof.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="glass-gold rounded-xl p-5 flex items-center justify-between">
                    <span className="text-white font-semibold">Total Amount</span>
                    <span className="text-3xl font-bold text-gradient-gold font-display">{formatPrice(totalAmount)}</span>
                  </div>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <div
                    onClick={() => setAgreedToTerms(!agreedToTerms)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${agreedToTerms ? "border-[#D4AF37] bg-[#D4AF37]" : "border-white/20"}`}
                  >
                    {agreedToTerms && <CheckCircle size={12} className="text-black" />}
                  </div>
                  <span className="text-[#9CA3AF] text-sm">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#D4AF37] hover:underline">Terms & Conditions</Link>
                    {" "}and{" "}
                    <Link href="/cancellation" className="text-[#D4AF37] hover:underline">Cancellation Policy</Link>
                  </span>
                </label>
              </div>
            )}

            {/* ── Step 5: Confirmation ───────────────────────────────────── */}
            {step === 5 && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="card-luxury p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F2D060] flex items-center justify-center"
                >
                  <CheckCircle size={36} className="text-black" />
                </motion.div>
                <h2 className="font-display text-3xl font-bold text-white mb-3">Booking Submitted!</h2>
                <p className="text-[#9CA3AF] mb-6">
                  Your booking request has been received. We&apos;ll verify your payment and confirm within 24 hours.
                </p>

                <div className="glass-gold rounded-xl p-4 mb-6 inline-block">
                  <p className="text-[#6B7280] text-xs mb-1">Booking Reference</p>
                  <p className="text-[#D4AF37] font-mono font-bold text-lg">{bookingRef || "MGR-PROCESSING"}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => router.push("/dashboard/bookings")}
                    className="btn-gold px-8 py-3.5 rounded-xl font-bold"
                  >
                    View My Bookings
                  </button>
                  <button
                    onClick={() => router.push("/celebrities")}
                    className="btn-glass px-8 py-3.5 rounded-xl font-medium"
                  >
                    Browse More Celebrities
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {step < 5 && (
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => step > 1 && setStep(step - 1)}
              disabled={step === 1}
              className="flex items-center gap-2 btn-glass px-6 py-3 rounded-xl text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={16} /> Previous
            </button>

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 btn-gold px-6 py-3 rounded-xl text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
                className="flex items-center gap-2 btn-gold px-8 py-3 rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <><Star size={16} /> Submit Booking</>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
