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

    // Allow approval from PENDING_DOCS (just registered) or DOCUMENT_SUBMITTED (user clicked submit docs)
    if (registration.status !== 'PENDING_DOCS' && registration.status !== 'DOCUMENT_SUBMITTED') {
      return NextResponse.json(
        { error: `Cannot approve registration with status: ${registration.status}. Only PENDING_DOCS or DOCUMENT_SUBMITTED can be approved.` },
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
        new Date().toISOString(), // sync timestamp
        registration.team.id,
        registration.team.teamName,
        registration.team.competitionType,
        registration.team.captainId,
        registration.team.captain.name || '',
        registration.team.captain.email,
        registration.team.captain.institution || '',
        '', // member names (keep empty to not overwrite)
        '', // member emails
        '', // member institutions
        '', // member phones
        '', // member ages
        '', // member proofs
        '', // member roles
        registration.ktmUrl || '',
        registration.pdfMergeUrl || '',
        registration.paymentProofUrl || '',
        'DOCUMENT_APPROVED',
        registration.adminNote || '',
        registration.paymentStatus || 'FREE',
        registration.currentPhase || 'PRELIMINARY',
        registration.googleSheetRow?.toString() || '',
        '', // share proof
        '', // twibbon proof
        '', // groups proof
        registration.team.createdAt.toISOString(),
        registration.team.updatedAt.toISOString(),
        registration.createdAt.toISOString(),
        registration.updatedAt.toISOString(),
        'TRUE', // approved
      ]);
    }

    const emailSent = await sendApprovalEmail(
      registration.team.captain.email,
      registration.team.captain.name || 'Participant',
      registration.team.competitionType,
      'Registration'
    );

    return NextResponse.json({ success: true, emailSent });
  } catch (error) {
    console.error('Approve registration error:', error);
    return NextResponse.json({ error: 'Approval failed' }, { status: 500 });
  }
}