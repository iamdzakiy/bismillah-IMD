import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { DashboardClient } from './_components/DashboardClient';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  if (!session?.user?.email) return null;

  // Participant + shareable credential (only ever sent to the client when the
  // card below is rendered; `select` avoids dragging password hashes /
  // realPassword into the payload at all).
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      credential: {
        select: { password: true, fileUrl: true },
      },
    },
  });
  if (!user) return null;

  // Team used to gate the "Informasi Akun Peserta" card: the participant may be
  // the captain OR any member listed in memberData (JSONB array of objects
  // containing `email`), so both lookups are OR-ed. No Registration status check
  // is required for this card.
  const credentialTeam = await prisma.team.findFirst({
    where: {
      OR: [
        { captainId: user.id },
        { memberData: { array_contains: [{ email: user.email }] } },
      ],
    },
    select: { id: true, competitionType: true },
  });

  const showCredential =
    !!credentialTeam && credentialTeam.competitionType === 'OLYMPIAD';

  // Since TeamMember is removed, teams are found by captainId
  const teams = await prisma.team.findMany({
    where: {
      captainId: session.user.id,
    },
    select: {
      id: true,
      teamName: true,
      competitionType: true,
      captainId: true,
      memberData: true,
      registration: {
        select: {
          id: true,
          status: true,
          currentPhase: true,
          adminNote: true,
          paymentProofUrl: true,
        },
      },
      submissions: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          phase: true,
          status: true,
          notes: true,
          proposalUrl: true,
          videoPitchUrl: true,
          fullPaperUrl: true,
          posterUrl: true,
          pitchDeckUrl: true,
          mockupUrl: true,
          statementUrl: true,
          infographicUrl: true,
          logbookUrl: true,
        },
      },
      captain: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Transform memberData from JSON to the expected array format
  const transformedTeams = teams.map((team) => {
    const memberData = team.memberData as Array<{
      name: string;
      email: string;
      institution: string;
      phone: string;
      age: number | null;
      studentProofUrl: string | null;
      role: string;
    }> | null;

    const members = (memberData || []).map((m, idx) => ({
      id: `member-${idx}`,
      userId: team.captainId, // All members belong to captain's team
      user: {
        id: team.captainId,
        name: m.name,
        email: m.email,
        institution: m.institution,
        phone: m.phone,
        age: m.age,
        studentProofUrl: m.studentProofUrl,
        role: m.role,
      },
    }));

    return {
      ...team,
      members,
      memberData: undefined, // Remove raw JSON
    };
  });

  return (
    <DashboardClient
      session={session}
      teams={transformedTeams as any}
      user={{ email: user.email, credential: user.credential }}
      showCredential={showCredential}
    />
  );
}