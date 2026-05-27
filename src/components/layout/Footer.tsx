import Link from "next/link";
import { Star, Mail, Phone } from "lucide-react";

// Inline SVGs for brand icons removed from lucide-react
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

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#0a0a0f]">
      {/* Gold top line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      <div className="container-luxury py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F2D060] flex items-center justify-center">
                <Star size={16} className="text-black fill-black" />
              </div>
              <span className="font-display font-bold text-xl">
                <span className="text-gradient-gold">Meet</span>
                <span className="text-white">Greetings</span>
              </span>
            </Link>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
              The world's premier platform for exclusive celebrity meet-and-greet experiences. 
              Book VIP events, private sessions, and unforgettable fan experiences.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: InstagramIcon, href: "#", label: "Instagram" },
                { icon: XIcon, href: "#", label: "X (Twitter)" },
                { icon: YoutubeIcon, href: "#", label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 glass rounded-xl flex items-center justify-center text-[#6B7280] hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/celebrities", label: "Browse Celebrities" },
                { href: "/events", label: "Upcoming Events" },
                { href: "/book", label: "Book Now" },
                { href: "/dashboard", label: "My Dashboard" },
                { href: "/about", label: "About Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#6B7280] hover:text-[#D4AF37] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-3">
              {[
                "Music Artists",
                "Actors & Actresses",
                "Athletes",
                "Influencers",
                "Comedians",
                "DJs & Producers",
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/celebrities?category=${cat.split(" ")[0].toUpperCase()}`}
                    className="text-[#6B7280] hover:text-[#D4AF37] transition-colors text-sm"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-[#6B7280] text-sm">
                <Mail size={14} className="text-[#D4AF37] shrink-0" />
                <a href="mailto:support@meetgreetings.com" className="hover:text-[#D4AF37] transition-colors">
                  support@meetgreetings.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-[#6B7280] text-sm">
                <Phone size={14} className="text-[#D4AF37] shrink-0" />
                <span>+1 (555) 000-0000</span>
              </li>
            </ul>
            <div className="mt-6">
              <h5 className="text-white text-sm font-medium mb-3">Newsletter</h5>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="input-luxury flex-1 text-sm px-3 py-2.5 text-xs"
                />
                <button type="submit" className="btn-gold px-4 py-2.5 text-xs rounded-lg font-semibold whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#4B5563] text-sm">
            &copy; {new Date().getFullYear()} MeetGreetings. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {[
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/terms", label: "Terms of Service" },
              { href: "/cancellation", label: "Cancellation Policy" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#4B5563] hover:text-[#D4AF37] transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
