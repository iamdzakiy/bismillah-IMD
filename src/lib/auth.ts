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
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = (credentials.email as string).toLowerCase().trim();
        
        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          // If user doesn't exist or has no password (e.g. Google only user)
          if (!user || !user.password) {
            return null;
          }

          // Check if email is verified
          if (!user.active) {
            console.warn(`Login attempt for unverified user: ${email}`);
            return null; 
          }

          const isValid = await bcrypt.compare(credentials.password as string, user.password);
          
          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            active: user.active,
            role: user.role,
            institution: user.institution,
            educationLevel: user.educationLevel,
          };
        } catch (error) {
          console.error('Authorize error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google Sign-In: Update user data after PrismaAdapter creates the user
      if (account?.provider === 'google') {
        try {
          const email = user.email;
          if (!email) return true; // Let PrismaAdapter handle it

          // Small delay to ensure PrismaAdapter has created the user
          await new Promise(resolve => setTimeout(resolve, 100));

          const dbUser = await prisma.user.findUnique({ where: { email } });
          
          if (dbUser) {
            // Update user with Google data
            await prisma.user.update({
              where: { id: dbUser.id },
              data: { 
                active: true, 
                emailVerified: dbUser.emailVerified ?? new Date(),
                googleId: dbUser.googleId ?? account.providerAccountId,
                name: dbUser.name ?? user.name ?? profile?.name ?? dbUser.name,
                institution: dbUser.institution ?? (profile as any)?.hd ?? undefined,
                educationLevel: dbUser.educationLevel ?? 'S1',
              },
            });
          }
        } catch (error) {
          console.error('Google signIn update error:', error);
          // Don't return false - user was already created by PrismaAdapter
        }
      }
      return true;
    },
    async jwt({ token, user }) {
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
        session.user.id = token.sub as string;
        session.user.active = (token.active ?? false) as boolean;
        session.user.role = (token.role ?? 'USER') as string;
        session.user.institution = (token.institution ?? null) as any;
        session.user.educationLevel = (token.educationLevel ?? null) as any;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allow relative URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allow same-origin URLs
      if (new URL(url).origin === baseUrl) return url;
      // Default to dashboard
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
});
