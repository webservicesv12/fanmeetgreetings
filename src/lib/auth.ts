/**
 * auth.ts — Full auth configuration for Node.js runtime only.
 *
 * Adds Prisma adapter + Credentials provider on top of the shared
 * Edge-safe config. NEVER import this file from middleware.ts.
 */
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    // Re-spread base providers (Google) and add Credentials
    ...(authConfig.providers ?? []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) throw new Error("Invalid email or password");
        if (!user.password) throw new Error("Please use Google to sign in to this account");
        if (user.suspended) throw new Error("Your account has been suspended. Please contact support.");

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) throw new Error("Invalid email or password");

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role ?? "USER";
      }
      // For Google sign-in, fetch role from DB
      if (account?.provider === "google" && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
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
  events: {
    async createUser({ user }) {
      if (user.email && user.name) {
        try {
          const { sendWelcomeEmail } = await import("@/lib/resend");
          await sendWelcomeEmail({ to: user.email, name: user.name });
        } catch (error) {
          console.error("Failed to send welcome email:", error);
        }
      }
    },
  },
});
