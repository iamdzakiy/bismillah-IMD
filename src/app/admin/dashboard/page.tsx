import { prisma } from '@/lib/db';

export default async function AdminDashboardPage() {
  const [totalUsers, totalTeams, pendingDocs, approvedDocs, pendingSubs, approvedSubs] =
    await Promise.all([
      prisma.user.count(),
      prisma.team.count(),
      prisma.registration.count({ where: { status: 'DOCUMENT_SUBMITTED' } }),
      prisma.registration.count({ where: { status: 'DOCUMENT_APPROVED' } }),
      prisma.submission.count({ where: { status: 'PENDING' } }),
      prisma.submission.count({ where: { status: 'APPROVED' } }),
    ]);

  const teamsByCompetition = await prisma.team.groupBy({
    by: ['competitionType'],
    _count: { competitionType: true },
  });

  const stats = [
    { label: 'Total Users', value: totalUsers, color: 'cyan' },
    { label: 'Total Teams', value: totalTeams, color: 'emerald' },
    { label: 'Pending Docs', value: pendingDocs, color: 'yellow' },
    { label: 'Approved Docs', value: approvedDocs, color: 'green' },
    { label: 'Pending Submissions', value: pendingSubs, color: 'orange' },
    { label: 'Approved Submissions', value: approvedSubs, color: 'emerald' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-white/60 mb-8">Overview of IMD 2026 statistics</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-dark rounded-xl p-6">
            <p className="text-sm text-white/60 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-dark rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Teams by Competition</h2>
        <div className="space-y-3">
          {teamsByCompetition.map((item) => (
            <div key={item.competitionType} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
              <span className="text-white/70">{item.competitionType}</span>
              <span className="text-bio-emerald font-semibold">{item._count.competitionType} teams</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}