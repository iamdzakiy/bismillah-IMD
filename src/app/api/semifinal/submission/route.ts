// src/app/api/semifinal/submission/route.ts
// Independent post-preliminary module: full paper submission for the semifinal.
// This endpoint is GATED on admin approval of the mandatory re-registration.
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { syncSubmissionToSheet } from '@/lib/google-sheets';

const submissionSchema = z.object({
  teamId: z.string(),
  // Full Paper: URL hasil upload Supabase (PDF/DOCX). Validasi ekstensi dilakukan di bawah.
  fullPaperUrl: z.string().url().optional(),
  // Elevator Pitch (SPC only): URL video YouTube/Drive ATAU URL file hasil upload (mp4/mov/webm).
  videoPitchUrl: z.string().url().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const parsed = submissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const { teamId, fullPaperUrl, videoPitchUrl } = parsed.data;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { captain: true, semifinalRegistration: true },
    });
    const isSPC = team?.competitionType === 'SPC';

    if (!team) return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    if (team.captainId !== session.user.id) {
      return NextResponse.json({ error: 'Only team captain can submit' }, { status: 403 });
    }

    // Full paper submission through this module is only for SPC and NEC teams.
    if (team.competitionType !== 'SPC' && team.competitionType !== 'NEC') {
      return NextResponse.json(
        { error: 'Semifinal full paper submission only applies to SPC and NEC teams.' },
        { status: 403 }
      );
    }

    // === Mandatory gate: admin must have approved the semifinal re-registration ===
    const rereg = team.semifinalRegistration;
    if (!rereg) {
      return NextResponse.json(
        { error: 'You must complete the semifinal re-registration before submitting your full paper.' },
        { status: 403 }
      );
    }
    if (rereg.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Your semifinal re-registration has not been approved yet. Please wait for admin approval.' },
        { status: 403 }
      );
    }

    // NOTE: semifinal submission window is intentionally NOT date-gated here —
    // SPC full paper + elevator pitch stays open with no deadline limit.

    if (!fullPaperUrl) {
      return NextResponse.json({ error: 'The full paper (PDF/DOCX) is required.' }, { status: 400 });
    }

    // Validasi ekstensi Full Paper: hanya PDF/DOCX (URL upload Supabase mengandung path file).
    const paperPath = fullPaperUrl.split('?')[0].toLowerCase();
    if (!paperPath.endsWith('.pdf') && !paperPath.endsWith('.docx') && !paperPath.endsWith('.doc')) {
      return NextResponse.json(
        { error: 'Full Paper must be a PDF or DOCX file (max 10MB).' },
        { status: 400 }
      );
    }

    // === SPC ONLY: Elevator Pitch wajib (video link YouTube/Drive atau file mp4/mov/webm) ===
    let normalizedPitchUrl: string | undefined = videoPitchUrl?.trim() || undefined;
    if (isSPC) {
      if (!normalizedPitchUrl) {
        return NextResponse.json(
          { error: 'SPC semifinal requires both Full Paper and Elevator Pitch video.' },
          { status: 400 }
        );
      }
      try {
        const u = new URL(normalizedPitchUrl);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('bad protocol');
        const host = u.hostname.toLowerCase();
        const videoHosts = ['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com', 'drive.google.com', 'docs.google.com'];
        const isVideoHost = videoHosts.some((h) => host === h || host.endsWith('.' + h));
        const isVideoFile = /\.(mp4|mov|webm)(\?|#|$)/i.test(u.pathname);
        const isStorageUrl = host.includes('supabase');
        if (!isVideoHost && !isVideoFile && !isStorageUrl) {
          return NextResponse.json(
            { error: 'Elevator Pitch must be a YouTube / Google Drive link or an uploaded MP4/MOV/WEBM video.' },
            { status: 400 }
          );
        }
      } catch {
        return NextResponse.json({ error: 'Elevator Pitch URL is not valid.' }, { status: 400 });
      }
    } else {
      // Non-SPC: abaikan videoPitchUrl jika dikirim (NEC semifinal = full paper saja).
      normalizedPitchUrl = undefined;
    }

    const existing = await prisma.submission.findFirst({
      where: { teamId, phase: 'SEMIFINAL' },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'You already submitted your full paper for the semifinal phase.' },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.create({
      data: {
        teamId,
        phase: 'SEMIFINAL',
        fullPaperUrl,
        videoPitchUrl: normalizedPitchUrl,
        status: 'PENDING',
      },
    });

    // Google Sheets sync: non-blocking — kegagalan/timeout Sheets TIDAK boleh
    // menggagalkan submission user. Bungkus try-catch + timeout race.
    try {
      await Promise.race([
        syncSubmissionToSheet({
          id: submission.id,
          teamId: team.id,
          teamName: team.teamName,
          competitionType: team.competitionType,
          captainId: team.captainId,
          captainName: team.captain?.name,
          captainEmail: team.captain?.email,
          institution: (team.captain as { institution?: string | null })?.institution,
          phase: 'SEMIFINAL',
          status: 'PENDING',
          proposalUrl: submission.proposalUrl,
          videoPitchUrl: submission.videoPitchUrl,
          fullPaperUrl: submission.fullPaperUrl,
          posterUrl: submission.posterUrl,
          pitchDeckUrl: submission.pitchDeckUrl,
          notes: submission.notes,
          reviewedById: submission.reviewedById,
          reviewedAt: submission.reviewedAt,
          createdAt: submission.createdAt,
          updatedAt: submission.updatedAt,
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Sheets sync timeout')), 8000)),
      ]);
    } catch (sheetsError) {
      // Log saja — submission DB sudah tersimpan dan response tetap success.
      console.error('Sheets sync failed (non-blocking) for semifinal submission', submission.id, sheetsError);
    }

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      message: 'Full paper submitted! Our team will review it soon.',
    });
  } catch (error) {
    console.error('Semifinal full paper submission error:', error);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}