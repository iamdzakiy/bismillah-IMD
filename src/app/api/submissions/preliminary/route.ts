// src/app/api/submissions/preliminary/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { isSubmissionOpen } from '@/lib/phase-utils';
import { syncSubmissionToSheet } from '@/lib/google-sheets';

const preliminarySchema = z.object({
  teamId: z.string(),
  fileUrl: z.string().url().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const parsed = preliminarySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { teamId, fileUrl } = parsed.data;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        registration: true,
        captain: true,
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

    // Check that documents are approved
    if (team.registration?.status !== 'DOCUMENT_APPROVED') {
      return NextResponse.json(
        { error: 'Your documents have not been approved yet.' },
        { status: 403 }
      );
    }

    // Check phase
    if (!isSubmissionOpen(team.competitionType, 'preliminary')) {
      return NextResponse.json(
        { error: 'Preliminary submission period is closed.' },
        { status: 400 }
      );
    }

    const existing = await prisma.submission.findFirst({
      where: { teamId, phase: 'PRELIMINARY' },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'You already submitted for preliminary phase.' },
        { status: 400 }
      );
    }

    // For Olympiad, no file upload is required – handled separately
    if (team.competitionType === 'OLYMPIAD') {
      return NextResponse.json(
        { error: 'Olympiad preliminary is exam-based; no file submission needed.' },
        { status: 400 }
      );
    }

    // For SPC and NEC, file is required
    if (!fileUrl) {
      return NextResponse.json(
        { error: 'File submission is required.' },
        { status: 400 }
      );
    }

    // Store fileUrl in proposalUrl (SPC) or fullPaperUrl (NEC) based on competition type
    const submission = await prisma.submission.create({
      data: {
        teamId,
        phase: 'PRELIMINARY',
        proposalUrl: team.competitionType === 'SPC' ? fileUrl : null,
        fullPaperUrl: team.competitionType === 'NEC' ? fileUrl : null,
        status: 'PENDING',
      },
      include: { team: true },
    });

    await syncSubmissionToSheet({
      id: submission.id,
      teamName: team.teamName,
      phase: 'PRELIMINARY',
      status: 'PENDING',
      fileUrl,
    });

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      message: 'Preliminary submission received! Our team will review it soon.',
    });
  } catch (error) {
    console.error('Preliminary submission error:', error);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
