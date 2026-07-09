import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-space-900 text-white flex">
      <aside className="w-64 bg-space-800 border-r border-space-700 p-6 hidden md:block">
        <Link href="/admin/dashboard" className="text-xl font-bold text-gradient mb-8 block">
          IMD Admin
        </Link>
        <nav className="space-y-2">
          <Link href="/admin/dashboard" className="block px-4 py-2 rounded-lg hover:bg-white/5 text-white/70 text-sm">
            📊 Overview
          </Link>
          <Link href="/admin/registrations" className="block px-4 py-2 rounded-lg hover:bg-white/5 text-white/70 text-sm">
            👥 Registrations
          </Link>
          <div className="pt-4 pb-2 px-4 text-xs text-white/30 uppercase tracking-wider">
            Submissions
          </div>
          <Link href="/admin/submissions/preliminary" className="block px-4 py-2 rounded-lg hover:bg-white/5 text-white/70 text-sm">
            📝 Preliminary
          </Link>
          <Link href="/admin/submissions/semifinal" className="block px-4 py-2 rounded-lg hover:bg-white/5 text-white/70 text-sm">
            🏆 Semifinal
          </Link>
          <Link href="/admin/submissions/final" className="block px-4 py-2 rounded-lg hover:bg-white/5 text-white/70 text-sm">
            🎖️ Final
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}