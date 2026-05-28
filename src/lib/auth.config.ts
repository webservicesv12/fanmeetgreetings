/**
 * auth.config.ts — Edge-safe auth configuration
 *
 * This file MUST NOT import anything that uses Node.js built-ins
 * (no prisma, no pg, no bcrypt, no fs, etc.) because it runs in
 * the Edge runtime via middleware.ts.
 *
 * Heavy providers (Credentials + PrismaAdapter) are added in auth.ts
 * which only runs in the Node.js runtime.
 */
import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    // Google is Edge-safe (no Node.js deps)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // This runs in the Edge middleware — only read from the JWT token.
    // Never call prisma here.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = (auth?.user as any)?.role === "ADMIN";
      const pathname = nextUrl.pathname;

      // Protect /admin
      if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) return Response.redirect(new URL("/login?callbackUrl=/admin", nextUrl));
        if (!isAdmin) return Response.redirect(new URL("/dashboard?error=unauthorized", nextUrl));
        return true;
      }

      // Protect /dashboard
      if (pathname.startsWith("/dashboard")) {
        if (!isLoggedIn) return Response.redirect(new URL("/login?callbackUrl=/dashboard", nextUrl));
        return true;
      }

      // Redirect logged-in users away from auth pages
      if ((pathname === "/login" || pathname === "/register") && isLoggedIn) {
        return Response.redirect(new URL(isAdmin ? "/admin" : "/dashboard", nextUrl));
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
};
