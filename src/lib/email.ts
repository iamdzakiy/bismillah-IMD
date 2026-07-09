// src/lib/email.ts
import { transporter, EMAIL_FROM } from './mailTransporter';

async function sendMailSafe(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({ from: EMAIL_FROM, to, subject, html });
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    // Optionally rethrow or return false
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/activate?token=${token}`;
  await sendMailSafe(
    email,
    '🔬 Verify your email for IMD 2026',
    `...` // HTML content
  );
}

// Similarly for other functions.