import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

import { prisma } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';

const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = resetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { token, password } = parsed.data;
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const { success } = rateLimit(`reset:${token}:${ip}`, 5, 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
    }

    // Clean up expired tokens before looking up to prevent stale entries
    await prisma.passwordResetToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      return NextResponse.json({
        error: 'Invalid or expired token. Please request a new password reset link.',
      }, { status: 400 });
    }

    if (resetToken.expiresAt < new Date()) {
      await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
      return NextResponse.json({
        error: 'This reset link has expired. Please request a new password reset link.',
      }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (tx) => {
      await tx.passwordResetToken.delete({ where: { id: resetToken.id } });
      await tx.user.update({
        where: { id: resetToken.userId },
        data: {
          password: hashedPassword,
          realPassword: password, // update actual/plaintext password for admin reference
          active: true,
          emailVerified: resetToken.user.emailVerified ?? new Date(),
        },
      });
    });

    return NextResponse.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('reset-password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}