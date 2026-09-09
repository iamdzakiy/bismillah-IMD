import { prisma } from '@/lib/db';
import { SemifinalRegistrationsTable } from './_components/SemifinalRegistrationsTable';

export default async function AdminSemifinalRegistrationsPage() {
  const registrations = await prisma.semifinalRegistration.findMany({
    select: {
      id: true,
      status: true,
      adminNote: true,
      paymentProofUrl: true,
      agreedToTerms: true,
      submittedAt: true,
      createdAt: true,
      team: {
        select: {
          teamName: true,
          competitionType: true,
          captain: { select: { email: true, name: true, institution: true } },
          registration: { select: { currentPhase: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Semifinal Re-registrations</h1>
      <p className="text-white/60 mb-8">
        Review and approve the mandatory post-preliminary re-registrations. Approval unlocks each team&apos;s full paper submission.
      </p>
      <SemifinalRegistrationsTable registrations={registrations} />
    </div>
  );
}