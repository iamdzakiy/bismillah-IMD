import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { syncRegistrationToSheet } from '@/lib/google-sheets';
import type { CompetitionType, User } from '@prisma/client';

const memberDataSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  institution: z.string().min(1).max(200),
  phone: z.string().min(5).max(20),
  age: z.number().int().min(10).max(99).nullable(),
  shareProofUrl: z.string().url().optional(),
  twibbonProofUrl: z.string().url().optional(),
  groupsProofUrl: z.string().url().optional(),
});

const registerSchema = z.object({
  teamName: z.string().trim().min(3).max(50),
  competitionType: z.enum(['OLYMPIAD', 'SPC', 'NEC']),
  members: z.array(memberDataSchema).min(0).max(2),
  captainPhone: z.string().min(5).max(20),
  captainAge: z.number().int().min(10).max(99),
  ktmUrl: z.string().url().optional(),
  pdfMergeUrl: z.string().url().optional(),
  paymentProofUrl: z.string().url().optional(),
  shareProofUrl: z.string().url().optional(),
  twibbonProofUrl: z.string().url().optional(),
  groupsProofUrl: z.string().url().optional(),
  teacherName: z.string().optional(),
  teacherInstitution: z.string().optional(),
  teacherEmail: z.string().email().optional().or(z.literal('')),
  teacherPhone: z.string().optional(),
});

function isEligible(user: Pick<User, 'educationLevel'>, competitionType: CompetitionType) {
  if (competitionType === 'OLYMPIAD' || competitionType === 'SPC') {
    return user.educationLevel === 'SMA';
  }
  if (competitionType === 'NEC') {
    return user.educationLevel?.startsWith('S1') || user.educationLevel === 'S1 / Diploma';
  }
  return false;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { teamName, competitionType, members, captainPhone, captainAge, ktmUrl, pdfMergeUrl, paymentProofUrl, shareProofUrl, twibbonProofUrl, groupsProofUrl } = parsed.data;

    const captain = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!captain) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!captain.active) {
      return NextResponse.json(
        { error: 'Please verify your email first' },
        { status: 403 }
      );
    }

    if (!isEligible(captain, competitionType)) {
      const message = competitionType === 'NEC'
        ? 'NEC is only for active S1/Diploma university students.'
        : 'MO and SPC are only for SMA/sederajat students.';
      return NextResponse.json({ error: message }, { status: 400 });
    }

    // Chairman info - phone/age required for all competitions
    const memberData = [
      {
        name: captain.name || captain.email,
        email: captain.email,
        institution: captain.institution || '',
        phone: captainPhone || '',
        age: captainAge || null,
        role: 'CHAIRMAN',
      },
      ...members.map((m) => ({
        name: m.name,
        email: m.email,
        institution: m.institution,
        phone: m.phone,
        age: m.age,
        role: 'MEMBER',
      })),
    ];

    if ((competitionType === 'OLYMPIAD' || competitionType === 'NEC') && members.length > 0) {
      return NextResponse.json(
        { error: 'This competition is individual only. No additional members allowed.' },
        { status: 400 }
      );
    }

    if (competitionType === 'SPC' && (members.length < 1 || members.length > 2)) {
      return NextResponse.json(
        { error: 'SPC requires 3 members total (you + 1-2 team members).' },
        { status: 400 }
      );
    }

    const existingTeamName = await prisma.team.findUnique({ where: { teamName } });
    if (existingTeamName) {
      return NextResponse.json({ error: 'Team name already taken.' }, { status: 400 });
    }

    // Create team FIRST to get the real ID
    const team = await prisma.team.create({
      data: {
        teamName,
        competitionType,
        captainId: captain.id,
        memberData: memberData,
        registration: {
          create: {
            ktmUrl,
            pdfMergeUrl,
            paymentProofUrl,
            status: 'PENDING_DOCS',
            currentPhase: 'PRELIMINARY',
            paymentStatus: paymentProofUrl ? 'PENDING' : 'FREE',
            // Denormalized fields for Supabase quick lookup
            competitionType,
            teamName,
            name: captain.name || captain.email,
          },
        },
      },
      include: {
        captain: true,
        registration: true,
      },
    });

    // Sync to Google Sheets with the real team ID
    let googleSheetRow: number | null = null;
    try {
      const sheetRow = await syncRegistrationToSheet({
        id: team.id,
        teamName: team.teamName,
        competitionType: team.competitionType,
        captainId: team.captainId,
        captainEmail: team.captain.email,
        captainName: team.captain.name,
        institution: team.captain.institution,
        status: team.registration?.status,
        members: memberData,
        // Registration model fields
        ktmUrl,
        pdfMergeUrl,
        paymentProofUrl,
        adminNote: team.registration?.adminNote,
        paymentStatus: team.registration?.paymentStatus,
        currentPhase: team.registration?.currentPhase,
        googleSheetRow: team.registration?.googleSheetRow,
        // Proof URLs
        shareProofUrl,
        twibbonProofUrl,
        groupsProofUrl,
        // Timestamps
        teamCreatedAt: team.createdAt,
        teamUpdatedAt: team.updatedAt,
        registrationCreatedAt: team.registration?.createdAt,
        registrationUpdatedAt: team.registration?.updatedAt,
      });
      googleSheetRow = sheetRow ?? null;
    } catch (sheetError) {
      console.warn('Google Sheets sync failed (non-fatal):', sheetError);
    }

    // Update registration with googleSheetRow if we got one
    if (googleSheetRow && team.registration) {
      await prisma.registration.update({
        where: { id: team.registration.id },
        data: { googleSheetRow },
      });
    }

    return NextResponse.json({
      success: true,
      teamId: team.id,
      message: 'Team registered successfully. Please wait for document approval.',
    });
  } catch (error) {
    console.error('Competition register error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}