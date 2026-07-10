import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendApprovalEmail } from '@/lib/email';
import { syncSubmissionToSheet } from '@/lib/google-sheets';
import type { Phase } from '@prisma/client';

function nextPhaseAfterApproval(phase: Phase): Phase | null {
  if (phase === 'PRELIMINARY') return 'SEMIFINAL';
  if (phase === 'SEMIFINAL') return 'FINAL';
  return null;
}

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

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        team: {
          include: {
            captain: true,
            registration: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    if (submission.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Only pending submissions can be approved.' },
        { status: 400 }
      );
    }

    const nextPhase = nextPhaseAfterApproval(submission.phase);

    await prisma.$transaction(async (tx: any) => {
      await tx.submission.update({
        where: { id },
        data: {
          status: 'APPROVED',
          reviewedById: session.user.id,
          reviewedAt: new Date(),
        },
      });

      if (nextPhase && submission.team.registration) {
        await tx.registration.update({
          where: { id: submission.team.registration.id },
          data: { currentPhase: nextPhase },
        });
      }
    });

    await syncSubmissionToSheet({
      id: submission.id,
      teamName: submission.team.teamName,
      phase: submission.phase,
      status: 'APPROVED',
      fileUrl: submission.proposalUrl || submission.fullPaperUrl || submission.pitchDeckUrl || '',
    });

    await sendApprovalEmail(
      submission.team.captain.email,
      submission.team.captain.name || 'Participant',
      submission.team.competitionType,
      submission.phase
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Approve submission error:', error);
    return NextResponse.json({ error: 'Approval failed' }, { status: 500 });
  }
}
