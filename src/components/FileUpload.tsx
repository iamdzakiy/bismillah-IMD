'use client';

import { useId, useState } from 'react';

interface FileUploadProps {
  label: string;
  accept?: string;
  onUpload: (url: string) => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export function FileUpload({ label, accept = '.pdf,.png,.jpg,.jpeg', onUpload }: FileUploadProps) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    if (file.size > MAX_FILE_SIZE) {
      setFileName('');
      setError('Maximum file size is 50MB.');
      e.target.value = '';
      return;
    }

    setFileName(file.name);
    setUploading(true);

    try {
      const res = await fetch('/api/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, fileType: file.type, fileSize: file.size }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get upload URL');

      const uploadRes = await fetch(data.presignedUrl, {
        method: data.method || 'PUT',
        body: file,
        headers: { 'Content-Type': data.contentType || file.type },
      });

      if (!uploadRes.ok) throw new Error('Upload failed');

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
          <p className="text-xs text-white/30 mt-1">PDF, PNG, JPG, MP4, or MOV (Max 50MB)</p>
        </label>
      </div>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}
