import { NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

import { prisma } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';

const requestSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase().trim()),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const email = parsed.data.email;
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const { success } = rateLimit(`reset-request:${email}:${ip}`, 3, 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: 'Please wait before requesting another reset.' }, { status: 429 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Avoid account enumeration
    if (!user) {
      return NextResponse.json({ message: 'If the account exists, a reset link has been sent.' });
    }

    const token = crypto.randomUUID();
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      },
    });

    await sendPasswordResetEmail(user.email, token, user.name ?? undefined);

    return NextResponse.json({ message: 'If the account exists, a reset link has been sent.' });
  } catch (error) {
    console.error('request-password-reset error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

