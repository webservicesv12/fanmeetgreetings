"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Star, Shield, Heart, Globe, Users, Award, ChevronRight, CheckCircle, Sparkles } from "lucide-react";

const STATS = [
  { value: "10K+", label: "Happy Fans", icon: "❤️" },
  { value: "500+", label: "Celebrities", icon: "⭐" },
  { value: "50+", label: "Countries", icon: "🌍" },
  { value: "99%", label: "Satisfaction", icon: "✅" },
];

const VALUES = [
  {
    icon: Shield,
    title: "Trust & Authenticity",
    description: "Every celebrity on our platform is personally verified. We guarantee every experience is genuine and exclusive.",
    color: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: Sparkles,
    title: "Luxury Experiences",
    description: "We curate only the most premium, unforgettable interactions — from intimate dinners to private concerts.",
    color: "from-[#D4AF37]/20 to-[#D4AF37]/10",
    border: "border-[#D4AF37]/20",
    iconColor: "text-[#D4AF37]",
  },
  {
    icon: Heart,
    title: "Fan-First Philosophy",
    description: "Every decision we make is designed to create life-changing moments for fans around the world.",
    color: "from-pink-500/20 to-pink-600/10",
    border: "border-pink-500/20",
    iconColor: "text-pink-400",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "From Hollywood to Nollywood, Afrobeats to K-pop — our network spans every corner of entertainment.",
    color: "from-green-500/20 to-green-600/10",
    border: "border-green-500/20",
    iconColor: "text-green-400",
  },
];

const TEAM = [
  { name: "Alexandra Reid", role: "CEO & Co-Founder", emoji: "👩‍💼", bio: "Former talent agent with 15+ years in the entertainment industry." },
  { name: "Marcus Chen", role: "CTO", emoji: "👨‍💻", bio: "Tech visionary who previously built platforms for major streaming companies." },
  { name: "Priya Nair", role: "Head of Celebrity Relations", emoji: "🌟", bio: "Manages our roster of 500+ verified celebrities across all categories." },
  { name: "Jordan Osei", role: "Head of Fan Experience", emoji: "❤️", bio: "Dedicated to making every fan interaction seamless and memorable." },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Browse & Choose", desc: "Explore our curated roster of verified celebrities across music, film, sports, and more." },
  { step: "02", title: "Pick Your Experience", desc: "From video calls to VIP dinners, choose the type of interaction that suits you." },
  { step: "03", title: "Book & Pay Securely", desc: "Complete your booking with our secure payment system supporting crypto and bank transfer." },
  { step: "04", title: "Experience & Remember", desc: "Live your dream moment — every experience is guaranteed or your money back." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#080808] via-[#0d0d1a] to-[#080808]" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.6) 0%, transparent 70%)" }} />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.6) 0%, transparent 70%)" }} />

        <div className="container-luxury relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <div className="luxury-divider mb-6">Our Story</div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Bringing Fans Closer to Their <span className="text-gradient-gold">Icons</span>
            </h1>
            <p className="text-[#9CA3AF] text-lg leading-relaxed mb-10">
              MeetGreetings was born from a simple belief — every fan deserves a chance to meet the person who 
              changed their life. We bridge the gap between celebrities and their most devoted supporters through 
              exclusive, curated, and truly unforgettable experiences.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/celebrities" className="btn-gold px-8 py-3.5 rounded-xl font-bold flex items-center gap-2">
                Browse Celebrities <ChevronRight size={18} />
              </Link>
              <Link href="/contact" className="btn-glass px-8 py-3.5 rounded-xl font-medium">
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 relative">
        <div className="container-luxury">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card-luxury p-6 text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="font-display text-3xl font-bold text-gradient-gold mb-1">{stat.value}</div>
                <div className="text-[#6B7280] text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="luxury-divider mb-6 w-fit">Our Mission</div>
              <h2 className="font-display text-4xl font-bold text-white mb-6">
                More Than Just <span className="text-gradient-gold">Meetings</span>
              </h2>
              <p className="text-[#9CA3AF] leading-relaxed mb-6">
                We don't just facilitate introductions — we create memories that last a lifetime. Our team works 
                tirelessly with talent agencies, managers, and celebrities themselves to design experiences that 
                feel personal, exclusive, and truly extraordinary.
              </p>
              <p className="text-[#9CA3AF] leading-relaxed mb-8">
                From a 5-minute birthday shoutout that makes a child's day to a multi-hour VIP dinner with an 
                A-list actor — every interaction on our platform is crafted with care, authenticity, and respect 
                for both the fan and the celebrity.
              </p>
              <div className="space-y-3">
                {["Verified celebrities only", "Secure payment processing", "100% satisfaction guarantee", "24/7 customer support"].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-[#D4AF37] shrink-0" />
                    <span className="text-[#C9C9D4] text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative">
              <div className="card-luxury p-8 relative z-10">
                <div className="text-6xl text-center mb-6">✨</div>
                <blockquote className="text-[#C9C9D4] text-lg leading-relaxed italic text-center mb-6">
                  "We believe that the connection between a fan and their idol has the power to transform lives. 
                  Our job is to make that connection possible."
                </blockquote>
                <div className="text-center">
                  <p className="text-white font-semibold">Alexandra Reid</p>
                  <p className="text-[#D4AF37] text-sm">CEO & Co-Founder, MeetGreetings</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full card-luxury rounded-3xl -z-10 opacity-30" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 relative">
        <div className="container-luxury">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14">
            <div className="luxury-divider mb-4">What We Stand For</div>
            <h2 className="font-display text-4xl font-bold text-white">
              Our Core <span className="text-gradient-gold">Values</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`card-luxury p-7 bg-gradient-to-br ${v.color} border ${v.border}`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${v.color} border ${v.border} flex items-center justify-center mb-5`}>
                  <v.icon size={22} className={v.iconColor} />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{v.title}</h3>
                <p className="text-[#9CA3AF] leading-relaxed text-sm">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container-luxury">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14">
            <div className="luxury-divider mb-4">Simple Process</div>
            <h2 className="font-display text-4xl font-bold text-white">
              How It <span className="text-gradient-gold">Works</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div key={step.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card-luxury p-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 font-display text-5xl font-black text-white/5">{step.step}</div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F2D060] flex items-center justify-center text-black font-bold text-sm mb-4">
                  {i + 1}
                </div>
                <h3 className="text-white font-bold mb-3">{step.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container-luxury">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14">
            <div className="luxury-divider mb-4">The People Behind It</div>
            <h2 className="font-display text-4xl font-bold text-white">
              Meet the <span className="text-gradient-gold">Team</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card-luxury p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#7C3AED]/20 flex items-center justify-center text-3xl mx-auto mb-4">
                  {member.emoji}
                </div>
                <h3 className="text-white font-semibold mb-1">{member.name}</h3>
                <p className="text-[#D4AF37] text-xs font-medium mb-3">{member.role}</p>
                <p className="text-[#6B7280] text-xs leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container-luxury">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center card-luxury p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-[#7C3AED]/5" />
            <div className="relative z-10">
              <div className="text-5xl mb-6">🌟</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                Ready for Your <span className="text-gradient-gold">Dream Experience?</span>
              </h2>
              <p className="text-[#9CA3AF] max-w-xl mx-auto mb-8">
                Join thousands of fans who've already created unforgettable memories with their favourite celebrities.
              </p>
              <Link href="/celebrities" className="btn-gold px-10 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-2">
                Start Exploring <ChevronRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
