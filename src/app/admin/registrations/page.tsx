import { prisma } from '@/lib/db';
import { RegistrationsTable } from './_components/RegistrationsTable';

export default async function AdminRegistrationsPage() {
  const registrations = await prisma.registration.findMany({
    select: {
      id: true,
      status: true,
      adminNote: true,
      ktmUrl: true,
      pdfMergeUrl: true,
      paymentProofUrl: true,
      googleSheetRow: true,
      team: {
        select: {
          teamName: true,
          competitionType: true,
          memberData: true,
          captain: { select: { email: true, name: true, institution: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Registrations</h1>
      <p className="text-white/60 mb-8">Manage team registrations and approve/reject documents</p>
      <RegistrationsTable registrations={registrations as any} />
    </div>
  );
}