import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { DashboardClient } from './_components/DashboardClient';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const teams = await prisma.team.findMany({
    where: {
      members: { some: { userId: session.user.id } },
    },
    select: {
      id: true,
      teamName: true,
      competitionType: true,
      captainId: true,
      registration: {
        select: {
          id: true,
          status: true,
          currentPhase: true,
          adminNote: true,
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
        },
      },
      captain: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      members: {
        select: {
          id: true,
          userId: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return <DashboardClient session={session} teams={teams} />;
}
