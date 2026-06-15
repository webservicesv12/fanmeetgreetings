"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, MapPin, Users, Clock, Star, ChevronRight, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";

// Removed hardcoded EVENT_TYPES and TYPE_ICONS

const CATEGORY_COLORS: Record<string, string> = {
  MUSIC: "text-purple-400", ACTOR: "text-blue-400", ATHLETE: "text-green-400",
  INFLUENCER: "text-pink-400", COMEDIAN: "text-orange-400", DJ: "text-cyan-400",
  PRESENTER: "text-yellow-400", ENTREPRENEUR: "text-red-400",
};

function EventCard({ event, experiences = [] }: { event: any, experiences?: any[] }) {
  const experience = experiences.find(e => e.type === event.eventType);
  const icon = experience?.icon || "⭐";
  const label = experience?.label || event.eventType;
  const spotsLeft = event.capacity - (event.booked || 0);
  const soldOut = spotsLeft <= 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
      <div className={`card-luxury overflow-hidden flex flex-col h-full ${soldOut ? "opacity-70" : ""}`}>
        {/* Image / Banner */}
        <div className="relative h-44 bg-gradient-to-br from-[#1a1a2e] to-[#0d0d1a] overflow-hidden">
          {event.image ? (
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl">{icon}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/30 to-transparent" />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="text-[10px] px-2 py-1 rounded-full bg-[#7C3AED]/80 border border-purple-400/30 text-purple-200 font-medium">
              {icon} {label}
            </span>
          </div>
          {soldOut && (
            <div className="absolute top-3 right-3">
              <span className="text-[10px] px-2 py-1 rounded-full bg-red-500/80 border border-red-400/30 text-white font-medium">Sold Out</span>
            </div>
          )}
          {!soldOut && spotsLeft <= 5 && (
            <div className="absolute top-3 right-3">
              <span className="text-[10px] px-2 py-1 rounded-full bg-amber-500/80 border border-amber-400/30 text-white font-medium">⚡ {spotsLeft} left</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-semibold text-white text-sm leading-tight mb-1">{event.title}</h3>

          {/* Celebrity */}
          {event.celebrity && (
            <Link href={`/celebrities/${event.celebrity.slug}`}
              className={`text-xs font-medium mb-3 hover:underline ${CATEGORY_COLORS[event.celebrity.category] || "text-[#D4AF37]"}`}>
              {event.celebrity.verified && "✓ "}{event.celebrity.name}
            </Link>
          )}

          {/* Details */}
          <div className="space-y-1.5 mb-4 flex-1">
            {event.date && (
              <div className="flex items-center gap-2 text-[#9CA3AF] text-xs">
                <Calendar size={11} className="shrink-0" />
                <span>{format(new Date(event.date), "EEE, MMM d yyyy 'at' h:mm a")}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2 text-[#9CA3AF] text-xs">
                <MapPin size={11} className="shrink-0" /><span className="truncate">{event.location}</span>
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[#9CA3AF] text-xs">
                <Clock size={11} /><span>{event.duration}min</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#9CA3AF] text-xs">
                <Users size={11} /><span>{event.booked || 0}/{event.capacity} booked</span>
              </div>
            </div>
            {event.description && (
              <p className="text-[#6B7280] text-xs leading-relaxed line-clamp-2 pt-1">{event.description}</p>
            )}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <span className="text-[#D4AF37] font-bold text-base">${Number(event.price).toLocaleString()}</span>
            <Link href={event.celebrity ? `/celebrities/${event.celebrity.slug}` : "/celebrities"}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                soldOut
                  ? "bg-white/5 border border-white/10 text-[#4B5563] cursor-not-allowed"
                  : "btn-gold hover:opacity-90"
              }`}>
              {soldOut ? "Sold Out" : "Book Now →"}
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EventsContent() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "");

  useEffect(() => {
    fetch("/api/experiences").then(r => r.json()).then(d => setExperiences(d.experiences || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (typeFilter) params.set("type", typeFilter);
    fetch(`/api/events?${params}`)
      .then(r => r.json())
      .then(d => { setEvents(d.events || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [typeFilter]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <div className="container-luxury mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="luxury-divider mb-4">Upcoming Events</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Exclusive <span className="text-gradient-gold">Experiences</span>
          </h1>
          <p className="text-[#6B7280] max-w-xl mx-auto text-sm md:text-base">
            Secure your spot at hand-picked, limited-capacity events with your favourite celebrities
          </p>
        </motion.div>
      </div>

      {/* Filter Bar */}
      <div className="container-luxury mb-8">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Filter size={15} className="text-[#4B5563] shrink-0" />
            {[{ type: "", label: "All Types", icon: "" }, ...experiences].map(t => (
              <button key={t.type} onClick={() => setTypeFilter(t.type)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  typeFilter === t.type
                    ? "bg-[#D4AF37] text-black"
                    : "btn-glass"
                }`}>
                {t.type && t.icon + " "}{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container-luxury">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="card-luxury overflow-hidden">
                <div className="skeleton h-44" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-4 rounded w-3/4" />
                  <div className="skeleton h-3 rounded w-1/2" />
                  <div className="skeleton h-8 rounded-xl w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar size={28} className="text-[#4B5563]" />
            </div>
            <h3 className="text-white font-semibold mb-2">No upcoming events</h3>
            <p className="text-[#6B7280] text-sm mb-6">Check back soon or explore our celebrities</p>
            <Link href="/celebrities" className="btn-gold px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2">
              Browse Celebrities <ChevronRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <p className="text-[#6B7280] text-sm mb-6">
              <span className="text-white font-medium">{events.length}</span> upcoming events
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => <EventCard key={event.id} event={event} experiences={experiences} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  return <Suspense><EventsContent /></Suspense>;
}
