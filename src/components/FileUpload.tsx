'use client';

import { useId, useState } from 'react';
import { parseJsonSafe } from '@/lib/fetch-json';

interface FileUploadProps {
  label: string;
  accept?: string;
  onUpload: (url: string) => void;
  teamId?: string;
  allowedExtensions?: string[];
  allowedMimeTypes?: string[];
  maxSizeMB?: number;
  hint?: string;
}

const DEFAULT_MAX_MB = 5;
const DEFAULT_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg'];
const DEFAULT_MIMES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

export function FileUpload({ label, accept = '.pdf,.png,.jpg,.jpeg', onUpload, teamId, allowedExtensions = DEFAULT_EXTENSIONS, allowedMimeTypes = DEFAULT_MIMES, maxSizeMB = DEFAULT_MAX_MB, hint }: FileUploadProps) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // Validate file type by extension (reliable for docx/video renames)
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    const allowedLower = allowedExtensions.map((x) => x.toLowerCase());
    if (!allowedLower.includes(fileExt)) {
      setFileName('');
      setError(`Only ${allowedExtensions.join(', ').toUpperCase()} files are allowed.`);
      e.target.value = '';
      return;
    }

    // Light mime check: only reject when browser reports a type AND it mismatches.
    // Video family is accepted interchangeably (mp4/webm/quicktime).
    if (file.type && allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(file.type.toLowerCase())) {
      const isVideoFamily =
        file.type.toLowerCase().startsWith('video/') &&
        allowedMimeTypes.some((m) => m.toLowerCase().startsWith('video/'));
      if (!isVideoFamily) {
        setFileName('');
        setError(`File type "${file.type}" is not allowed. Allowed: ${allowedExtensions.join(', ')}`);
        e.target.value = '';
        return;
      }
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setFileName('');
      setError(`Maximum file size is ${maxSizeMB}MB.`);
      e.target.value = '';
      return;
    }

    setFileName(file.name);
    setUploading(true);

    try {
      // Strategy: direct-to-Supabase signed upload (no bytes through Vercel,
      // so large files can't trigger "Request Entity Too Large" HTML that
      // crashes res.json()). Fallback to legacy server upload for small files
      // if signing fails on this deployment.
      const filename = encodeURIComponent(file.name);
      const mime = file.type || 'application/octet-stream';
      const useDirect = file.size > 3.5 * 1024 * 1024;

      if (useDirect) {
        try {
          const signRes = await fetch(`/api/upload/sign?filename=${filename}`, {
            method: 'POST',
          });
          const signData = await parseJsonSafe<{ signedUrl: string; publicUrl: string; path: string }>(signRes);
          if (!signRes.ok) throw new Error((signData as { error?: string }).error || 'Upload failed');

          const putRes = await fetch(signData.signedUrl, {
            method: 'PUT',
            headers: { 'Content-Type': mime },
            body: file,
          });
          if (!putRes.ok) {
            const t = (await putRes.text().catch(() => '')).slice(0, 300);
            throw new Error(t || `Direct upload failed (${putRes.status})`);
          }
          onUpload(signData.publicUrl);
          return;
        } catch (directErr) {
          // Small-file fallback: legacy server upload below. Large files can't
          // use it (Vercel body limit), so rethrow with a clear message.
          if (file.size > 4 * 1024 * 1024) throw directErr;
          console.warn('Direct upload failed, falling back to server upload:', directErr);
        }
      }

      // Upload file directly via raw binary body (server-side upload to Supabase)
      // Avoids Content-Type issues with FormData in middleware
      const res = await fetch(`/api/upload/presign?filename=${filename}`, {
        method: 'POST',
        headers: {
          'Content-Type': mime,
        },
        body: await file.arrayBuffer(),
      });

      const data = await parseJsonSafe<{ publicUrl: string; error?: string }>(res);
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      onUpload(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setFileName('');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-2">{label}</label>
      <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-bio-emerald/50 transition-colors">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id={inputId}
        />
        <label htmlFor={inputId} className="cursor-pointer">
          <svg className="w-10 h-10 mx-auto text-white/30 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-white/70 text-sm font-medium">
            {uploading ? 'Uploading...' : fileName || 'Click to upload'}
          </p>
          <p className="text-xs text-white/30 mt-1">{hint ?? `${allowedExtensions.join(', ').toUpperCase()} (Max ${maxSizeMB}MB)`}</p>
        </label>
      </div>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}