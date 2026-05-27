"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Heart,
  User,
  Bell,
  LogOut,
  Star,
  Settings,
  Menu,
  X,
} from "lucide-react";

const SIDEBAR_LINKS = [
  { href: "/dashboard",               label: "Overview",       icon: LayoutDashboard },
  { href: "/dashboard/bookings",      label: "My Bookings",    icon: Calendar },
  { href: "/dashboard/favorites",     label: "Favorites",      icon: Heart },
  { href: "/dashboard/notifications", label: "Notifications",  icon: Bell },
  { href: "/dashboard/profile",       label: "Profile",        icon: User },
];

function SidebarContent({
  session,
  pathname,
  onClose,
}: {
  session: any;
  pathname: string;
  onClose?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F2D060] flex items-center justify-center">
            <Star size={14} className="text-black fill-black" />
          </div>
          <span className="font-display font-bold text-lg">
            <span className="text-gradient-gold">Meet</span>
            <span className="text-white">Greetings</span>
          </span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-[#6B7280] hover:text-white p-1">
            <X size={20} />
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F2D060] flex items-center justify-center text-black font-bold text-sm shrink-0">
            {session?.user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{session?.user?.name}</p>
            <p className="text-[#6B7280] text-xs truncate">{session?.user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {SIDEBAR_LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-gradient-to-r from-[#D4AF37]/15 to-transparent border border-[#D4AF37]/20 text-[#D4AF37]"
                  : "text-[#9CA3AF] hover:bg-white/5 hover:text-white"
              }`}
            >
              <link.icon size={18} />
              <span className="flex-1">{link.label}</span>
              {active && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <Link
          href="/celebrities"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#9CA3AF] hover:bg-white/5 hover:text-white transition-all"
        >
          <Star size={17} />
          Browse Celebrities
        </Link>
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#9CA3AF] hover:bg-white/5 hover:text-white transition-all"
        >
          <Settings size={17} />
          Back to Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Prevent body scroll when drawer open
  useEffect(() => {
    if (drawerOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
      </div>
    );
  }

  const currentLink = SIDEBAR_LINKS.find((l) => l.href === pathname);

  return (
    <div className="min-h-screen flex bg-[#080808]">

      {/* ── Desktop Sidebar (lg+) ─────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 shrink-0 glass-dark border-r border-white/5 fixed left-0 top-0 bottom-0 z-30 flex-col">
        <SidebarContent session={session} pathname={pathname} />
      </aside>

      {/* ── Mobile Drawer Overlay ─────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 glass-dark border-r border-white/5 flex flex-col lg:hidden"
            >
              <SidebarContent
                session={session}
                pathname={pathname}
                onClose={() => setDrawerOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">

        {/* Mobile Top Bar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-[#080808]/95 backdrop-blur-xl border-b border-white/5">
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#9CA3AF] hover:text-white hover:bg-white/10 transition-all"
          >
            <Menu size={20} />
          </button>

          {/* Page title */}
          <div className="flex items-center gap-2 min-w-0">
            {currentLink && (
              <currentLink.icon size={16} className="text-[#D4AF37] shrink-0" />
            )}
            <span className="text-white text-sm font-semibold truncate">
              {currentLink?.label ?? "Dashboard"}
            </span>
          </div>

          {/* User avatar */}
          <div className="ml-auto flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F2D060] flex items-center justify-center text-black font-bold text-xs shrink-0">
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>

        {/* ── Mobile Bottom Tab Bar ─────────────────────────────────────── */}
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around px-1 py-2"
          style={{
            background: "rgba(8,8,8,0.97)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {SIDEBAR_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    active
                      ? "bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30"
                      : ""
                  }`}
                >
                  <link.icon
                    size={17}
                    className={active ? "text-[#D4AF37]" : "text-[#4B5563]"}
                  />
                </div>
                <span
                  className={`text-[9px] font-medium leading-tight truncate max-w-[44px] text-center ${
                    active ? "text-[#D4AF37]" : "text-[#4B5563]"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Spacer so content isn't hidden behind bottom nav on mobile */}
        <div className="lg:hidden h-[68px]" />
      </div>
    </div>
  );
}
