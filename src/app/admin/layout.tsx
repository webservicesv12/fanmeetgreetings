"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Star,
  Calendar,
  CreditCard,
  Mail,
  Shield,
  LogOut,
  Settings,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const ADMIN_LINKS = [
  { href: "/admin",              label: "Dashboard",   icon: LayoutDashboard },
  { href: "/admin/bookings",     label: "Bookings",    icon: Calendar },
  { href: "/admin/celebrities",  label: "Celebrities", icon: Star },
  { href: "/admin/users",        label: "Users",       icon: Users },
  { href: "/admin/payments",     label: "Payments",    icon: CreditCard },
  { href: "/admin/emails",       label: "Emails",      icon: Mail },
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
      <div
        className="p-6 border-b flex items-center justify-between"
        style={{ borderColor: "rgba(212,175,55,0.1)" }}
      >
        <Link href="/admin" className="flex items-center gap-2" onClick={onClose}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F2D060] flex items-center justify-center">
            <Shield size={14} className="text-black" />
          </div>
          <div>
            <span className="font-display font-bold text-base text-gradient-gold">Admin</span>
            <p className="text-[#4B5563] text-[10px] leading-none">MeetGreetings</p>
          </div>
        </Link>
        {/* Close button — mobile only */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-[#6B7280] hover:text-white p-1">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Admin Info */}
      <div className="p-4 border-b" style={{ borderColor: "rgba(212,175,55,0.08)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F2D060] flex items-center justify-center text-black font-bold text-sm shrink-0">
            {session?.user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">{session?.user?.name}</p>
            <p className="text-[#D4AF37] text-[10px] font-semibold uppercase tracking-wider">Administrator</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {ADMIN_LINKS.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                active ? "text-black" : "text-[#6B7280] hover:text-white hover:bg-white/5"
              }`}
              style={
                active
                  ? {
                      background: "linear-gradient(135deg, #D4AF37, #F2D060)",
                      boxShadow: "0 4px 16px rgba(212,175,55,0.2)",
                    }
                  : {}
              }
            >
              <link.icon size={18} />
              <span className="flex-1">{link.label}</span>
              {active && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t space-y-1" style={{ borderColor: "rgba(212,175,55,0.08)" }}>
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#6B7280] hover:text-white hover:bg-white/5 transition-all"
        >
          <Settings size={17} /> View Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={17} /> Sign Out
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") {
      router.push("/dashboard?error=unauthorized");
    }
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, router]);

  // Prevent body scroll when drawer is open
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

  const currentLink = ADMIN_LINKS.find(
    (l) => pathname === l.href || (l.href !== "/admin" && pathname.startsWith(l.href))
  );

  return (
    <div className="min-h-screen flex" style={{ background: "#080810" }}>

      {/* ── Desktop Sidebar (lg+) ─────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex w-64 shrink-0 fixed left-0 top-0 bottom-0 z-30 flex-col"
        style={{
          background: "linear-gradient(180deg, #0a0a14 0%, #080812 100%)",
          borderRight: "1px solid rgba(212,175,55,0.1)",
        }}
      >
        <SidebarContent session={session} pathname={pathname} />
      </aside>

      {/* ── Mobile Drawer Overlay ─────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 flex flex-col lg:hidden"
              style={{
                background: "linear-gradient(180deg, #0a0a14 0%, #080812 100%)",
                borderRight: "1px solid rgba(212,175,55,0.1)",
              }}
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
        <header
          className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3"
          style={{
            background: "rgba(8,8,20,0.95)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(212,175,55,0.1)",
          }}
        >
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#9CA3AF] hover:text-white hover:bg-white/10 transition-all"
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#F2D060] flex items-center justify-center shrink-0">
              <Shield size={12} className="text-black" />
            </div>
            <span className="text-white text-sm font-semibold truncate">
              {currentLink?.label ?? "Admin"}
            </span>
          </div>

          {/* Admin avatar */}
          <div className="ml-auto w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F2D060] flex items-center justify-center text-black font-bold text-xs shrink-0">
            {session?.user?.name?.[0]?.toUpperCase() || "A"}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>

        {/* ── Mobile Bottom Tab Bar ─────────────────────────────────────── */}
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around px-2 py-2"
          style={{
            background: "rgba(8,8,20,0.97)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(212,175,55,0.1)",
          }}
        >
          {ADMIN_LINKS.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all min-w-0"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    active ? "bg-gradient-to-br from-[#D4AF37] to-[#F2D060]" : ""
                  }`}
                >
                  <link.icon
                    size={17}
                    className={active ? "text-black" : "text-[#4B5563]"}
                  />
                </div>
                <span
                  className={`text-[9px] font-medium leading-tight truncate max-w-[40px] ${
                    active ? "text-[#D4AF37]" : "text-[#4B5563]"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Spacer for bottom nav on mobile */}
        <div className="lg:hidden h-[68px]" />
      </div>
    </div>
  );
}
