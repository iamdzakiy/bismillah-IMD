import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendVerifiedEmail } from '@/lib/email';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/register', req.url));
  }

  try {
    const activationToken = await prisma.activateToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!activationToken) {
      return NextResponse.json(
        { error: 'Invalid activation token' },
        { status: 400 }
      );
    }

    if (activationToken.expiresAt < new Date()) {
      await prisma.activateToken.delete({ where: { id: activationToken.id } });
      return NextResponse.json(
        { error: 'Activation token has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: activationToken.userId },
      data: { active: true },
    });

    await prisma.activateToken.delete({ where: { id: activationToken.id } });

    await sendVerifiedEmail(activationToken.user.email, activationToken.user.name || undefined);

    return NextResponse.redirect(new URL('/login?verified=true', req.url));
  } catch (error) {
    console.error('Activation error:', error);
    return NextResponse.json(
      { error: 'Activation failed' },
      { status: 500 }
    );
  }
}