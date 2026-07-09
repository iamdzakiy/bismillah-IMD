'use client';

interface StatusBannerProps {
  active: boolean;
}

export function StatusBanner({ active }: StatusBannerProps) {
  if (active) {
    return (
      <div className="mb-8 bg-bio-emerald/10 border border-bio-emerald/50 text-bio-emerald px-6 py-4 rounded-xl flex items-center gap-3">
        <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-medium">Email Verified! You have full access to the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="mb-8 bg-yellow-500/10 border border-yellow-500/50 text-yellow-400 px-6 py-4 rounded-xl flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="font-medium">Please verify your email to access all features.</p>
      </div>
      <a href="/verify-email" className="text-sm font-semibold underline hover:text-yellow-300">
        Verify Now
      </a>
    </div>
  );
}