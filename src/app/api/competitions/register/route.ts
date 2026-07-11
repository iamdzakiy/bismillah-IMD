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
  studentProofUrl: z.string().url().optional(),
  shareProofUrl: z.string().url().optional(),
  twibbonProofUrl: z.string().url().optional(),
  groupsProofUrl: z.string().url().optional(),
});

const registerSchema = z.object({
  teamName: z.string().trim().min(3).max(50),
  competitionType: z.enum(['OLYMPIAD', 'SPC', 'NEC']),
  members: z.array(memberDataSchema).min(0).max(4),
  ktmUrl: z.string().url().optional(),
  pdfMergeUrl: z.string().url().optional(),
  paymentProofUrl: z.string().url().optional(),
  shareProofUrl: z.string().url().optional(),
  twibbonProofUrl: z.string().url().optional(),
  groupsProofUrl: z.string().url().optional(),
});

function isEligible(user: Pick<User, 'educationLevel'>, competitionType: CompetitionType) {
  // MO (Olympiad) and SPC for SMA/sederajat only
  if (competitionType === 'OLYMPIAD' || competitionType === 'SPC') {
    return user.educationLevel === 'SMA';
  }
  // NEC for S1/Diploma sederajat only (NO S2/S3)
  if (competitionType === 'NEC') {
    return user.educationLevel?.startsWith('S1') || user.educationLevel === 'S1';
  }
  return false;
}

function validateTeamSize(competitionType: CompetitionType, totalMembers: number) {
  // MO (Olympiad) = individual only, no members
  if (competitionType === 'OLYMPIAD') return totalMembers === 1; // only captain
  // SPC = 2-4 members (captain + 1-3 others)
  if (competitionType === 'SPC') return totalMembers >= 1 && totalMembers <= 4;
  // NEC = individual only (MO type for uni)
  if (competitionType === 'NEC') return totalMembers === 1; // only captain, individual
  return false;
}

function teamSizeMessage(competitionType: CompetitionType) {
  if (competitionType === 'OLYMPIAD') return 'MO is individual only (1 person).';
  if (competitionType === 'SPC') return 'SPC requires 2-4 team members.';
  return 'NEC is individual only (1 person).';
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

    const { teamName, competitionType, members, ktmUrl, pdfMergeUrl, paymentProofUrl, shareProofUrl, twibbonProofUrl, groupsProofUrl } = parsed.data;

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

    // Build memberData including captain as first entry
    // MO = individual (captain only, no additional members)
    // SPC = team of 2-4 (captain + 1-3 members)
    // NEC = individual (captain only, no additional members)
    const memberData = [
      {
        name: captain.name || captain.email,
        email: captain.email,
        institution: captain.institution || '',
        phone: '',
        age: null,
        studentProofUrl: ktmUrl || null,
        role: 'CHAIRMAN',
      },
      ...members.map((m) => ({
        name: m.name,
        email: m.email,
        institution: m.institution,
        phone: m.phone,
        age: m.age,
        studentProofUrl: m.studentProofUrl || null,
        role: 'MEMBER',
      })),
    ];

    // For MO and NEC, no additional members allowed
    if ((competitionType === 'OLYMPIAD' || competitionType === 'NEC') && members.length > 0) {
      return NextResponse.json(
        { error: 'This competition is individual only. No additional members allowed.' },
        { status: 400 }
      );
    }

    // For SPC, members are allowed
    if (competitionType === 'SPC' && (members.length < 1 || members.length > 3)) {
      return NextResponse.json(
        { error: 'SPC requires 2-4 members total (you + 1-3 team members).' },
        { status: 400 }
      );
    }

    const existingTeamName = await prisma.team.findUnique({ where: { teamName } });
    if (existingTeamName) {
      return NextResponse.json({ error: 'Team name already taken.' }, { status: 400 });
    }

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
          },
        },
      },
      include: {
        captain: true,
        registration: true,
      },
    });

    // Sync to Google Sheets with all proof fields
    await syncRegistrationToSheet({
      id: team.id,
      teamName: team.teamName,
      competitionType: team.competitionType,
      captainEmail: team.captain.email,
      captainName: team.captain.name,
      institution: team.captain.institution,
      status: team.registration?.status,
      members: memberData,
      paymentProof: paymentProofUrl,
      shareProofUrl,
      twibbonProofUrl,
      groupsProofUrl,
    });

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