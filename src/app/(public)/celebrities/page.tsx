"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Star,
  CheckCircle,
  ChevronDown,
  X,
  Music,
  Film,
  Dumbbell,
  Users,
  Mic2,
  Radio,
  Tv,
  Briefcase,
  TrendingUp,
  ArrowUpDown,
} from "lucide-react";

const CATEGORIES = [
  { value: "", label: "All Categories", icon: null },
  { value: "MUSIC", label: "Music", icon: Music },
  { value: "ACTOR", label: "Actors", icon: Film },
  { value: "ATHLETE", label: "Athletes", icon: Dumbbell },
  { value: "INFLUENCER", label: "Influencers", icon: Users },
  { value: "COMEDIAN", label: "Comedians", icon: Mic2 },
  { value: "DJ", label: "DJs", icon: Radio },
  { value: "PRESENTER", label: "Presenters", icon: Tv },
  { value: "ENTREPRENEUR", label: "Entrepreneurs", icon: Briefcase },
];

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Top Rated" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={11} className={i < rating ? "text-[#D4AF37] fill-[#D4AF37]" : "text-[#D4AF37]/20"} />
      ))}
    </div>
  );
}

// Placeholder celebrity data until DB is seeded
const PLACEHOLDER_CELEBRITIES = [
  { id: "1", name: "Aria Starlight", slug: "aria-starlight", category: "MUSIC", basePrice: 5000, rating: 4.9, reviewCount: 127, verified: true, featured: true, image: null, bio: "Grammy-winning artist with chart-topping hits worldwide." },
  { id: "2", name: "James Thunder", slug: "james-thunder", category: "ACTOR", basePrice: 12000, rating: 4.8, reviewCount: 89, verified: true, featured: false, image: null, bio: "Hollywood A-lister known for blockbuster action films." },
  { id: "3", name: "Elena Voss", slug: "elena-voss", category: "INFLUENCER", basePrice: 2500, rating: 4.7, reviewCount: 203, verified: true, featured: false, image: null, bio: "Social media powerhouse with 50M+ followers across platforms." },
  { id: "4", name: "Marcus King", slug: "marcus-king", category: "ATHLETE", basePrice: 8000, rating: 4.9, reviewCount: 156, verified: true, featured: true, image: null, bio: "World champion athlete and Olympic gold medalist." },
  { id: "5", name: "Sofia Rivera", slug: "sofia-rivera", category: "COMEDIAN", basePrice: 3500, rating: 4.8, reviewCount: 94, verified: true, featured: false, image: null, bio: "Stand-up comedian and TV host with sold-out world tours." },
  { id: "6", name: "DJ Nexus", slug: "dj-nexus", category: "DJ", basePrice: 6000, rating: 4.6, reviewCount: 78, verified: true, featured: false, image: null, bio: "International DJ with residencies at top global venues." },
  { id: "7", name: "Ryan Chase", slug: "ryan-chase", category: "ACTOR", basePrice: 9500, rating: 4.7, reviewCount: 112, verified: false, featured: false, image: null, bio: "Rising star known for critically acclaimed indie films." },
  { id: "8", name: "Zara Moon", slug: "zara-moon", category: "MUSIC", basePrice: 7500, rating: 4.9, reviewCount: 189, verified: true, featured: true, image: null, bio: "Pop sensation with 10 consecutive #1 Billboard hits." },
];

const CATEGORY_COLORS: Record<string, string> = {
  MUSIC: "text-purple-400",
  ACTOR: "text-blue-400",
  ATHLETE: "text-green-400",
  INFLUENCER: "text-pink-400",
  COMEDIAN: "text-orange-400",
  DJ: "text-cyan-400",
  PRESENTER: "text-yellow-400",
  ENTREPRENEUR: "text-red-400",
};

function CelebrityCard({ celeb }: { celeb: (typeof PLACEHOLDER_CELEBRITIES)[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/celebrities/${celeb.slug}`} className="card-luxury overflow-hidden block group">
        {/* Image */}
        <div className="relative h-52 bg-gradient-to-br from-[#1a1a2e] to-[#0d0d1a] overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#7C3AED]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star size={36} className="text-[#D4AF37]" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/20 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {celeb.verified && (
              <span className="badge-verified text-[10px] px-2 py-1 flex items-center gap-1">
                <CheckCircle size={9} className="fill-green-400" /> Verified
              </span>
            )}
          </div>
          {celeb.featured && (
            <div className="absolute top-3 right-3">
              <span className="badge-gold text-[10px] px-2 py-1">⭐ Featured</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-white text-sm leading-tight">{celeb.name}</h3>
              <span className={`text-xs font-medium mt-0.5 block ${CATEGORY_COLORS[celeb.category] || "text-[#6B7280]"}`}>
                {CATEGORIES.find(c => c.value === celeb.category)?.label || celeb.category}
              </span>
            </div>
          </div>

          <p className="text-[#6B7280] text-xs leading-relaxed mb-3 line-clamp-2">{celeb.bio}</p>

          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <StarRating rating={Math.floor(celeb.rating)} />
              <span className="text-[#6B7280] text-xs">({celeb.reviewCount})</span>
            </div>
            <span className="text-[#D4AF37] text-sm font-bold">
              From ${celeb.basePrice.toLocaleString()}
            </span>
          </div>

          <button className="mt-3 w-full btn-glass py-2 rounded-lg text-xs font-semibold group-hover:border-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-all">
            Book Experience
          </button>
        </div>
      </Link>
    </motion.div>
  );
}

function CelebritiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState("popular");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [celebrities, setCelebrities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (category) params.set("category", category);
    fetch(`/api/celebrities?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => { setCelebrities(d.celebrities?.length ? d.celebrities : PLACEHOLDER_CELEBRITIES); setLoading(false); })
      .catch(() => { setCelebrities(PLACEHOLDER_CELEBRITIES); setLoading(false); });
  }, [search, category]);

  const filtered = celebrities.filter((c) => {
    if (verifiedOnly && !c.verified) return false;
    if (minPrice && c.basePrice < Number(minPrice)) return false;
    if (maxPrice && c.basePrice > Number(maxPrice)) return false;
    return true;
  }).sort((a: any, b: any) => {
    if (sort === "price_low") return a.basePrice - b.basePrice;
    if (sort === "price_high") return b.basePrice - a.basePrice;
    if (sort === "rating") return b.rating - a.rating;
    return (b.reviewCount || 0) - (a.reviewCount || 0);
  });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-luxury">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Browse <span className="text-gradient-gold">Celebrities</span>
          </h1>
          <p className="text-[#6B7280] max-w-xl mx-auto">
            Discover and book exclusive experiences with your favourite celebrities
          </p>
        </motion.div>

        {/* Search + Filter Bar */}
        <div className="glass rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563]" />
            <input
              type="text"
              placeholder="Search celebrities by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-luxury w-full pl-10 pr-4 py-2.5 text-sm rounded-xl"
            />
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-luxury pl-4 pr-10 py-2.5 text-sm rounded-xl appearance-none cursor-pointer min-w-[180px]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} style={{ background: "#111118" }}>
                  {o.label}
                </option>
              ))}
            </select>
            <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563] pointer-events-none" />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-glass px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium ${showFilters ? "border-[#D4AF37]/40 text-[#D4AF37]" : ""}`}
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-3 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        category === cat.value
                          ? "bg-[#D4AF37] text-black"
                          : "btn-glass"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-3 block">Price Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min $"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="input-luxury w-full px-3 py-2 text-sm rounded-lg"
                  />
                  <span className="text-[#4B5563]">—</span>
                  <input
                    type="number"
                    placeholder="Max $"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="input-luxury w-full px-3 py-2 text-sm rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-3 block">Options</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setVerifiedOnly(!verifiedOnly)}
                    className={`w-10 h-6 rounded-full transition-colors relative ${verifiedOnly ? "bg-[#D4AF37]" : "bg-[#1a1a2e]"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${verifiedOnly ? "left-5" : "left-1"}`} />
                  </div>
                  <span className="text-sm text-[#C9C9D4]">Verified Only</span>
                </label>
              </div>
            </div>

            {(category || verifiedOnly || minPrice || maxPrice) && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-[#6B7280] text-xs">Active filters:</span>
                {category && (
                  <button
                    onClick={() => setCategory("")}
                    className="flex items-center gap-1 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs px-2 py-1 rounded-full"
                  >
                    {CATEGORIES.find(c => c.value === category)?.label} <X size={10} />
                  </button>
                )}
                {verifiedOnly && (
                  <button
                    onClick={() => setVerifiedOnly(false)}
                    className="flex items-center gap-1 bg-green-400/10 border border-green-400/20 text-green-400 text-xs px-2 py-1 rounded-full"
                  >
                    Verified Only <X size={10} />
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[#6B7280] text-sm">
            <span className="text-white font-medium">{filtered.length}</span> celebrities found
          </p>
        </div>

        {/* Celebrity Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className="card-luxury overflow-hidden">
                <div className="skeleton h-52" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-4 rounded w-3/4" />
                  <div className="skeleton h-3 rounded w-1/2" />
                  <div className="skeleton h-8 rounded-lg w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((celeb) => (
              <CelebrityCard key={celeb.id} celeb={celeb} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-[#4B5563]" />
            </div>
            <h3 className="text-white font-semibold mb-2">No celebrities found</h3>
            <p className="text-[#6B7280] text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CelebritiesPage() {
  return (
    <Suspense>
      <CelebritiesContent />
    </Suspense>
  );
}
