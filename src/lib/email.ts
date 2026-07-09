import { transporter, EMAIL_FROM } from './mailTransporter';

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/activate?token=${token}`;

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: email,
    subject: '🔬 Verify your email for IMD 2026',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #06b6d4;">International Microorganism Day 2026</h1>
        <h2>Verify Your Email</h2>
        <p>Hi there! Welcome to IMD 2026. Please click the button below to verify your email address and activate your account.</p>
        <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Verify Email
        </a>
        <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link:</p>
        <p style="color: #06b6d4; word-break: break-all;">${url}</p>
        <p style="color: #999; font-size: 12px;">This link will expire in 24 hours.</p>
      </div>
    `,
  });
}

export async function sendVerifiedEmail(email: string, name?: string) {
  await transporter.sendMail({
    from: EMAIL_FROM,
    to: email,
    subject: '✅ You\'re verified! Welcome to IMD 2026',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10b981;">Welcome to IMD 2026!</h1>
        <p>Hi ${name || 'there'},</p>
        <p>Your email has been successfully verified. You can now:</p>
        <ul>
          <li>Register for competitions (Olympiad, SPC, NEC)</li>
          <li>Upload your submissions</li>
          <li>Track your team's progress</li>
        </ul>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #06b6d4; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Go to Dashboard
        </a>
        <p>See you at the Microbial Odyssey!</p>
      </div>
    `,
  });
}

export async function sendApprovalEmail(
  email: string,
  name: string,
  competition: string,
  phase: string
) {
  await transporter.sendMail({
    from: EMAIL_FROM,
    to: email,
    subject: `🎉 Your ${phase} has been approved!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10b981;">Congratulations!</h1>
        <p>Hi ${name},</p>
        <p>Your <strong>${phase}</strong> for <strong>${competition}</strong> has been approved by our review team.</p>
        <p>Check your dashboard for next steps.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #06b6d4; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          View Dashboard
        </a>
      </div>
    `,
  });
}

export async function sendRejectionEmail(
  email: string,
  name: string,
  competition: string,
  phase: string,
  notes: string
) {
  await transporter.sendMail({
    from: EMAIL_FROM,
    to: email,
    subject: `📝 Update on your ${phase}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ef4444;">Submission Update</h1>
        <p>Hi ${name},</p>
        <p>Thank you for your submission to <strong>${competition}</strong> (${phase}).</p>
        <p>After careful review, we regret to inform you that your submission did not meet the requirements.</p>
        <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0;">
          <strong>Reviewer Notes:</strong>
          <p style="margin-top: 8px;">${notes}</p>
        </div>
        <p>If you have questions, please contact our committee.</p>
      </div>
    `,
  });
}