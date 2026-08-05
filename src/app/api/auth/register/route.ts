// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';
import { syncUserToSheet } from '@/lib/google-sheets';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2).transform((value) => value.trim()),
  email: z.string().email().transform((value) => value.toLowerCase().trim()),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one symbol'),
  institution: z.string().min(2).transform((value) => value.trim()),
  educationLevel: z.enum(['SMA', 'S1 / Diploma']),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const { success } = rateLimit(`register:${ip}`, 3, 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password, institution, educationLevel } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        institution,
        educationLevel,
        active: false,
      },
    });

    const token = crypto.randomUUID();
    await prisma.activateToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    // Sync user to Google Sheets (non-fatal)
    try {
      await syncUserToSheet({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        institution: user.institution,
        educationLevel: user.educationLevel,
        active: user.active,
        role: user.role,
      });
    } catch (e) {
      console.error('Google Sheets sync failed (non-fatal):', e);
    }

    try {
      await sendVerificationEmail(email, token);
    } catch (e) {
      console.error('Email sending failed, but continuing:', e);
    }

    return NextResponse.json({
      message: 'Registration successful. Please check your email to verify your account.',
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}