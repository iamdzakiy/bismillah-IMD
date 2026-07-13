// src/app/api/upload/presign/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getPresignedUrl } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
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

    const { teamId, fileName, fileType, fileSize } = await req.json();

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'fileName and fileType are required' },
        { status: 400 }
      );
    }

    // teamId is optional - if provided, verify user is captain
    if (teamId) {
      const team = await prisma.team.findUnique({
        where: { id: teamId, captainId: session.user.id },
      });
      if (!team) {
        return NextResponse.json(
          { error: 'You are not authorized to upload for this team' },
          { status: 403 }
        );
      }
    }

    const allowedTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
    ];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { error: 'Only PDF, JPG, JPEG, and PNG files are allowed.' },
        { status: 400 }
      );
    }
    if (fileSize && fileSize > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Maximum file size is 5MB.' },
        { status: 400 }
      );
    }

    // Pass userId as third argument
    const { presignedUrl, publicUrl, path } = await getPresignedUrl(
      fileName,
      fileType,
      session.user.id
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