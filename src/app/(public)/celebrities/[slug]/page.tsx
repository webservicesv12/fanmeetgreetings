"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star, MapPin, Calendar, Clock, CheckCircle, Globe,
  ArrowLeft, Heart, Share2, Play, Users, Loader2, AlertCircle,
} from "lucide-react";
import { EVENT_TYPE_LABELS, formatPrice } from "@/lib/utils";

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="4" />
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

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className={i < Math.floor(rating) ? "text-[#D4AF37] fill-[#D4AF37]" : "text-[#D4AF37]/20"} />
      ))}
    </div>
  );
}

const CATEGORY_LABELS: Record<string, string> = {
  MUSIC: "Music Artist", ACTOR: "Actor", INFLUENCER: "Influencer",
  ATHLETE: "Athlete", COMEDIAN: "Comedian", DJ: "DJ",
  PRESENTER: "Presenter", POLITICIAN: "Politician", ENTREPRENEUR: "Entrepreneur",
};

export default function CelebrityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [celeb, setCeleb] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "packages" | "reviews">("about");
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetch(`/api/celebrities/slug/${slug}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then(d => {
        if (d?.celebrity) { setCeleb(d.celebrity); setLoading(false); }
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-4">
        <Loader2 size={36} className="animate-spin text-[#D4AF37]" />
        <p className="text-[#6B7280] text-sm">Loading celebrity profile...</p>
      </div>
    );
  }

  // Not found state
  if (notFound || !celeb) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-6 text-center px-4">
        <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center">
          <AlertCircle size={28} className="text-[#D4AF37]" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-white mb-2">Celebrity Not Found</h1>
          <p className="text-[#6B7280] text-sm">This profile doesn't exist or has been removed.</p>
        </div>
        <Link href="/celebrities" className="btn-gold px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
          <ArrowLeft size={16} /> Browse Celebrities
        </Link>
      </div>
    );
  }

  const socialLinks = celeb.socialLinks || {};
  const minPrice = celeb.packages?.length
    ? Math.min(...celeb.packages.map((p: any) => Number(p.price)))
    : celeb.basePrice;
  const reviewCount = celeb._count?.reviews ?? celeb.reviews?.length ?? 0;

  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Hero Banner */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        {celeb.image ? (
          <img src={celeb.image} alt={celeb.name} className="w-full h-full object-cover object-top" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]" />
        )}
        <div className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(212,175,55,0.4) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(124,58,237,0.3) 0%, transparent 60%)" }}
        />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080808] to-transparent" />

        <Link href="/celebrities" className="absolute top-6 left-6 flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors text-sm glass rounded-xl px-4 py-2">
          <ArrowLeft size={16} /> Back to Celebrities
        </Link>
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-luxury p-6 md:p-8 mb-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br from-[#D4AF37]/30 to-[#7C3AED]/30 flex items-center justify-center shrink-0 border-2 border-[#D4AF37]/30 overflow-hidden">
                  {celeb.image
                    ? <img src={celeb.image} alt={celeb.name} className="w-full h-full object-cover" />
                    : <Star size={48} className="text-[#D4AF37]" />
                  }
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
                  <p className="text-[#D4AF37] font-medium mb-3">
                    {CATEGORY_LABELS[celeb.category] || celeb.category}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-[#6B7280] mb-4">
                    {celeb.location && (
                      <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#D4AF37]" />{celeb.location}</span>
                    )}
                    {celeb.yearsActive && (
                      <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#D4AF37]" />{celeb.yearsActive}</span>
                    )}
                    {celeb.rating > 0 && (
                      <span className="flex items-center gap-1.5">
                        <StarRating rating={celeb.rating} size={13} />
                        <span className="ml-1">{Number(celeb.rating).toFixed(1)} ({reviewCount} reviews)</span>
                      </span>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-2">
                    {socialLinks.instagram && (
                      <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 glass rounded-xl flex items-center justify-center text-[#6B7280] hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all">
                        <InstagramIcon />
                      </a>
                    )}
                    {socialLinks.twitter && (
                      <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 glass rounded-xl flex items-center justify-center text-[#6B7280] hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all">
                        <XIcon />
                      </a>
                    )}
                    {socialLinks.youtube && (
                      <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 glass rounded-xl flex items-center justify-center text-[#6B7280] hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all">
                        <YoutubeIcon />
                      </a>
                    )}
                    {socialLinks.website && (
                      <a href={socialLinks.website} target="_blank" rel="noopener noreferrer"
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
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
                    activeTab === tab ? "bg-gradient-to-r from-[#D4AF37] to-[#F2D060] text-black" : "text-[#6B7280] hover:text-white"
                  }`}>
                  {tab === "reviews" ? `Reviews (${reviewCount})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {/* About Tab */}
              {activeTab === "about" && (
                <div className="card-luxury p-6">
                  <h2 className="font-display text-xl font-bold text-white mb-4">Biography</h2>
                  {celeb.bio ? (
                    <div className="space-y-4">
                      {celeb.bio.split("\n\n").map((para: string, i: number) => (
                        <p key={i} className="text-[#9CA3AF] text-sm leading-relaxed">{para}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#4B5563] text-sm italic">No biography added yet.</p>
                  )}

                  {/* Tags */}
                  {celeb.tags?.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {celeb.tags.map((tag: string) => (
                          <span key={tag} className="text-xs px-3 py-1 glass rounded-full text-[#C9C9D4]">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {[
                      { label: "Nationality", value: celeb.nationality },
                      { label: "Years Active", value: celeb.yearsActive },
                      { label: "Category", value: CATEGORY_LABELS[celeb.category] || celeb.category },
                      { label: "Total Bookings", value: celeb._count?.bookings || 0 },
                    ].filter(d => d.value).map(detail => (
                      <div key={detail.label} className="glass rounded-xl p-3">
                        <p className="text-[#4B5563] text-xs mb-1">{detail.label}</p>
                        <p className="text-white text-sm font-medium">{detail.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Packages Tab */}
              {activeTab === "packages" && (
                <div className="space-y-4">
                  {celeb.packages?.length === 0 ? (
                    <div className="card-luxury p-10 text-center">
                      <p className="text-[#4B5563] text-sm">No packages available yet. Contact us for custom bookings.</p>
                      <Link href="/contact" className="btn-glass px-6 py-3 rounded-xl font-medium mt-4 inline-block">
                        Contact Us
                      </Link>
                    </div>
                  ) : (
                    celeb.packages?.map((pkg: any, i: number) => (
                      <motion.div key={pkg.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`card-luxury p-6 ${i === 0 ? "border-[#D4AF37]/30" : ""}`}>
                        {i === 0 && <div className="badge-gold text-xs px-3 py-1 inline-block mb-3">Most Popular</div>}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-white text-base">{pkg.name}</h3>
                            <p className="text-[#6B7280] text-xs mt-1">
                              {EVENT_TYPE_LABELS[pkg.eventType] || pkg.eventType}
                              {pkg.duration ? ` · ${pkg.duration} min` : ""}
                              {pkg.maxGuests ? ` · Up to ${pkg.maxGuests} guest${pkg.maxGuests > 1 ? "s" : ""}` : ""}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gradient-gold font-display">{formatPrice(pkg.price)}</p>
                            <p className="text-[#6B7280] text-xs">per booking</p>
                          </div>
                        </div>
                        {pkg.includes?.length > 0 && (
                          <ul className="space-y-2 mb-5">
                            {pkg.includes.map((item: string) => (
                              <li key={item} className="flex items-center gap-2 text-sm text-[#C9C9D4]">
                                <CheckCircle size={14} className="text-[#D4AF37] shrink-0" />{item}
                              </li>
                            ))}
                          </ul>
                        )}
                        <Link href={`/book/${celeb.id}?package=${pkg.id}`}
                          className="btn-gold w-full py-3 rounded-xl text-sm font-bold text-center block">
                          Book This Package
                        </Link>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div className="space-y-4">
                  {/* Rating Summary */}
                  <div className="card-luxury p-6 flex flex-col md:flex-row gap-6">
                    <div className="text-center shrink-0">
                      <p className="text-6xl font-bold text-gradient-gold font-display">
                        {Number(celeb.rating || 0).toFixed(1)}
                      </p>
                      <StarRating rating={celeb.rating || 0} size={18} />
                      <p className="text-[#6B7280] text-xs mt-2">{reviewCount} reviews</p>
                    </div>
                    {celeb.reviews?.length > 0 && (
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((r) => {
                          const count = celeb.reviews.filter((rev: any) => rev.rating === r).length;
                          const pct = celeb.reviews.length > 0 ? (count / celeb.reviews.length) * 100 : 0;
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
                    )}
                  </div>

                  {/* Review cards */}
                  {celeb.reviews?.length === 0 ? (
                    <div className="card-luxury p-10 text-center">
                      <p className="text-[#4B5563] text-sm">No reviews yet. Be the first to book!</p>
                    </div>
                  ) : (
                    celeb.reviews?.map((review: any, i: number) => (
                      <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }} className="card-luxury p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F2D060] flex items-center justify-center text-black font-bold text-sm">
                              {(review.user?.name || "A")[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">{review.user?.name || "Anonymous"}</p>
                              <StarRating rating={review.rating} size={11} />
                            </div>
                          </div>
                          <span className="text-[#4B5563] text-xs">
                            {new Date(review.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                          </span>
                        </div>
                        <p className="text-[#9CA3AF] text-sm leading-relaxed">{review.comment}</p>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="glass-gold rounded-3xl p-6 border-[#D4AF37]/20">
                <div className="text-center mb-6">
                  <p className="text-[#9CA3AF] text-xs uppercase tracking-wider mb-1">Starting from</p>
                  <p className="text-4xl font-bold text-gradient-gold font-display">{formatPrice(minPrice)}</p>
                  <p className="text-[#6B7280] text-xs mt-1">per experience</p>
                </div>

                <div className="space-y-3 mb-6">
                  {celeb.packages?.length > 0 && [
                    { icon: Clock, label: "Duration", value: `${Math.min(...celeb.packages.map((p: any) => p.duration || 15))}–${Math.max(...celeb.packages.map((p: any) => p.duration || 60))} min` },
                    { icon: Users, label: "Guests", value: "1–4 guests" },
                    { icon: Calendar, label: "Availability", value: "By request" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-[#6B7280]">
                        <Icon size={14} className="text-[#D4AF37]" />{label}
                      </div>
                      <span className="text-[#C9C9D4]">{value}</span>
                    </div>
                  ))}
                </div>

                <Link href={`/book/${celeb.id}`}
                  className="btn-gold w-full py-4 rounded-2xl font-bold text-base text-center block mb-3">
                  Book Now ✦
                </Link>
                <button onClick={() => setActiveTab("packages")}
                  className="btn-glass w-full py-3 rounded-2xl font-medium text-sm text-center block">
                  View All Packages
                </button>

                <p className="text-center text-[#4B5563] text-xs mt-4">🔒 Secure booking · Verified celebrity</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
