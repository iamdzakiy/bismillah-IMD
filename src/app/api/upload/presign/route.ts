// src/app/api/upload/presign/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadFile, getSupabaseBucket, ensureBucketExists } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit per user
    const { success } = rateLimit(`upload:${session.user.id}`, 10, 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many upload requests' },
        { status: 429 }
      );
    }

    // Get filename from query param or use a default (client sends encodeURIComponent(name))
    const rawFilename = req.nextUrl.searchParams.get('filename') || 'upload';
    let filename = rawFilename;
    try {
      filename = decodeURIComponent(rawFilename);
    } catch {
      filename = rawFilename;
    }
    // Content-Type header doubles as the raw binary body's mime. Some browsers
    // send an empty string (e.g. renamed files), so fall back to the extension.
    let contentType = req.headers.get('content-type') || '';
    // Next.js may append charset (e.g. "application/pdf; charset=utf-8") — strip it.
    contentType = contentType.split(';')[0].trim().toLowerCase();
    const ext = '.' + (filename.split('.').pop() || '').toLowerCase();
    const EXT_TO_MIME: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.mp4': 'video/mp4',
      '.mov': 'video/quicktime',
      '.webm': 'video/webm',
    };
    if (!contentType && EXT_TO_MIME[ext]) {
      contentType = EXT_TO_MIME[ext];
    }

    // Validate file type (allow image/jpg alias some browsers send).
    // DOCX + video extensions added for SPC semifinal (full paper + elevator pitch).
    // NOTE: video uploads via this endpoint are capped at 50MB; prefer a YouTube/Drive
    // link for larger elevator-pitch videos (no code change needed — it's just a URL field).
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/octet-stream', // fallback when browser sends no mime (we trust extension below)
      'image/png',
      'image/jpeg',
      'image/jpg',
      'video/mp4',
      'video/webm',
      'video/quicktime',
    ];
    const looksLikeDocx =
      ext === '.docx' &&
      (contentType === 'application/zip' ||
        contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    if (!allowedTypes.includes(contentType) && !looksLikeDocx) {
      return NextResponse.json(
        { error: 'Only PDF, DOC/DOCX, JPG, JPEG, PNG, MP4, MOV, and WEBM files are allowed.' },
        { status: 400 }
      );
    }
    // Normalise aliases for storage
    if (contentType === 'image/jpg') contentType = 'image/jpeg';
    if (contentType === 'application/octet-stream' && EXT_TO_MIME[ext]) contentType = EXT_TO_MIME[ext];
    if (contentType === 'application/zip' && ext === '.docx') {
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    // Read raw body as ArrayBuffer
    const fileBuffer = await req.arrayBuffer();

    // Validate file size (5MB max) and non-empty body (empty body = client sent
    // no bytes, which previously surfaced as a cryptic Supabase error).
    if (!fileBuffer || fileBuffer.byteLength === 0) {
      return NextResponse.json(
        { error: 'Empty file received. Please re-select the receipt and try again.' },
        { status: 400 }
      );
    }
    // Validate file size: 5MB default, 10MB for documents, 50MB for video.
    // (Route-level; the FileUpload component enforces the same caps client-side.)
    const isVideo = contentType.startsWith('video/') || ['.mp4', '.mov', '.webm'].includes(ext);
    const isDoc = ['.pdf', '.doc', '.docx'].includes(ext);
    const maxBytes = isVideo ? 50 * 1024 * 1024 : isDoc ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    const maxLabel = isVideo ? '50MB' : isDoc ? '10MB' : '5MB';
    if (fileBuffer.byteLength > maxBytes) {
      return NextResponse.json(
        { error: `Maximum file size is ${maxLabel}.` },
        { status: 400 }
      );
    }

    // Ensure the storage bucket exists before uploading. Wrapped so a key
    // without admin rights (e.g. publishable/anon) doesn't block the upload
    // when the bucket already exists — the upload itself is attempted anyway.
    try {
      await ensureBucketExists();
    } catch (e) {
      console.warn('ensureBucketExists skipped:', e instanceof Error ? e.message : e);
    }

    // Upload file directly to Supabase using service key
    const { publicUrl } = await uploadFile(
      filename,
      contentType,
      session.user.id,
      fileBuffer
    );

    return NextResponse.json({
      publicUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'Failed to upload file';
    
    // Give user-friendly message for bucket/key/auth issues (wrong key type,
    // missing bucket, RLS). The current .env uses an sb_publishable_ key which
    // cannot listBuckets/createBucket/upload — needs the service_role key.
    const lower = message.toLowerCase();
    if (lower.includes('bucket') || lower.includes('not found')) {
      return NextResponse.json({
        error: 'Storage bucket not found. Please check Supabase configuration: ensure SUPABASE_SERVICE_KEY uses the service_role key (not the anon/publishable key) and a bucket named "' + getSupabaseBucket() + '" exists in Storage.'
      }, { status: 500 });
    }
    if (lower.includes('invalid api key') || lower.includes('jwt') || lower.includes('unauthorized') || lower.includes('permission') || lower.includes('row-level security') || lower.includes('violates row')) {
      return NextResponse.json({
        error: 'Storage upload rejected by Supabase (' + message + '). Fix: set SUPABASE_SERVICE_KEY to the service_role key (Dashboard -> Project Settings -> API -> service_role, NOT sb_publishable_/anon), and make the "' + getSupabaseBucket() + '" bucket Public.'
      }, { status: 500 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}