// src/app/api/semifinal/registration/route.ts
// Independent post-preliminary module: fetch & submit a semifinal re-registration.
// This does NOT touch account registration or preliminary submission data.
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const submitSchema = z.object({
  teamId: z.string(),
  paymentProofUrl: z.string().url(),
  agreedToTerms: z.boolean().optional(),
});

// A team is eligible for the semifinal module once its preliminary submission
// has been approved (i.e. it "passed the preliminary phase").
async function hasPassedPreliminary(teamId: string): Promise<boolean> {
  const approved = await prisma.submission.count({
    where: { teamId, phase: 'PRELIMINARY', status: 'APPROVED' },
  });
  return approved > 0;
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const teamId = req.nextUrl.searchParams.get('teamId');
    if (!teamId) {
      return NextResponse.json({ error: 'teamId is required' }, { status: 400 });
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { id: true, captainId: true, competitionType: true, semifinalRegistration: true },
    });

    if (!team) return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    if (team.captainId !== session.user.id) {
      return NextResponse.json({ error: 'Only team captain can access this' }, { status: 403 });
    }

    // Only SPC and NEC teams participate in the semifinal re-registration module.
    if (team.competitionType !== 'SPC' && team.competitionType !== 'NEC') {
      return NextResponse.json({ error: 'Semifinal re-registration only applies to SPC and NEC teams.' }, { status: 403 });
    }

    return NextResponse.json({ success: true, registration: team.semifinalRegistration });
  } catch (error) {
    console.error('Semifinal registration GET error:', error);
    return NextResponse.json({ error: 'Failed to load re-registration' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const { teamId, paymentProofUrl, agreedToTerms } = parsed.data;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { semifinalRegistration: true, registration: true },
    });

    if (!team) return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    if (team.captainId !== session.user.id) {
      return NextResponse.json({ error: 'Only team captain can re-register' }, { status: 403 });
    }

    // Semifinal re-registration only applies to SPC and NEC teams (not MO/Olympiad).
    if (team.competitionType !== 'SPC' && team.competitionType !== 'NEC') {
      return NextResponse.json(
        { error: 'Semifinal re-registration only applies to SPC and NEC teams.' },
        { status: 403 }
      );
    }

    // Gate: only teams that passed the preliminary phase may re-register.
    if (!(await hasPassedPreliminary(teamId))) {
      return NextResponse.json(
        { error: 'Your team has not been advanced past the preliminary phase yet.' },
        { status: 403 }
      );
    }

    const existing = team.semifinalRegistration;

    if (existing && (existing.status === 'PENDING' || existing.status === 'APPROVED')) {
      return NextResponse.json(
        { error: existing.status === 'APPROVED'
            ? 'Your re-registration is already approved.'
            : 'Your re-registration is already under review. Please wait for approval.' },
        { status: 400 }
      );
    }

    // Create on first submission, or re-submit after an admin rejection.
    const registration = existing
      ? await prisma.semifinalRegistration.update({
          where: { id: existing.id },
          data: {
            paymentProofUrl,
            agreedToTerms: agreedToTerms ?? true,
            status: 'PENDING',
            adminNote: null,
            reviewedById: null,
            reviewedAt: null,
            submittedAt: new Date(),
          },
        })
      : await prisma.semifinalRegistration.create({
          data: {
            teamId,
            paymentProofUrl,
            agreedToTerms: agreedToTerms ?? true,
            status: 'PENDING',
            submittedAt: new Date(),
          },
        });

    // Keep the team's registration.currentPhase in sync WITHOUT touching any
    // preliminary submission data except reflecting that they advanced.
    if (team.registration && team.registration.currentPhase !== 'SEMIFINAL') {
      await prisma.registration.update({
        where: { id: team.registration.id },
        data: { currentPhase: 'SEMIFINAL' },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Re-registration submitted! The admin will review it soon.',
      registration,
    });
  } catch (error) {
    console.error('Semifinal registration POST error:', error);
    return NextResponse.json({ error: 'Re-registration failed' }, { status: 500 });
  }
}