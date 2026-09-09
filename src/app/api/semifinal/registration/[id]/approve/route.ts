// src/app/api/semifinal/registration/[id]/approve/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendSemifinalReregApprovalEmail } from '@/lib/email';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const registration = await prisma.semifinalRegistration.findUnique({
      where: { id },
      include: { team: { include: { captain: true, registration: true } } },
    });

    if (!registration) {
      return NextResponse.json({ error: 'Re-registration not found' }, { status: 404 });
    }

    if (registration.status !== 'PENDING') {
      return NextResponse.json(
        { error: `Cannot approve a re-registration with status: ${registration.status}. Only PENDING can be approved.` },
        { status: 400 }
      );
    }

    await prisma.semifinalRegistration.update({
      where: { id },
      data: {
        status: 'APPROVED',
        reviewedById: session.user.id,
        reviewedAt: new Date(),
        adminNote: null,
      },
    });

    // Ensure the team's phase reflects that they may now submit the full paper.
    if (registration.team.registration) {
      await prisma.registration.update({
        where: { id: registration.team.registration.id },
        data: { currentPhase: 'SEMIFINAL' },
      });
    }

    const emailSent = await sendSemifinalReregApprovalEmail(
      registration.team.captain.email,
      registration.team.captain.name || 'Participant',
      registration.team.competitionType,
      registration.team.teamName
    );

    return NextResponse.json({ success: true, emailSent });
  } catch (error) {
    console.error('Approve semifinal re-registration error:', error);
    return NextResponse.json({ error: 'Approval failed' }, { status: 500 });
  }
}