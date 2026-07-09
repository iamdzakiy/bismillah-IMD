// src/lib/auth.ts
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './db';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: 'jwt' },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user || !user.password) return null;
          if (!user.active) {
            throw new Error('Please verify your email before logging in.');
          }
          const isValid = await bcrypt.compare(credentials.password as string, user.password);

          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            active: user.active,
            role: user.role,
            institution: user.institution,
            educationLevel: user.educationLevel,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Ensure DB row exists and matches our activation policy
      if (account?.provider === 'google') {
        try {
          const email = user.email;
          if (!email) return false;

          const dbUser = await prisma.user.findUnique({ where: { email } });

          if (!dbUser) {
            await prisma.user.create({
              data: {
                email,
                name: user.name ?? undefined,
                active: true,
                emailVerified: new Date(),
                // googleId is optional but will help prevent duplicate signups
                googleId: (account.providerAccountId as string) ?? undefined,
                role: 'USER',
              },
            });
          } else if (!dbUser.active) {
            await prisma.user.update({
              where: { id: dbUser.id },
              data: { active: true, emailVerified: dbUser.emailVerified ?? new Date() },
            });
          }
        } catch (error) {
          console.error('Google signIn error:', error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      // On first sign-in, NextAuth passes `user`.
      if (user) {
        token.sub = user.id;
        token.active = (user as any).active ?? true;
        token.role = (user as any).role ?? 'USER';
        token.institution = (user as any).institution ?? null;
        token.educationLevel = (user as any).educationLevel ?? null;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.active = (token.active ?? false) as boolean;
        session.user.role = (token.role ?? 'USER') as string;
        session.user.institution = (token.institution ?? null) as any;
        session.user.educationLevel = (token.educationLevel ?? null) as any;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
});