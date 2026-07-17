// src/app/api/registrations/[id]/delete/route.ts
// Participants can delete their own registration (not their account)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the registration with team info
    const registration = await prisma.registration.findUnique({
      where: { id },
      include: {
        team: true,
      },
    });

    if (!registration?.team) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    // Verify user is the captain of this team
    if (registration.team.captainId !== session.user.id) {
      return NextResponse.json({ error: 'Only the team captain can delete this registration' }, { status: 403 });
    }

    // Delete submissions first, then registration, then team
    await prisma.submission.deleteMany({
      where: { teamId: registration.team.id },
    });

    await prisma.registration.delete({
      where: { id },
    });

    await prisma.team.delete({
      where: { id: registration.team.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Registration deleted successfully',
    });
  } catch (error) {
    console.error('Registration delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}