import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "MeetGreetings — Premium Celebrity Meet & Greet Experiences",
    template: "%s | MeetGreetings",
  },
  description:
    "Book exclusive celebrity meet-and-greet experiences, VIP dinners, video calls, and live appearances. The world's premier celebrity booking platform.",
  keywords: [
    "celebrity booking",
    "meet and greet",
    "VIP experiences",
    "fan experiences",
    "celebrity events",
    "book celebrities",
  ],
  openGraph: {
    title: "MeetGreetings — Premium Celebrity Experiences",
    description:
      "Book exclusive celebrity meet-and-greet experiences and VIP events.",
    type: "website",
    siteName: "MeetGreetings",
  },
  twitter: {
    card: "summary_large_image",
    title: "MeetGreetings",
    description: "Premium Celebrity Meet & Greet Booking Platform",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,700&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Grain texture overlay */}
        <div className="grain-overlay" aria-hidden="true" />

        <SessionProvider session={session}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#111118",
                color: "#F8F8F8",
                border: "1px solid rgba(212,175,55,0.2)",
                borderRadius: "12px",
                fontSize: "14px",
              },
              success: {
                iconTheme: { primary: "#D4AF37", secondary: "#000" },
              },
            }}
          />
          <Script id="smartsupp-chat" strategy="afterInteractive">
            {`
              var _smartsupp = _smartsupp || {};
              _smartsupp.key = '3bd1d6098488c3c2df1dfe7375bd6e737ee212a5';
              window.smartsupp||(function(d) {
                var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
                s=d.getElementsByTagName('script')[0];c=d.createElement('script');
                c.type='text/javascript';c.charset='utf-8';c.async=true;
                c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
              })(document);
            `}
          </Script>
        </SessionProvider>
      </body>
    </html>
  );
}
