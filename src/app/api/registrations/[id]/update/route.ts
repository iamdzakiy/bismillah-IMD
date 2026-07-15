// src/app/api/registrations/[id]/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { updateSheetRow } from '@/lib/google-sheets';

const updateSchema = z.object({
  pdfMergeUrl: z.string().url().optional(),
  status: z.enum(['PENDING_DOCS', 'DOCUMENT_SUBMITTED']).optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { pdfMergeUrl, status } = parsed.data;

    // Find the registration with team info
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

    // Verify user is the captain
    if (registration.team.captainId !== session.user.id) {
      return NextResponse.json({ error: 'Only team captain can update registration' }, { status: 403 });
    }

    // Only allow updates if registration is in PENDING_DOCS or DOCUMENT_REJECTED status
    if (registration.status !== 'PENDING_DOCS' && registration.status !== 'DOCUMENT_REJECTED') {
      return NextResponse.json(
        { error: `Cannot update registration with status: ${registration.status}. Only PENDING_DOCS or DOCUMENT_REJECTED can be updated.` },
        { status: 400 }
      );
    }

    // Update registration
    const updateData: any = {};
    if (pdfMergeUrl !== undefined) updateData.pdfMergeUrl = pdfMergeUrl;
    if (status !== undefined) updateData.status = status;

    const updatedRegistration = await prisma.registration.update({
      where: { id },
      data: updateData,
      include: { team: true },
    });

    // Sync to Google Sheets if needed
    if (registration.googleSheetRow && status === 'DOCUMENT_SUBMITTED') {
      try {
        await updateSheetRow('Registrations', registration.googleSheetRow, [
          registration.createdAt.toISOString(),
          registration.id,
          registration.team.teamName,
          registration.team.competitionType,
          registration.team.captain.name || '',
          registration.team.captain.email,
          registration.team.captain.institution || '',
          '', // member names
          '', // member emails
          '', // member institutions
          '', // member phones
          '', // member ages
          '', // member proofs
          '', // payment proof
          '', // share proof
          '', // twibbon proof
          '', // groups proof
          'DOCUMENT_SUBMITTED',
          'FALSE', // not yet approved
        ]);
      } catch (sheetError) {
        console.warn('Google Sheets sync failed (non-fatal):', sheetError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Registration updated successfully',
      registration: updatedRegistration,
    });
  } catch (error) {
    console.error('Registration update error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}