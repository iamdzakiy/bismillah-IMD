import { NextResponse } from 'next/server';
import { transporter } from '@/lib/mailTransporter';
import { auth } from '@/lib/auth';

// 🟢 FORCE NEXT.JS TO TREAT THIS API AS DYNAMIC
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await transporter.verify();
    return NextResponse.json({ success: true, message: 'SMTP is working' });
  } catch (error) {
    console.error('SMTP error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}