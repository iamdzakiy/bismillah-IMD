import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import  sendApprovalEmail  from '@/lib/email';
import { syncRegistrationToSheet } from '@/lib/google-sheets';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    if (!registration?.team) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    if (registration.status !== 'DOCUMENT_SUBMITTED') {
      return NextResponse.json(
        { error: 'Only submitted documents can be approved.' },
        { status: 400 }
      );
    }

    await prisma.registration.update({
      where: { id: params.id },
      data: {
        status: 'DOCUMENT_APPROVED',
        adminNote: null,
      },
    });

    await syncRegistrationToSheet({
      id: registration.teamId,
      teamName: registration.team.teamName,
      competitionType: registration.team.competitionType,
      captainEmail: registration.team.captain.email,
      captainName: registration.team.captain.name,
      institution: registration.team.captain.institution,
      status: 'DOCUMENT_APPROVED',
    });

    await sendApprovalEmail(
      registration.team.captain.email,
      registration.team.captain.name || 'Participant',
      registration.team.competitionType,
      'Registration'
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Approve registration error:', error);
    return NextResponse.json({ error: 'Approval failed' }, { status: 500 });
  }
}
