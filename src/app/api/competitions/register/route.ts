import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { syncRegistrationToSheet } from '@/lib/google-sheets';

const registerSchema = z.object({
  teamName: z.string().min(3).max(50),
  competitionType: z.enum(['OLYMPIAD', 'SPC', 'NEC']),
  members: z.array(z.object({
    userId: z.string(),
  })).optional(),
  ktmUrl: z.string().url().optional(),
  pdfMergeUrl: z.string().url().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!(session.user as any).active) {
      return NextResponse.json(
        { error: 'Please verify your email first' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { teamName, competitionType, members, ktmUrl, pdfMergeUrl } = parsed.data;
    const educationLevel = (session.user as any).educationLevel || '';

    // Validasi eligibility
    const isSMA = educationLevel === 'SMA';
    const isUniversity = educationLevel === 'S1' || educationLevel === 'S2';

    if ((competitionType === 'OLYMPIAD' || competitionType === 'SPC') && !isSMA) {
      return NextResponse.json(
        { error: 'Olympiad & SPC are only for SMA/sederajat students.' },
        { status: 400 }
      );
    }

    if (competitionType === 'NEC' && !isUniversity) {
      return NextResponse.json(
        { error: 'NEC is only for S1 university students.' },
        { status: 400 }
      );
    }

    // Cek duplikasi tim
    const existingTeam = await prisma.team.findFirst({
      where: {
        captainId: session.user.id,
        competitionType,
      },
    });

    if (existingTeam) {
      return NextResponse.json(
        { error: 'You already registered for this competition.' },
        { status: 400 }
      );
    }

    // Cek nama tim unik
    const existingTeamName = await prisma.team.findUnique({
      where: { teamName },
    });
    if (existingTeamName) {
      return NextResponse.json(
        { error: 'Team name already taken.' },
        { status: 400 }
      );
    }

    // Buat tim
    const team = await prisma.team.create({
      data: {
        teamName,
        competitionType,
        captainId: session.user.id,
        members: {
          create: [
            { userId: session.user.id },
            ...(members || []).map((m) => ({ userId: m.userId })),
          ],
        },
        registration: {
          create: {
            ktmUrl,
            pdfMergeUrl,
            status: ktmUrl && pdfMergeUrl ? 'DOCUMENT_SUBMITTED' : 'PENDING_DOCS',
            currentPhase: 'PRELIMINARY',
            paymentStatus: 'FREE',
          },
        },
      },
      include: {
        captain: true,
        registration: true,
      },
    });

    // Sync ke Google Sheets
    await syncRegistrationToSheet({
      id: team.id,
      teamName: team.teamName,
      competitionType: team.competitionType,
      captainEmail: team.captain.email,
      captainName: team.captain.name,
      institution: (session.user as any).institution,
    });

    return NextResponse.json({
      success: true,
      teamId: team.id,
      message: 'Team registered successfully! Please wait for document approval.',
    });
  } catch (error) {
    console.error('Competition register error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}