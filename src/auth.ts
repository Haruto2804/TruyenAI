import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub,
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Add custom fields to session object so frontend can read them
      if (session.user) {
        session.user.id = user.id;
        (session.user as any).exp = (user as any).exp;
        (session.user as any).path = (user as any).path;
        (session.user as any).displayName = (user as any).displayName;
      }
      return session;
    },
  },
});
