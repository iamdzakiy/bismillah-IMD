import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendRejectionEmail } from '@/lib/email';
import { syncSubmissionToSheet } from '@/lib/google-sheets';
import { z } from 'zod';

const rejectSchema = z.object({
  notes: z.string().trim().min(10, 'Notes must be at least 10 characters'),
});


async function parseRequestBody(req: NextRequest) {
  const contentType = req.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return req.json().catch(() => ({}));
  }

  if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    const formData = await req.formData();
    return Object.fromEntries(formData.entries());
  }

  return {};
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

    const body = await parseRequestBody(req);
    const parsed = rejectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Notes are required for rejection' },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        team: {
          include: {
            captain: true,
          },
        },
      },
    });

    if (!submission?.team) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    if (submission.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Only pending submissions can be rejected.' },
        { status: 400 }
      );
    }

    await prisma.submission.update({
      where: { id },
      data: {
        status: 'REJECTED',
        notes: parsed.data.notes,
        reviewedById: session.user.id,
        reviewedAt: new Date(),
      },
    });

    await syncSubmissionToSheet({
      id: submission.id,
      teamId: submission.teamId,
      teamName: submission.team.teamName,
      competitionType: submission.team.competitionType,
      captainEmail: submission.team.captain.email,
      phase: submission.phase,
      status: 'REJECTED',
      proposalUrl: submission.proposalUrl,
      videoPitchUrl: submission.videoPitchUrl,
      fullPaperUrl: submission.fullPaperUrl,
      posterUrl: submission.posterUrl,
      pitchDeckUrl: submission.pitchDeckUrl,
      notes: submission.notes,
      reviewedById: submission.reviewedById,
      reviewedAt: submission.reviewedAt,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
    });

    await sendRejectionEmail(
      submission.team.captain.email,
      submission.team.captain.name || 'Participant',
      submission.team.competitionType,
      submission.phase,
      parsed.data.notes
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reject submission error:', error);
    return NextResponse.json({ error: 'Rejection failed' }, { status: 500 });
  }
}