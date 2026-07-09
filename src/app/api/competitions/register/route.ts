import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { syncRegistrationToSheet } from '@/lib/google-sheets';
import type { CompetitionType, User } from '@prisma/client';

const memberSchema = z.object({
  userId: z.string().optional(),
  email: z.string().email().optional(),
});

const registerSchema = z.object({
  teamName: z.string().trim().min(3).max(50),
  competitionType: z.enum(['OLYMPIAD', 'SPC', 'NEC']),
  members: z.array(memberSchema).optional(),
  memberEmails: z.array(z.string().email()).optional(),
  ktmUrl: z.string().url().optional(),
  pdfMergeUrl: z.string().url().optional(),
});

function isEligible(user: Pick<User, 'educationLevel'>, competitionType: CompetitionType) {
  if (competitionType === 'OLYMPIAD' || competitionType === 'SPC') {
    return user.educationLevel === 'SMA';
  }

  if (competitionType === 'NEC') {
    return user.educationLevel === 'S1';
  }

  return false;
}

function validateTeamSize(competitionType: CompetitionType, totalMembers: number) {
  if (competitionType === 'OLYMPIAD') return totalMembers === 1;
  if (competitionType === 'SPC') return totalMembers >= 2 && totalMembers <= 4;
  if (competitionType === 'NEC') return totalMembers >= 1 && totalMembers <= 2;
  return false;
}

function teamSizeMessage(competitionType: CompetitionType) {
  if (competitionType === 'OLYMPIAD') return 'Olympiad is individual only.';
  if (competitionType === 'SPC') return 'SPC requires 2-4 team members.';
  return 'NEC allows 1-2 authors.';
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

    const { teamName, competitionType, members, memberEmails, ktmUrl, pdfMergeUrl } = parsed.data;

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
        ? 'NEC is only for active S1 university students.'
        : 'Olympiad and SPC are only for SMA/sederajat students.';
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const memberIdsFromPayload = (members || [])
      .map((member) => member.userId)
      .filter((value): value is string => Boolean(value));

    const memberEmailsFromPayload = [
      ...(memberEmails || []),
      ...(members || []).map((member) => member.email).filter((value): value is string => Boolean(value)),
    ]
      .map((email) => email.toLowerCase().trim())
      .filter((email) => email && email !== captain.email.toLowerCase());

    const uniqueEmails = [...new Set(memberEmailsFromPayload)];
    const uniqueIds = [...new Set(memberIdsFromPayload.filter((id) => id !== captain.id))];

    const usersByEmail = uniqueEmails.length
      ? await prisma.user.findMany({ where: { email: { in: uniqueEmails } } })
      : [];

    const usersById = uniqueIds.length
      ? await prisma.user.findMany({ where: { id: { in: uniqueIds } } })
      : [];

    const foundEmails = new Set(usersByEmail.map((user) => user.email.toLowerCase()));
    const missingEmails = uniqueEmails.filter((email) => !foundEmails.has(email));
    if (missingEmails.length) {
      return NextResponse.json(
        { error: `These member emails are not registered: ${missingEmails.join(', ')}` },
        { status: 400 }
      );
    }

    const membersMap = new Map<string, User>();
    for (const user of [...usersByEmail, ...usersById]) {
      if (user.id !== captain.id) membersMap.set(user.id, user);
    }

    const memberUsers = [...membersMap.values()];
    const inactiveMembers = memberUsers.filter((user) => !user.active);
    if (inactiveMembers.length) {
      return NextResponse.json(
        { error: `These members have not verified their email: ${inactiveMembers.map((user) => user.email).join(', ')}` },
        { status: 400 }
      );
    }

    const ineligibleMembers = memberUsers.filter((user) => !isEligible(user, competitionType));
    if (ineligibleMembers.length) {
      return NextResponse.json(
        { error: `These members are not eligible for ${competitionType}: ${ineligibleMembers.map((user) => user.email).join(', ')}` },
        { status: 400 }
      );
    }

    const allMemberIds = [captain.id, ...memberUsers.map((user) => user.id)];
    if (!validateTeamSize(competitionType, allMemberIds.length)) {
      return NextResponse.json({ error: teamSizeMessage(competitionType) }, { status: 400 });
    }

    const existingTeamName = await prisma.team.findUnique({ where: { teamName } });
    if (existingTeamName) {
      return NextResponse.json({ error: 'Team name already taken.' }, { status: 400 });
    }

    const conflictingMembers = await prisma.teamMember.findMany({
      where: {
        userId: { in: allMemberIds },
        team: { competitionType },
      },
      include: { user: true, team: true },
    });

    if (conflictingMembers.length) {
      const conflicts = conflictingMembers.map((member) => `${member.user.email} (${member.team.teamName})`);
      return NextResponse.json(
        { error: `Members already registered for ${competitionType}: ${conflicts.join(', ')}` },
        { status: 400 }
      );
    }

    const team = await prisma.team.create({
      data: {
        teamName,
        competitionType,
        captainId: captain.id,
        members: {
          create: allMemberIds.map((userId) => ({ userId })),
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

    await syncRegistrationToSheet({
      id: team.id,
      teamName: team.teamName,
      competitionType: team.competitionType,
      captainEmail: team.captain.email,
      captainName: team.captain.name,
      institution: team.captain.institution,
      status: team.registration?.status,
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
