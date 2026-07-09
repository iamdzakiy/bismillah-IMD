import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendRejectionEmail } from '@/lib/email';
import { z } from 'zod';

const rejectSchema = z.object({
  notes: z.string().min(10, 'Notes must be at least 10 characters'),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = rejectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Notes are required for rejection' },
        { status: 400 }
      );
    }

    const registration = await prisma.registration.findUnique({
      where: { id: params.id },
      include: {
        team: {
          include: {
            captain: true,
          },
        },
      },
    });

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    await prisma.registration.update({
      where: { id: params.id },
      data: {
        status: 'DOCUMENT_REJECTED',
        adminNote: parsed.data.notes,
      },
    });

    await sendRejectionEmail(
      registration.team!.captain.email,
      registration.team!.captain.name || 'Participant',
      registration.team!.competitionType,
      'Registration',
      parsed.data.notes
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reject registration error:', error);
    return NextResponse.json({ error: 'Rejection failed' }, { status: 500 });
  }
}