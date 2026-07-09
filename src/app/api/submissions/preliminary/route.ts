import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { isSubmissionOpen } from '@/lib/phase-utils';
import { syncSubmissionToSheet } from '@/lib/google-sheets';

const preliminarySchema = z.object({
  teamId: z.string(),
  proposalUrl: z.string().url().optional(),
  videoPitchUrl: z.string().url().optional(),
  fullPaperUrl: z.string().url().optional(),
  posterUrl: z.string().url().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = preliminarySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { teamId, proposalUrl, videoPitchUrl, fullPaperUrl, posterUrl } = parsed.data;

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

    // Cek apakah dokumen sudah disetujui
    if (team.registration?.status !== 'DOCUMENT_APPROVED') {
      return NextResponse.json(
        { error: 'Your documents have not been approved yet.' },
        { status: 403 }
      );
    }

    // Cek fase
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

    // Validasi file berdasarkan kompetisi
    if (team.competitionType === 'SPC' && (!proposalUrl || !videoPitchUrl)) {
      return NextResponse.json(
        { error: 'SPC requires proposal and video pitch.' },
        { status: 400 }
      );
    }

    if (team.competitionType === 'NEC' && (!fullPaperUrl || !posterUrl)) {
      return NextResponse.json(
        { error: 'NEC requires full paper and infographic poster.' },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.create({
      data: {
        teamId,
        phase: 'PRELIMINARY',
        proposalUrl,
        videoPitchUrl,
        fullPaperUrl,
        posterUrl,
        status: 'PENDING',
      },
      include: { team: true },
    });

    await syncSubmissionToSheet({
      id: submission.id,
      teamName: team.teamName,
      phase: 'PRELIMINARY',
      status: 'PENDING',
      fileUrl: proposalUrl || fullPaperUrl || '',
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