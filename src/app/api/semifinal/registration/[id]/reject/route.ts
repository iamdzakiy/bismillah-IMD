// src/app/api/semifinal/registration/[id]/reject/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendSemifinalReregRejectionEmail } from '@/lib/email';
import { z } from 'zod';

const rejectSchema = z.object({
  notes: z.string().trim().min(10, 'Notes must be at least 10 characters'),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const parsed = rejectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Notes are required for rejection' }, { status: 400 });
    }

    const registration = await prisma.semifinalRegistration.findUnique({
      where: { id },
      include: { team: { include: { captain: true } } },
    });

    if (!registration) {
      return NextResponse.json({ error: 'Re-registration not found' }, { status: 404 });
    }

    if (registration.status !== 'PENDING') {
      return NextResponse.json(
        { error: `Cannot reject a re-registration with status: ${registration.status}. Only PENDING can be rejected.` },
        { status: 400 }
      );
    }

    await prisma.semifinalRegistration.update({
      where: { id },
      data: {
        status: 'REJECTED',
        reviewedById: session.user.id,
        reviewedAt: new Date(),
        adminNote: parsed.data.notes,
      },
    });

    const emailSent = await sendSemifinalReregRejectionEmail(
      registration.team.captain.email,
      registration.team.captain.name || 'Participant',
      registration.team.competitionType,
      registration.team.teamName,
      parsed.data.notes
    );

    return NextResponse.json({ success: true, emailSent });
  } catch (error) {
    console.error('Reject semifinal re-registration error:', error);
    return NextResponse.json({ error: 'Rejection failed' }, { status: 500 });
  }
}