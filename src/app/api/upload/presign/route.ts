import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getPresignedUrl } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { success } = rateLimit(`upload:${session.user.id}`, 10, 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many upload requests' },
        { status: 429 }
      );
    }

    const { fileName, fileType } = await req.json();

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'fileName and fileType are required' },
        { status: 400 }
      );
    }

    const allowedTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'video/mp4',
      'video/quicktime',
    ];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      );
    }

    const { presignedUrl, publicUrl, path } = await getPresignedUrl(
      fileName,
      fileType
    );

    return NextResponse.json({
      presignedUrl,
      publicUrl,
      path,
    });
  } catch (error) {
    console.error('Presign error:', error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}