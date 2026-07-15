import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        teams: {
          include: {
            registration: true,
            submissions: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent admin deletion through this endpoint
    if (user.role === 'ADMIN') {
      return NextResponse.json({ 
        error: 'Admin accounts cannot be deleted through this endpoint. Contact system administrator.' 
      }, { status: 403 });
    }

    // Delete in correct order to avoid foreign key constraints
    // 1. Delete submissions
    for (const team of user.teams) {
      await prisma.submission.deleteMany({
        where: { teamId: team.id },
      });
      
      // 2. Delete registration
      if (team.registration) {
        await prisma.registration.delete({
          where: { id: team.registration.id },
        });
      }
      
      // 3. Delete team
      await prisma.team.delete({
        where: { id: team.id },
      });
    }

    // 4. Delete user
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete account. Please try again or contact support.' 
    }, { status: 500 });
  }
}