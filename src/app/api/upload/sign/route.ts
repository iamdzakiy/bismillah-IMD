// src/app/api/upload/sign/route.ts
// Returns a Supabase signed upload URL so the browser can PUT bytes
// directly to Storage, bypassing Vercel's ~4.5MB serverless body limit.
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createSignedUploadUrl, ensureBucketExists } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_EXTS = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.mp4', '.mov', '.webm'];

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { success } = rateLimit(`upload-sign:${session.user.id}`, 20, 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: 'Too many upload requests' }, { status: 429 });
    }

    const rawFilename = req.nextUrl.searchParams.get('filename') || 'upload';
    let filename = rawFilename;
    try {
      filename = decodeURIComponent(rawFilename);
    } catch {
      filename = rawFilename;
    }
    const ext = '.' + (filename.split('.').pop() || '').toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      return NextResponse.json(
        { error: 'Only PDF, DOC/DOCX, JPG, JPEG, PNG, MP4, MOV, and WEBM files are allowed.' },
        { status: 400 }
      );
    }

    try {
      await ensureBucketExists();
    } catch (e) {
      console.warn('ensureBucketExists skipped:', e instanceof Error ? e.message : e);
    }

    const { path, signedUrl, publicUrl } = await createSignedUploadUrl(
      filename,
      session.user.id
    );

    return NextResponse.json({ path, signedUrl, publicUrl });
  } catch (error) {
    console.error('Sign upload error:', error);
    const message = error instanceof Error ? error.message : 'Failed to sign upload';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
