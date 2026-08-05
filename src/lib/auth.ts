// src/lib/auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './db';
import bcrypt from 'bcryptjs';

// Use explicit APP_URL to avoid localhost redirect issues on Vercel
const APP_URL = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || '';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: 'jwt' },
  trustHost: true,
  providers: [
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

          // If user doesn't exist or has no password
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
      // Use explicit APP_URL if set (fixes localhost redirect on Vercel)
      const origin = APP_URL || baseUrl;

      // Handle signOut - redirect to homepage
      if (url === '/') return `${origin}/`;
      // Allow relative URLs
      if (url.startsWith('/')) return `${origin}${url}`;
      // Allow same-origin URLs
      try {
        if (new URL(url).origin === origin) return url;
      } catch {
        // invalid url, fall through
      }
      // Default to dashboard
      return `${origin}/dashboard`;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
});
