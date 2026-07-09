import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';
import { auth } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { success } = rateLimit(`resend:${session.user.id}`, 2, 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { error: 'Please wait before requesting another email.' },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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