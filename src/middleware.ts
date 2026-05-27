/**
 * middleware.ts — Runs in the Edge runtime.
 *
 * IMPORTANT: Only import from auth.config.ts here.
 * NEVER import from auth.ts, prisma.ts, or anything that uses
 * Node.js built-ins (pg, bcrypt, fs, etc.) — they will crash
 * the Edge runtime with "Native module not found" errors.
 */
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

// Rate limit store (in-memory per Edge worker instance)
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  if (entry.count >= limit) return true;
  entry.count++;
  return false;
}

export default auth(function middleware(req: NextRequest & { auth: any }) {
  const { pathname } = req.nextUrl;
  const ip = req.headers.get("x-forwarded-for") ?? req.ip ?? "unknown";

  // Rate limit auth endpoints: 20 req/min
  if (pathname.startsWith("/api/auth")) {
    if (isRateLimited(ip, 20, 60_000)) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests" }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // Rate limit other API routes: 100 req/min
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) {
    if (isRateLimited(ip, 100, 60_000)) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests" }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // Auth-based routing is handled by authConfig.callbacks.authorized above.
  // This just calls NextResponse.next() for everything else.
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/api/:path*",
  ],
};
