// src/app/api/semifinal/submission/route.ts
// Independent post-preliminary module: full paper submission for the semifinal.
// This endpoint is GATED on admin approval of the mandatory re-registration.
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { isSubmissionOpen } from '@/lib/phase-utils';
import { syncSubmissionToSheet } from '@/lib/google-sheets';

const submissionSchema = z.object({
  teamId: z.string(),
  fullPaperUrl: z.string().url().optional(),
  videoPitchUrl: z.string().url().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const parsed = submissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const { teamId, fullPaperUrl, videoPitchUrl } = parsed.data;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { captain: true, semifinalRegistration: true },
    });

    if (!team) return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    if (team.captainId !== session.user.id) {
      return NextResponse.json({ error: 'Only team captain can submit' }, { status: 403 });
    }

    // Full paper submission through this module is only for SPC and NEC teams.
    if (team.competitionType !== 'SPC' && team.competitionType !== 'NEC') {
      return NextResponse.json(
        { error: 'Semifinal full paper submission only applies to SPC and NEC teams.' },
        { status: 403 }
      );
    }

    // === Mandatory gate: admin must have approved the semifinal re-registration ===
    const rereg = team.semifinalRegistration;
    if (!rereg) {
      return NextResponse.json(
        { error: 'You must complete the semifinal re-registration before submitting your full paper.' },
        { status: 403 }
      );
    }
    if (rereg.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Your semifinal re-registration has not been approved yet. Please wait for admin approval.' },
        { status: 403 }
      );
    }

    if (!isSubmissionOpen(team.competitionType, 'semifinal')) {
      return NextResponse.json({ error: 'Semifinal submission period is closed.' }, { status: 400 });
    }

    if (!fullPaperUrl) {
      return NextResponse.json({ error: 'The full paper (PDF) is required.' }, { status: 400 });
    }

    const existing = await prisma.submission.findFirst({
      where: { teamId, phase: 'SEMIFINAL' },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'You already submitted your full paper for the semifinal phase.' },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.create({
      data: {
        teamId,
        phase: 'SEMIFINAL',
        fullPaperUrl,
        videoPitchUrl,
        status: 'PENDING',
      },
    });

    await syncSubmissionToSheet({
      id: submission.id,
      teamId: team.id,
      teamName: team.teamName,
      competitionType: team.competitionType,
      captainEmail: team.captain?.email,
      phase: 'SEMIFINAL',
      status: 'PENDING',
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

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      message: 'Full paper submitted! Our team will review it soon.',
    });
  } catch (error) {
    console.error('Semifinal full paper submission error:', error);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}