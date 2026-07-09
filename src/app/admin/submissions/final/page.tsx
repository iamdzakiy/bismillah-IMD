import { prisma } from '@/lib/db';
import { SubmissionsTable } from '../_components/SubmissionsTable';

export default async function FinalSubmissionsPage() {
  const submissions = await prisma.submission.findMany({
    where: { phase: 'FINAL' },
    include: {
      team: { include: { captain: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Final Submissions</h1>
      <p className="text-white/60 mb-8">Review final phase submissions</p>
      <SubmissionsTable submissions={submissions} />
    </div>
  );
}