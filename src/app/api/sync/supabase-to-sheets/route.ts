// src/app/api/sync/supabase-to-sheets/route.ts
// This endpoint receives webhooks from Supabase (when a table row changes)
// and syncs the changes to Google Sheets, and vice-versa.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { appendToSheet, updateSheetRow } from '@/lib/google-sheets';

export async function POST(req: Request) {
  try {
    // Verify webhook secret
    const authHeader = req.headers.get('authorization');
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { table, type, record, old_record } = body;

    // Only handle relevant tables
    if (table === 'registrations') {
      if (type === 'INSERT') {
        // New registration created in Supabase - add to Google Sheets
        const team = await prisma.team.findUnique({
          where: { id: record.team_id },
          include: { captain: true },
        });
        if (team) {
          await appendToSheet('Registrations', [
            new Date().toISOString(),
            team.id,
            team.teamName,
            team.competitionType,
            team.captain.name || '',
            team.captain.email,
            team.captain.institution || '',
            record.status || 'PENDING',
          ]);
        }
      } else if (type === 'UPDATE') {
        // Registration updated in Supabase - update Google Sheets
        if (record.google_sheet_row) {
          await updateSheetRow('Registrations', record.google_sheet_row, [
            new Date().toISOString(),
            record.id,
            record.team_name || '',
            record.competition_type || '',
            record.status || 'PENDING',
          ]);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Sync webhook error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}