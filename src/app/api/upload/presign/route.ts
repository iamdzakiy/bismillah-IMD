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
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
    };
    if (!contentType && EXT_TO_MIME[ext]) {
      contentType = EXT_TO_MIME[ext];
    }

    // Validate file type (allow image/jpg alias some browsers send)
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { error: 'Only PDF, JPG, JPEG, and PNG files are allowed.' },
        { status: 400 }
      );
    }
    // Normalise alias for storage
    if (contentType === 'image/jpg') contentType = 'image/jpeg';

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
    if (fileBuffer.byteLength > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Maximum file size is 5MB.' },
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