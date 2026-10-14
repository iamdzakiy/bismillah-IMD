import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { isFinalSubmissionOpen } from '@/lib/phase-utils';
import { syncSubmissionToSheet } from '@/lib/google-sheets';

// Final materials differ per track (see constants.ts / competition pages):
// - NEC: pitch deck + poster (digital poster).
// - SPC: mockup, statement letter (surat pernyataan), infographic, logbook,
//        and pitch deck.
// All fields arrive as uploaded URLs; required-ness is enforced per
// competitionType after the team is loaded.
const finalSchema = z.object({
  teamId: z.string(),
  pitchDeckUrl: z.string().url().optional(),
  posterUrl: z.string().url().optional(),
  mockupUrl: z.string().url().optional(),
  statementUrl: z.string().url().optional(),
  infographicUrl: z.string().url().optional(),
  logbookUrl: z.string().url().optional(),
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

    const { teamId, pitchDeckUrl, posterUrl, mockupUrl, statementUrl, infographicUrl, logbookUrl } =
      parsed.data;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        registration: true,
        captain: true,
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

    if (!isFinalSubmissionOpen(team.competitionType)) {
      return NextResponse.json(
        { error: 'Final submission period is closed.' },
        { status: 400 }
      );
    }

    const existing = await prisma.submission.findFirst({
      where: { teamId, phase: 'FINAL' },
    });
    // Block only when there is nothing to fix: a PENDING/APPROVED final
    // submission stands, but a REJECTED one must be resubmittable.
    if (existing && existing.status !== 'REJECTED') {
      return NextResponse.json(
        { error: 'You already submitted for final phase.' },
        { status: 400 }
      );
    }

    // Per-track required fields. OLYMPIAD finals are onsite (no online upload),
    // but if an OLYMPIAD team ever hits this route, require pitch deck only.
    const isSPC = team.competitionType === 'SPC';
    const isNEC = team.competitionType === 'NEC';

    if (isSPC) {
      const missing = [
        !pitchDeckUrl && 'pitchDeckUrl',
        !mockupUrl && 'mockupUrl',
        !statementUrl && 'statementUrl',
        !infographicUrl && 'infographicUrl',
        !logbookUrl && 'logbookUrl',
      ].filter(Boolean);
      if (missing.length > 0) {
        return NextResponse.json(
          {
            error:
              'SPC final submission requires: pitch deck, mockup, statement letter (surat pernyataan), infographic, and logbook.',
            missing,
          },
          { status: 400 }
        );
      }
    } else if (isNEC) {
      const missing = [!pitchDeckUrl && 'pitchDeckUrl', !posterUrl && 'posterUrl'].filter(Boolean);
      if (missing.length > 0) {
        return NextResponse.json(
          { error: 'NEC final submission requires both pitch deck and poster.', missing },
          { status: 400 }
        );
      }
    } else if (!pitchDeckUrl) {
      return NextResponse.json(
        { error: 'Final submission requires a pitch deck.' },
        { status: 400 }
      );
    }

    const submission = existing
      ? await prisma.submission.update({
          where: { id: existing.id },
          data: {
            pitchDeckUrl,
            posterUrl,
            mockupUrl,
            statementUrl,
            infographicUrl,
            logbookUrl,
            status: 'PENDING',
            notes: null,
            reviewedById: null,
            reviewedAt: null,
          },
        })
      : await prisma.submission.create({
          data: {
            teamId,
            phase: 'FINAL',
            pitchDeckUrl,
            posterUrl,
            mockupUrl,
            statementUrl,
            infographicUrl,
            logbookUrl,
            status: 'PENDING',
          },
        });

    await syncSubmissionToSheet({
      id: submission.id,
      teamId: team.id,
      teamName: team.teamName,
      competitionType: team.competitionType,
      captainEmail: team.captain?.email,
      phase: 'FINAL',
      status: 'PENDING',
      proposalUrl: submission.proposalUrl,
      videoPitchUrl: submission.videoPitchUrl,
      fullPaperUrl: submission.fullPaperUrl,
      posterUrl: submission.posterUrl,
      pitchDeckUrl: submission.pitchDeckUrl,
      mockupUrl: submission.mockupUrl,
      statementUrl: submission.statementUrl,
      infographicUrl: submission.infographicUrl,
      logbookUrl: submission.logbookUrl,
      notes: submission.notes,
      reviewedById: submission.reviewedById,
      reviewedAt: submission.reviewedAt,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
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
