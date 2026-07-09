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
    include: {
      registration: true,
      submissions: { orderBy: { createdAt: 'desc' } },
      captain: true,
      members: { include: { user: true } },
    },
  });

  return <DashboardClient session={session} teams={teams} />;
}