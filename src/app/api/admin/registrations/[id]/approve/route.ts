import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendApprovalEmail }  from '@/lib/email';
import { updateSheetRow } from '@/lib/google-sheets';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const registration = await prisma.registration.findUnique({
      where: { id },
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
      where: { id },
      data: {
        status: 'DOCUMENT_APPROVED',
        adminNote: null,
      },
    });

    // Sync to Google Sheets - update the status row
    if (registration.googleSheetRow) {
      await updateSheetRow('Registrations', registration.googleSheetRow, [
        registration.createdAt.toISOString(),
        registration.id,
        registration.team.teamName,
        registration.team.competitionType,
        registration.team.captain.name || '',
        registration.team.captain.email,
        registration.team.captain.institution || '',
        '', // member names (keep empty to not overwrite)
        '', // member emails
        '', // member institutions
        '', // member phones
        '', // member ages
        '', // member proofs
        registration.paymentProofUrl || '',
        '', // share proof
        '', // twibbon proof
        '', // groups proof
        'DOCUMENT_APPROVED',
        'TRUE', // approved
      ]);
    }

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