"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import {
  Star,
  Search,
  Play,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Zap,
  Shield,
  Globe,
  Award,
  Music,
  Film,
  Dumbbell,
  Mic2,
  Radio,
  Users,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { icon: Music, label: "Music Artists", count: "2.4k+" },
  { icon: Film, label: "Actors", count: "1.8k+" },
  { icon: Dumbbell, label: "Athletes", count: "900+" },
  { icon: Users, label: "Influencers", count: "3.2k+" },
  { icon: Mic2, label: "Comedians", count: "600+" },
  { icon: Radio, label: "DJs", count: "400+" },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Booking",
    desc: "Book your favorite celebrity in minutes with our streamlined process.",
  },
  {
    icon: Shield,
    title: "100% Verified",
    desc: "Every celebrity is personally verified by our team for authenticity.",
  },
  {
    icon: Globe,
    title: "Global Access",
    desc: "Connect with celebrities from around the world, online or in-person.",
  },
  {
    icon: Award,
    title: "VIP Treatment",
    desc: "Premium concierge service for every booking, start to finish.",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Johnson",
    role: "Music Fan",
    rating: 5,
    quote:
      "Meeting my idol was a dream come true. MeetGreetings made the whole process seamless and unforgettable!",
    avatar: "S",
  },
  {
    name: "Marcus Williams",
    role: "Sports Enthusiast",
    rating: 5,
    quote:
      "Booked a private session with a top athlete. The experience was beyond anything I could have imagined.",
    avatar: "M",
  },
  {
    name: "Priya Sharma",
    role: "Entertainment Fan",
    rating: 5,
    quote:
      "The VIP dinner experience was absolutely incredible. Worth every penny. Already planning my next booking!",
    avatar: "P",
  },
];

const FAQS = [
  {
    q: "How does the booking process work?",
    a: "Simply find your celebrity, select your experience type and date, fill in your details, choose a payment method, and submit. Our team reviews and confirms within 24-48 hours.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept Bitcoin, Ethereum, USDT TRC20, Litecoin, BUSD, and bank wire transfers. After payment, simply upload your proof and our team verifies it.",
  },
  {
    q: "Can I cancel or reschedule my booking?",
    a: "Yes, you can cancel or reschedule from your dashboard. Cancellation policies vary by celebrity and experience type.",
  },
  {
    q: "Are the celebrities real and verified?",
    a: "Absolutely. Every celebrity on our platform is individually verified by our team. You'll see a verified badge on confirmed profiles.",
  },
  {
    q: "What types of experiences are available?",
    a: "We offer meet & greets, video calls, birthday shoutouts, VIP dinners, live appearances, private concerts, and photo sessions.",
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`card-luxury p-6 cursor-pointer transition-all ${open ? "border-[#D4AF37]/30" : ""}`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between gap-4">
        <h4 className="font-medium text-white text-sm md:text-base">{q}</h4>
        <ChevronDown
          size={18}
          className={`text-[#D4AF37] shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>
      {open && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-[#9CA3AF] text-sm mt-3 leading-relaxed"
        >
          {a}
        </motion.p>
      )}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < rating ? "star-filled fill-[#D4AF37]" : "star-empty"}
        />
      ))}
    </div>
  );
}

// ─── Main Homepage ─────────────────────────────────────────────────────────────

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="min-h-screen">
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#0d0d1a] to-[#080808]" />
          {/* Ambient orbs */}
          <motion.div
            style={{
              y: heroY,
              background: "radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)",
            }}
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-20"
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)",
            }}
          />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)
              `,
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 container-luxury text-center pt-24"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass-gold rounded-full px-5 py-2 mb-8"
          >
            <Star size={12} className="text-[#D4AF37] fill-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">
              Premium Celebrity Experiences
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6"
          >
            Meet Your{" "}
            <span className="text-gradient-gold">Favourite</span>
            <br />
            <span className="text-white">Celebrity</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[#9CA3AF] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Book exclusive meet-and-greet experiences, VIP dinners, video calls,
            and private sessions with the world&apos;s biggest stars.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="max-w-xl mx-auto mb-8"
          >
            <div className="glass rounded-2xl p-2 flex items-center gap-3">
              <Search size={20} className="text-[#6B7280] ml-4 shrink-0" />
              <input
                type="text"
                placeholder="Search celebrities, events, or experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-[#6B7280] outline-none text-sm py-2"
              />
              <Link
                href={`/celebrities${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`}
                className="btn-gold px-7 py-3 rounded-xl text-sm font-bold"
              >
                Search
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex items-center justify-center gap-10 md:gap-20 flex-wrap mt-6"
          >
            {[
              { label: "Celebrities", value: "8,000+" },
              { label: "Happy Fans", value: "50,000+" },
              { label: "Events", value: "12,000+" },
              { label: "Countries", value: "80+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient-gold font-display">
                  {stat.value}
                </div>
                <div className="text-[#6B7280] text-xs uppercase tracking-widest mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-[#4B5563]"
            >
              <span className="text-xs uppercase tracking-widest">Scroll</span>
              <ChevronDown size={16} />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Categories Section ───────────────────────────────────────────── */}
      <section className="py-20 relative">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <div className="luxury-divider mb-6">Browse by Category</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Find Your Perfect <span className="text-gradient-gold">Celebrity</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
              >
                <Link
                  href={`/celebrities?category=${cat.label.split(" ")[0].toUpperCase()}`}
                  className="card-luxury p-6 flex flex-col items-center text-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center group-hover:from-[#D4AF37]/40 group-hover:to-[#D4AF37]/10 transition-all group-hover:scale-110 duration-300">
                    <cat.icon size={26} className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{cat.label}</p>
                    <p className="text-[#6B7280] text-xs mt-1">{cat.count}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trending Celebrities ─────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d0d1a]/50 to-transparent" />
        <div className="container-luxury relative">
          <div className="flex items-end justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="luxury-divider mb-4">Trending Now</div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
                Most Booked <span className="text-gradient-gold">This Week</span>
              </h2>
            </motion.div>
            <Link
              href="/celebrities"
              className="hidden md:flex items-center gap-2 text-[#D4AF37] text-sm font-medium hover:gap-3 transition-all"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {/* Celebrity Cards Grid - placeholder cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href="/celebrities" className="card-luxury overflow-hidden block group">
                  {/* Image area */}
                  <div className="relative h-60 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-[#7C3AED]/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Star size={38} className="text-[#D4AF37]" />
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="badge-verified text-[10px] px-2.5 py-1.5">✓ Verified</span>
                    </div>
                    {i === 0 && (
                      <div className="absolute top-4 right-4">
                        <span className="badge-gold text-[10px] px-2.5 py-1.5">Featured</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="font-semibold text-white text-base mb-1">
                      {["Aria Starlight", "James Thunder", "Elena Voss", "Marcus King"][i]}
                    </h3>
                    <p className="text-[#D4AF37] text-xs font-medium mb-4">
                      {["Music Artist", "Actor", "Influencer", "Athlete"][i]}
                    </p>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-1.5">
                        <StarRating rating={5} />
                        <span className="text-[#6B7280] text-xs">(120+)</span>
                      </div>
                      <span className="text-[#D4AF37] font-bold text-sm">
                        From ${[5000, 12000, 2500, 8000][i].toLocaleString()}
                      </span>
                    </div>
                    <Link
                      href={`/celebrities/${["aria-starlight", "james-thunder", "elena-voss", "marcus-king"][i]}`}
                      className="w-full btn-glass py-3 rounded-xl text-sm font-semibold text-center block group-hover:border-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-all"
                    >
                      Book Now
                    </Link>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="luxury-divider mb-6">Simple Process</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Book in <span className="text-gradient-gold">3 Simple Steps</span>
            </h2>
            <p className="text-[#6B7280] max-w-xl mx-auto">
              Our streamlined booking process makes it effortless to secure your dream celebrity experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[25%] right-[25%] h-px bg-gradient-to-r from-[#D4AF37]/30 via-[#D4AF37]/60 to-[#D4AF37]/30" />

            {[
              {
                step: "01",
                title: "Choose Your Celebrity",
                desc: "Browse thousands of verified celebrities and find your perfect match.",
                icon: Search,
              },
              {
                step: "02",
                title: "Book Your Experience",
                desc: "Select your event type, date, and complete our simple booking form.",
                icon: Star,
              },
              {
                step: "03",
                title: "Enjoy the Experience",
                desc: "After payment verification, sit back and enjoy your dream celebrity experience!",
                icon: Play,
              },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-[#7C3AED]/20 rounded-3xl rotate-6 transition-transform group-hover:rotate-12" />
                  <div className="relative w-full h-full glass-gold rounded-3xl flex items-center justify-center">
                    <step.icon size={36} className="text-[#D4AF37]" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-[#D4AF37] to-[#F2D060] rounded-full flex items-center justify-center text-black text-xs font-black">
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="luxury-divider mb-6">Why Choose Us</div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
                The Premier Platform for{" "}
                <span className="text-gradient-gold">Celebrity Experiences</span>
              </h2>
              <p className="text-[#6B7280] mb-10 leading-relaxed">
                We&apos;ve built the most trusted celebrity booking platform in the world,
                combining technology and personal service to create unforgettable experiences.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {FEATURES.map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass rounded-2xl p-6 hover:border-[#D4AF37]/20 transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center mb-4">
                      <f.icon size={22} className="text-[#D4AF37]" />
                    </div>
                    <h4 className="font-semibold text-white text-sm mb-2">{f.title}</h4>
                    <p className="text-[#6B7280] text-sm leading-relaxed">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Visual panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-[500px] rounded-3xl overflow-hidden glass-gold">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#0d0d1a] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-[#7C3AED]/30 flex items-center justify-center animate-float">
                      <Star size={56} className="text-[#D4AF37]" />
                    </div>
                    <p className="text-[#D4AF37] font-display text-2xl font-bold">
                      50,000+
                    </p>
                    <p className="text-[#9CA3AF] text-sm mt-1">
                      Unforgettable Experiences
                    </p>
                  </div>
                </div>

                {/* Floating cards */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-8 right-8 glass rounded-2xl p-4 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    <span className="text-white font-medium">Booking Approved!</span>
                  </div>
                  <p className="text-[#6B7280] text-xs mt-1">Meet & Greet with Aria S.</p>
                </motion.div>

                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                  className="absolute bottom-12 left-8 glass-gold rounded-2xl p-4 text-sm"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <StarRating rating={5} />
                  </div>
                  <p className="text-white text-xs font-medium">
                    &ldquo;Best experience ever!&rdquo;
                  </p>
                  <p className="text-[#6B7280] text-[11px] mt-1">— Sarah J.</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-transparent via-[#0d0d1a]/60 to-transparent">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="luxury-divider mb-6">Testimonials</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              What Our <span className="text-gradient-gold">Fans Say</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-luxury p-8 relative"
              >
                <div className="absolute top-6 right-7 text-6xl text-[#D4AF37]/10 font-serif leading-none">
                  &ldquo;
                </div>
                <StarRating rating={t.rating} />
                <p className="text-[#C9C9D4] text-sm leading-relaxed mt-5 mb-8 relative z-10">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F2D060] flex items-center justify-center text-black font-bold text-sm shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-[#6B7280] text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-14 md:p-24 text-center"
            style={{
              background:
                "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
            }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)", transform: "translate(-50%, -50%)" }}
            />
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-15"
              style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)", transform: "translate(50%, 50%)" }}
            />
            <div className="relative z-10">
              <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-8">
                Ready to Meet Your{" "}
                <span className="text-gradient-gold">Favourite Star?</span>
              </h2>
              <p className="text-[#9CA3AF] text-lg mb-12 max-w-xl mx-auto leading-relaxed">
                Join thousands of fans who have already enjoyed exclusive celebrity experiences through MeetGreetings.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link href="/celebrities" className="btn-gold px-10 py-4 rounded-2xl font-bold text-base">
                  Browse Celebrities ✦
                </Link>
                {/* <Link
                  href="/register"
                  className="btn-glass px-10 py-4 rounded-2xl font-semibold text-base"
                >
                  Create Free Account
                </Link> */}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ Section ──────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container-luxury max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="luxury-divider mb-6">FAQ</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Frequently Asked <span className="text-gradient-gold">Questions</span>
            </h2>
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <FAQItem q={faq.q} a={faq.a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
