"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Shield,
  Heart,
  Bell,
  ChevronDown,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/celebrities", label: "Celebrities" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-dark border-b border-white/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container-luxury flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F2D060] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star size={16} className="text-black fill-black" />
            </div>
            <span className="font-display font-bold text-xl">
              <span className="text-gradient-gold">Meet</span>
              <span className="text-white">Greetings</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all duration-200 relative group ${
                  pathname === link.href
                    ? "text-[#D4AF37]"
                    : "text-[#C9C9D4] hover:text-white"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#F2D060] rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 glass rounded-full px-4 py-2 hover:border-[#D4AF37]/30 transition-all group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F2D060] flex items-center justify-center text-black text-xs font-bold">
                    {session.user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm text-[#C9C9D4] max-w-[100px] truncate">
                    {session.user.name?.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-[#6B7280] transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-52 glass-dark rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
                    >
                      <div className="p-4 border-b border-white/5">
                        <p className="text-white font-medium text-sm truncate">
                          {session.user.name}
                        </p>
                        <p className="text-[#6B7280] text-xs truncate">
                          {session.user.email}
                        </p>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#C9C9D4] hover:bg-white/5 hover:text-white transition-all text-sm"
                        >
                          <LayoutDashboard size={15} />
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/bookings"
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#C9C9D4] hover:bg-white/5 hover:text-white transition-all text-sm"
                        >
                          <Bell size={15} />
                          My Bookings
                        </Link>
                        <Link
                          href="/dashboard/favorites"
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#C9C9D4] hover:bg-white/5 hover:text-white transition-all text-sm"
                        >
                          <Heart size={15} />
                          Favorites
                        </Link>
                        {(session.user as any).role === "ADMIN" && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all text-sm"
                          >
                            <Shield size={15} />
                            Admin Panel
                          </Link>
                        )}
                        <div className="mt-1 border-t border-white/5 pt-1">
                          <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-400 hover:bg-red-400/10 transition-all text-sm"
                          >
                            <LogOut size={15} />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-[#C9C9D4] hover:text-white transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="btn-gold text-sm px-5 py-2.5 rounded-xl"
                >
                  Get Started
                </Link>
              </>
            )}

            <Link
              href="/book"
              className="ml-1 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              Book Now ✦
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center glass rounded-xl text-white"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-40 pt-20 glass-dark overflow-y-auto"
          >
            <div className="container-luxury py-8 flex flex-col gap-4">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={`block text-2xl font-display font-semibold py-2 border-b border-white/5 transition-colors ${
                      pathname === link.href
                        ? "text-gradient-gold"
                        : "text-[#C9C9D4] hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <div className="mt-6 flex flex-col gap-3">
                {session?.user ? (
                  <>
                    <Link href="/dashboard" className="btn-glass py-3 px-6 text-center rounded-xl font-medium">
                      Dashboard
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="py-3 px-6 text-center rounded-xl font-medium text-red-400 border border-red-400/20"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="btn-glass py-3 px-6 text-center rounded-xl font-medium">
                      Sign In
                    </Link>
                    <Link href="/register" className="btn-gold py-3 px-6 text-center rounded-xl font-medium">
                      Get Started
                    </Link>
                  </>
                )}
                <Link
                  href="/book"
                  className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-semibold py-3 px-6 text-center rounded-xl"
                >
                  Book Now ✦
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
