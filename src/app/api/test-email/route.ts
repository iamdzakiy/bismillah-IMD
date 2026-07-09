import { NextResponse } from 'next/server';
import { transporter } from '@/lib/mailTransporter';

export async function GET() {
  try {
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