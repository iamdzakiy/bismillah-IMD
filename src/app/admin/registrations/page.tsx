import { prisma } from '@/lib/db';
import Link from 'next/link';

export default async function AdminRegistrationsPage() {
  const registrations = await prisma.registration.findMany({
    include: {
      team: {
        include: {
          captain: true,
          members: { include: { user: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Registrations</h1>
      <p className="text-white/60 mb-8">Manage team registrations and approve/reject documents</p>

      <div className="glass-dark rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Team Name</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Competition</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Captain</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Members</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Docs Status</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => {
              const statusColors = {
                PENDING_DOCS: 'bg-yellow-500/10 text-yellow-400',
                DOCUMENT_SUBMITTED: 'bg-blue-500/10 text-blue-400',
                DOCUMENT_APPROVED: 'bg-emerald-500/10 text-emerald-400',
                DOCUMENT_REJECTED: 'bg-red-500/10 text-red-400',
                REGISTERED: 'bg-green-500/10 text-green-400',
              };
              const statusLabel = reg.status.replace('_', ' ');

              return (
                <tr key={reg.id} className="border-t border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-white font-medium">{reg.team?.teamName || 'N/A'}</td>
                  <td className="px-4 py-3 text-white/70">{reg.team?.competitionType || 'N/A'}</td>
                  <td className="px-4 py-3 text-white/70">{reg.team?.captain?.email || 'N/A'}</td>
                  <td className="px-4 py-3 text-white/70">{reg.team?.members?.length || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${statusColors[reg.status]}`}>
                      {statusLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {reg.status === 'DOCUMENT_SUBMITTED' && (
                      <div className="flex gap-2">
                        <form action={`/api/admin/registrations/${reg.id}/approve`} method="POST">
                          <button type="submit" className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded">
                            Approve
                          </button>
                        </form>
                        <form action={`/api/admin/registrations/${reg.id}/reject`} method="POST">
                          <button type="submit" className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded">
                            Reject
                          </button>
                        </form>
                      </div>
                    )}
                    {reg.status === 'DOCUMENT_APPROVED' && (
                      <span className="text-xs text-bio-emerald">✅ Approved</span>
                    )}
                    {reg.status === 'DOCUMENT_REJECTED' && (
                      <span className="text-xs text-red-400">❌ Rejected</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {registrations.length === 0 && (
          <p className="text-center py-8 text-white/40">No registrations yet.</p>
        )}
      </div>
    </div>
  );
}