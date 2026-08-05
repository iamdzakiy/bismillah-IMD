'use client';

import { useState, useRef } from 'react';

interface GuidebookPreviewProps {
  guidebookUrl: string;
  guidebookDownloadUrl: string;
  shortName: string;
  badgeClass: string;
}

export default function GuidebookPreview({
  guidebookUrl,
  guidebookDownloadUrl,
  shortName,
  badgeClass,
}: GuidebookPreviewProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLoad = () => {
    setLoaded(true);
    setFailed(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleError = () => {
    setFailed(true);
    setLoaded(false);
  };

  // If the iframe hasn't loaded after 8 seconds, show fallback
  const handleStartLoad = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!loaded) setFailed(true);
    }, 8000);
  };

  if (!guidebookUrl || guidebookUrl === '#') {
    return (
      <div className="relative w-full rounded-xl overflow-hidden border border-white/10 flex items-center justify-center bg-space-900/80" style={{ height: '500px' }}>
        <div className="text-center p-8">
          <div className="text-6xl mb-4">📄</div>
          <p className="text-white/70 mb-4">Guidebook preview not available</p>
          <a
            href={guidebookDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all border ${badgeClass}`}
          >
            Download PDF Instead
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-white/10" style={{ height: '500px' }}>
      <iframe
        src={guidebookUrl}
        className="absolute inset-0 w-full h-full"
        style={{ border: 'none' }}
        title={`${shortName} Guidebook`}
        onLoad={handleLoad}
        onError={handleError}
        onLoadStart={handleStartLoad}
      />
      {/* Loading state */}
      {!loaded && !failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-space-900/80 backdrop-blur-sm">
          <div className="text-center p-8">
            <div className="inline-block w-10 h-10 border-4 border-white/20 border-t-bio-blue rounded-full animate-spin mb-4" />
            <p className="text-white/70">Loading guidebook preview…</p>
          </div>
        </div>
      )}
      {/* Fallback for when PDF can't load */}
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-space-900/80 backdrop-blur-sm">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-white/70 mb-4">Guidebook preview not available</p>
            <a
              href={guidebookDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all border ${badgeClass}`}
            >
              Download PDF Instead
            </a>
          </div>
        </div>
      )}
    </div>
  );
}