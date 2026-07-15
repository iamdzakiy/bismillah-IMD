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

    // Get filename from query param or use a default
    const filename = req.nextUrl.searchParams.get('filename') || 'upload';
    const contentType = req.headers.get('content-type') || 'application/octet-stream';

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { error: 'Only PDF, JPG, JPEG, and PNG files are allowed.' },
        { status: 400 }
      );
    }

    // Read raw body as ArrayBuffer
    const fileBuffer = await req.arrayBuffer();

    // Validate file size (5MB max)
    if (fileBuffer.byteLength > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Maximum file size is 5MB.' },
        { status: 400 }
      );
    }

    // Ensure the storage bucket exists before uploading
    await ensureBucketExists();

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
    
    // Give user-friendly message for bucket/key issues
    if (message.toLowerCase().includes('bucket') || message.toLowerCase().includes('not found')) {
      return NextResponse.json({
        error: 'Storage bucket not found. Please check Supabase configuration: ensure SUPABASE_SERVICE_KEY uses the service_role key (not the anon key) and a bucket named "' + getSupabaseBucket() + '" exists in Storage.'
      }, { status: 500 });
    }
    
    return NextResponse.json({ error: message }, { status: 500 });
  }
}