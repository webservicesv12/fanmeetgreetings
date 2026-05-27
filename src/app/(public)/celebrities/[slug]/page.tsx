"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  Globe,
  ArrowLeft,
  Heart,
  Share2,
  Play,
  Users,
} from "lucide-react";

// Inline SVGs for brand icons removed from newer lucide-react
const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const XIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const YoutubeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);
import { EVENT_TYPE_LABELS, formatPrice } from "@/lib/utils";

// Placeholder data — replaced by DB data in production
const PLACEHOLDER = {
  name: "Aria Starlight",
  category: "Music Artist",
  location: "Los Angeles, CA",
  nationality: "American",
  yearsActive: "2015–present",
  verified: true,
  featured: true,
  rating: 4.9,
  reviewCount: 127,
  bio: `Aria Starlight is a Grammy-winning music artist whose soulful voice and captivating performances have earned her a global fanbase of over 80 million. 

Born and raised in New Orleans, Louisiana, Aria blends R&B, soul, and pop into a signature sound that transcends genres. She has collaborated with some of the biggest names in the industry and headlined sold-out world tours across 6 continents.

Off-stage, Aria is a passionate philanthropist and mental health advocate. She runs the Starlight Foundation, providing music education to underprivileged youth in inner cities across the United States.`,
  socialLinks: {
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    youtube: "https://youtube.com",
    website: "https://example.com",
  },
  gallery: [null, null, null, null, null, null],
  packages: [
    {
      id: "p1",
      name: "VIP Meet & Greet",
      eventType: "MEET_AND_GREET",
      duration: 30,
      price: 5000,
      maxGuests: 2,
      includes: ["30-minute private meet & greet", "Professional photo session", "Signed memorabilia", "Backstage access pass", "VIP concierge service"],
    },
    {
      id: "p2",
      name: "Personal Video Call",
      eventType: "VIDEO_CALL",
      duration: 15,
      price: 1500,
      maxGuests: 1,
      includes: ["15-minute private video call", "Digital recording of session", "Personal greeting message"],
    },
    {
      id: "p3",
      name: "VIP Dinner Experience",
      eventType: "VIP_DINNER",
      duration: 120,
      price: 15000,
      maxGuests: 4,
      includes: ["2-hour private dinner", "Premium restaurant venue", "Personal conversation", "Group photos", "Signed merchandise package", "Dedicated concierge"],
    },
  ],
  reviews: [
    { id: "r1", user: "Sarah J.", rating: 5, comment: "Absolutely incredible experience! Aria was so warm and genuine. Worth every penny!", date: "2025-11-15" },
    { id: "r2", user: "Marcus W.", rating: 5, comment: "The meet & greet exceeded all my expectations. Professional, personal, and unforgettable.", date: "2025-10-28" },
    { id: "r3", user: "Priya S.", rating: 4, comment: "Amazing experience. Aria took time to connect with every fan. Highly recommend!", date: "2025-10-10" },
  ],
};

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className={i < Math.floor(rating) ? "text-[#D4AF37] fill-[#D4AF37]" : "text-[#D4AF37]/20"} />
      ))}
    </div>
  );
}

export default function CelebrityDetailPage({ params }: { params: { slug: string } }) {
  const celeb = PLACEHOLDER; // In production: fetch from DB by slug
  const [activeTab, setActiveTab] = useState<"about" | "packages" | "reviews">("about");
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Hero Banner */}
      <div className="relative h-72 md:h-96 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(212,175,55,0.4) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(124,58,237,0.3) 0%, transparent 60%)" }}
        />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080808] to-transparent" />

        {/* Back link */}
        <Link href="/celebrities" className="absolute top-6 left-6 flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors text-sm glass rounded-xl px-4 py-2">
          <ArrowLeft size={16} /> Back to Celebrities
        </Link>

        {/* Actions */}
        <div className="absolute top-6 right-6 flex gap-2">
          <button onClick={() => setIsLiked(!isLiked)} className={`w-10 h-10 glass rounded-xl flex items-center justify-center transition-all ${isLiked ? "text-red-400 border-red-400/30" : "text-[#6B7280]"}`}>
            <Heart size={18} className={isLiked ? "fill-red-400" : ""} />
          </button>
          <button className="w-10 h-10 glass rounded-xl flex items-center justify-center text-[#6B7280] hover:text-white">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <div className="container-luxury -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-luxury p-6 md:p-8 mb-6"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br from-[#D4AF37]/30 to-[#7C3AED]/30 flex items-center justify-center shrink-0 border-2 border-[#D4AF37]/30">
                  <Star size={48} className="text-[#D4AF37]" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {celeb.featured && <span className="badge-gold text-xs px-3 py-1">⭐ Featured</span>}
                    {celeb.verified && (
                      <span className="badge-verified text-xs px-3 py-1 flex items-center gap-1">
                        <CheckCircle size={10} className="fill-green-400" /> Verified
                      </span>
                    )}
                  </div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-1">{celeb.name}</h1>
                  <p className="text-[#D4AF37] font-medium mb-3">{celeb.category}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-[#6B7280] mb-4">
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#D4AF37]" /> {celeb.location}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#D4AF37]" /> {celeb.yearsActive}</span>
                    <span className="flex items-center gap-1.5">
                      <StarRating rating={celeb.rating} size={13} />
                      <span className="ml-1">{celeb.rating} ({celeb.reviewCount} reviews)</span>
                    </span>
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-2">
                    {celeb.socialLinks.instagram && (
                      <a href={celeb.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 glass rounded-xl flex items-center justify-center text-[#6B7280] hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all">
                        <InstagramIcon />
                      </a>
                    )}
                    {celeb.socialLinks.twitter && (
                      <a href={celeb.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 glass rounded-xl flex items-center justify-center text-[#6B7280] hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all">
                        <XIcon />
                      </a>
                    )}
                    {celeb.socialLinks.youtube && (
                      <a href={celeb.socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 glass rounded-xl flex items-center justify-center text-[#6B7280] hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all">
                        <YoutubeIcon />
                      </a>
                    )}
                    {celeb.socialLinks.website && (
                      <a href={celeb.socialLinks.website} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 glass rounded-xl flex items-center justify-center text-[#6B7280] hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all">
                        <Globe size={15} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-1 glass p-1 rounded-xl mb-6">
              {(["about", "packages", "reviews"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-[#D4AF37] to-[#F2D060] text-black"
                      : "text-[#6B7280] hover:text-white"
                  }`}
                >
                  {tab === "reviews" ? `Reviews (${celeb.reviewCount})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "about" && (
                <div className="card-luxury p-6">
                  <h2 className="font-display text-xl font-bold text-white mb-4">Biography</h2>
                  <div className="space-y-4">
                    {celeb.bio.split("\n\n").map((para, i) => (
                      <p key={i} className="text-[#9CA3AF] text-sm leading-relaxed">{para}</p>
                    ))}
                  </div>

                  {/* Gallery */}
                  <h3 className="font-display text-lg font-bold text-white mt-8 mb-4">Gallery</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {celeb.gallery.map((_, i) => (
                      <div key={i} className="aspect-square rounded-xl bg-gradient-to-br from-[#1a1a2e] to-[#0d0d1a] flex items-center justify-center border border-white/5 overflow-hidden group cursor-pointer hover:border-[#D4AF37]/30 transition-all">
                        <Play size={20} className="text-[#4B5563] group-hover:text-[#D4AF37] transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "packages" && (
                <div className="space-y-4">
                  {celeb.packages.map((pkg, i) => (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`card-luxury p-6 ${i === 0 ? "border-[#D4AF37]/30" : ""}`}
                    >
                      {i === 0 && <div className="badge-gold text-xs px-3 py-1 inline-block mb-3">Most Popular</div>}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-white text-base">{pkg.name}</h3>
                          <p className="text-[#6B7280] text-xs mt-1">
                            {EVENT_TYPE_LABELS[pkg.eventType]} · {pkg.duration} min · Up to {pkg.maxGuests} guest{pkg.maxGuests > 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gradient-gold font-display">
                            {formatPrice(pkg.price)}
                          </p>
                          <p className="text-[#6B7280] text-xs">per booking</p>
                        </div>
                      </div>
                      <ul className="space-y-2 mb-5">
                        {pkg.includes.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm text-[#C9C9D4]">
                            <CheckCircle size={14} className="text-[#D4AF37] shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/book/1?package=${pkg.id}`}
                        className="btn-gold w-full py-3 rounded-xl text-sm font-bold text-center block"
                      >
                        Book This Package
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-4">
                  <div className="card-luxury p-6 flex flex-col md:flex-row gap-6">
                    <div className="text-center">
                      <p className="text-6xl font-bold text-gradient-gold font-display">{celeb.rating}</p>
                      <StarRating rating={celeb.rating} size={18} />
                      <p className="text-[#6B7280] text-xs mt-2">{celeb.reviewCount} reviews</p>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((r) => {
                        const count = celeb.reviews.filter((rev) => rev.rating === r).length;
                        const pct = (count / celeb.reviews.length) * 100;
                        return (
                          <div key={r} className="flex items-center gap-3 mb-2">
                            <span className="text-[#6B7280] text-xs w-4">{r}</span>
                            <Star size={11} className="text-[#D4AF37] fill-[#D4AF37]" />
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F2D060] rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-[#6B7280] text-xs w-4">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {celeb.reviews.map((review, i) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="card-luxury p-5"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F2D060] flex items-center justify-center text-black font-bold text-sm">
                            {review.user[0]}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{review.user}</p>
                            <StarRating rating={review.rating} size={11} />
                          </div>
                        </div>
                        <span className="text-[#4B5563] text-xs">{review.date}</span>
                      </div>
                      <p className="text-[#9CA3AF] text-sm leading-relaxed">{review.comment}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-gold rounded-3xl p-6 border-[#D4AF37]/20"
              >
                <div className="text-center mb-6">
                  <p className="text-[#9CA3AF] text-xs uppercase tracking-wider mb-1">Starting from</p>
                  <p className="text-4xl font-bold text-gradient-gold font-display">
                    {formatPrice(Math.min(...celeb.packages.map((p) => p.price)))}
                  </p>
                  <p className="text-[#6B7280] text-xs mt-1">per experience</p>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    { icon: Clock, label: "Duration", value: "15 – 120 min" },
                    { icon: Users, label: "Guests", value: "1 – 4 guests" },
                    { icon: Calendar, label: "Availability", value: "By request" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-[#6B7280]">
                        <Icon size={14} className="text-[#D4AF37]" />
                        {label}
                      </div>
                      <span className="text-[#C9C9D4]">{value}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/book/1"
                  className="btn-gold w-full py-4 rounded-2xl font-bold text-base text-center block mb-3"
                >
                  Book Now ✦
                </Link>
                <Link
                  href="#packages"
                  onClick={() => setActiveTab("packages")}
                  className="btn-glass w-full py-3 rounded-2xl font-medium text-sm text-center block"
                >
                  View All Packages
                </Link>

                <p className="text-center text-[#4B5563] text-xs mt-4">
                  🔒 Secure booking · Verified celebrity
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
