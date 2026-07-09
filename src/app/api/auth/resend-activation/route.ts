import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';
import { auth } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const resendSchema = z.object({
  email: z.string().email().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json().catch(() => ({}));
    const parsed = resendSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const email = (session?.user?.email ?? parsed.data.email)?.toLowerCase().trim();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const { success } = rateLimit(`resend:${email}:${ip}`, 2, 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { error: 'Please wait before requesting another email.' },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Avoid account enumeration.
      return NextResponse.json({ message: 'If the email exists, a verification link has been sent.' });
    }

    if (user.active) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 });
    }

    await prisma.activateToken.deleteMany({ where: { userId: user.id } });

    const token = crypto.randomUUID();
    await prisma.activateToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    await sendVerificationEmail(user.email, token);

    return NextResponse.json({ message: 'Verification email resent successfully.' });
  } catch (error) {
    console.error('Resend activation error:', error);
    return NextResponse.json({ error: 'Failed to resend email' }, { status: 500 });
  }
}
