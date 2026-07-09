import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendApprovalEmail } from '@/lib/email';
import { syncSubmissionToSheet } from '@/lib/google-sheets';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const submission = await prisma.submission.findUnique({
      where: { id: params.id },
      include: {
        team: {
          include: {
            captain: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    await prisma.submission.update({
      where: { id: params.id },
      data: {
        status: 'APPROVED',
        reviewedById: session.user.id,
        reviewedAt: new Date(),
      },
    });

    // Sync ke Google Sheets
    await syncSubmissionToSheet({
      id: submission.id,
      teamName: submission.team?.teamName,
      phase: submission.phase,
      status: 'APPROVED',
      fileUrl: submission.proposalUrl || submission.fullPaperUrl || '',
    });

    await sendApprovalEmail(
      submission.team!.captain.email,
      submission.team!.captain.name || 'Participant',
      submission.team!.competitionType,
      submission.phase
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Approve submission error:', error);
    return NextResponse.json({ error: 'Approval failed' }, { status: 500 });
  }
}