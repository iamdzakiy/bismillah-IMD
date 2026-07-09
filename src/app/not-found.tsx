import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-space-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-gradient mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-white/60 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="btn-glow">
          Back to Home
        </Link>
      </div>
    </div>
  );
}