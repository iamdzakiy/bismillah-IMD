import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { isSubmissionOpen } from '@/lib/phase-utils';

const semifinalSchema = z.object({
  teamId: z.string(),
  fullPaperUrl: z.string().url().optional(),
  videoPitchUrl: z.string().url().optional(),
  pitchDeckUrl: z.string().url().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = semifinalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    const { teamId, fullPaperUrl, videoPitchUrl, pitchDeckUrl } = parsed.data;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        registration: true,
        submissions: { where: { phase: 'PRELIMINARY', status: 'APPROVED' } },
      },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    if (team.captainId !== session.user.id) {
      return NextResponse.json(
        { error: 'Only team captain can submit' },
        { status: 403 }
      );
    }

    if (team.submissions.length === 0) {
      return NextResponse.json(
        { error: 'Your preliminary submission has not been approved.' },
        { status: 403 }
      );
    }

    if (!isSubmissionOpen(team.competitionType, 'semifinal')) {
      return NextResponse.json(
        { error: 'Semifinal submission period is closed.' },
        { status: 400 }
      );
    }

    const existing = await prisma.submission.findFirst({
      where: { teamId, phase: 'SEMIFINAL' },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'You already submitted for semifinal phase.' },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.create({
      data: {
        teamId,
        phase: 'SEMIFINAL',
        fullPaperUrl,
        videoPitchUrl,
        pitchDeckUrl,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
    });
  } catch (error) {
    console.error('Semifinal submission error:', error);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}