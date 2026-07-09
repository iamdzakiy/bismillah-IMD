import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { isSubmissionOpen } from '@/lib/phase-utils';
import { syncSubmissionToSheet } from '@/lib/google-sheets';

const finalSchema = z.object({
  teamId: z.string(),
  pitchDeckUrl: z.string().url().optional(),
  videoPitchUrl: z.string().url().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const parsed = finalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { teamId, pitchDeckUrl, videoPitchUrl } = parsed.data;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        registration: true,
        submissions: { where: { phase: 'SEMIFINAL', status: 'APPROVED' } },
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

    if (team.registration?.currentPhase !== 'FINAL') {
      return NextResponse.json(
        { error: 'Your team is not in the final phase.' },
        { status: 403 }
      );
    }

    if (team.submissions.length === 0) {
      return NextResponse.json(
        { error: 'Your team has not passed the semifinal phase.' },
        { status: 403 }
      );
    }

    if (!isSubmissionOpen(team.competitionType, 'final')) {
      return NextResponse.json(
        { error: 'Final submission period is closed.' },
        { status: 400 }
      );
    }

    const existing = await prisma.submission.findFirst({
      where: { teamId, phase: 'FINAL' },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'You already submitted for final phase.' },
        { status: 400 }
      );
    }

    if (!pitchDeckUrl || !videoPitchUrl) {
      return NextResponse.json(
        { error: 'Final submission requires pitch deck and video.' },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.create({
      data: {
        teamId,
        phase: 'FINAL',
        pitchDeckUrl,
        videoPitchUrl,
        status: 'PENDING',
      },
    });

    await syncSubmissionToSheet({
      id: submission.id,
      teamName: team.teamName,
      phase: 'FINAL',
      status: 'PENDING',
      fileUrl: pitchDeckUrl,
    });

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      message: 'Final submission received. Our team will review it soon.',
    });
  } catch (error) {
    console.error('Final submission error:', error);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
