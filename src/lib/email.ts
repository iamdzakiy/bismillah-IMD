// src/lib/email.ts
import { transporter, EMAIL_FROM } from './mailTransporter';

// Shared premium dark-mode inline styles
const LOGO_URL = `${process.env.NEXT_PUBLIC_APP_URL}/favicon.svg`;

const STYLES = {
  container: `
    background: linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 50%, #0a0a1a 100%);
    padding: 48px 24px;
    font-family: Tahoma, Geneva, Verdana, sans-serif;
  `,
  card: `
    max-width: 580px;
    margin: 0 auto;
    background: linear-gradient(160deg, #13133a 0%, #0e0e2e 100%);
    border-radius: 20px;
    padding: 44px 40px;
    border: 1px solid rgba(99, 102, 241, 0.25);
    box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.08);
  `,
  gradientText: `
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #a855f7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `,
  ctaButton: `
    display: inline-block;
    padding: 16px 40px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: #ffffff;
    text-decoration: none;
    border-radius: 60px;
    font-weight: 700;
    font-size: 16px;
    letter-spacing: 0.5px;
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.35), 0 0 20px rgba(99, 102, 241, 0.15);
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
  `,
  accentBorder: `
    border-top: 1px solid rgba(99, 102, 241, 0.15);
  `,
};

// Shared header with logo + IMD 2026 ITB branding
function renderHeader() {
  return `
    <tr>
      <td align="center" style="padding-bottom: 28px;">
        <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td align="center" style="padding-bottom: 6px;">
              <img
                src="${LOGO_URL}"
                alt="IMD 2026"
                width="48"
                height="48"
                style="display:block; margin:0 auto; border-radius: 12px;"
              />
            </td>
          </tr>
          <tr>
            <td align="center">
              <p style="
                background: linear-gradient(135deg, #6366f1, #a855f7);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-size: 20px;
                font-weight: 800;
                letter-spacing: 1px;
                margin: 0;
                line-height: 1.3;
              ">
                IMD 2026 ITB
              </p>
              <p style="
                color: rgba(255,255,255,0.35);
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 3px;
                text-transform: uppercase;
                margin: 4px 0 0 0;
              ">
                Institut Teknologi Bandung
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

// Helper to safely send emails and log errors
async function sendMailSafe(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({ from: EMAIL_FROM, to, subject, html });
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    // Do not rethrow – the caller can decide to handle or ignore
  }
}

// ============================================================
// EMAIL 1: Verify Email
// ============================================================
export async function sendVerificationEmail(email: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/activate?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0; padding:0; background:#060612;">
      <table width="100%" cellpadding="0" cellspacing="0" style="${STYLES.container}">
        <tr>
          <td align="center">
            <table width="580" cellpadding="0" cellspacing="0" style="${STYLES.card}">

              ${renderHeader()}

              <!-- Mascot Placeholder 6.svg -->
              <tr>
                <td align="center" style="padding-bottom: 24px;">
                  <img
                    src="${process.env.NEXT_PUBLIC_APP_URL}/6.svg"
                    alt="IMD 2026 Mascot"
                    width="120"
                    height="120"
                    style="display:block; margin:0 auto; filter: drop-shadow(0 8px 32px rgba(99,102,241,0.3));"
                  />
                </td>
              </tr>

              <!-- Badge -->
              <tr>
                <td align="center" style="padding-bottom: 8px;">
                  <span style="
                    display: inline-block;
                    padding: 6px 18px;
                    background: rgba(99, 102, 241, 0.12);
                    border: 1px solid rgba(99, 102, 241, 0.25);
                    border-radius: 40px;
                    color: #a78bfa;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                  ">
                    🔐 Action Required
                  </span>
                </td>
              </tr>

              <!-- Headline -->
              <tr>
                <td align="center" style="padding-bottom: 16px;">
                  <h1 style="
                    ${STYLES.gradientText}
                    font-size: 32px;
                    font-weight: 800;
                    line-height: 1.2;
                    margin: 0;
                    letter-spacing: -0.5px;
                  ">
                    Your Key to the<br/>Microbial Odyssey
                  </h1>
                </td>
              </tr>

              <!-- Subtitle -->
              <tr>
                <td align="center" style="padding-bottom: 28px;">
                  <p style="
                    color: rgba(255,255,255,0.6);
                    font-size: 16px;
                    line-height: 1.6;
                    margin: 0;
                    max-width: 460px;
                  ">
                    Your account is created — but your journey hasn't started yet.
                    <strong style="color: rgba(255,255,255,0.9);">Verify now to unlock the IMD 2026 ecosystem.</strong>
                  </p>
                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="padding-bottom: 28px;">
                  <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="${STYLES.accentBorder}"></td></tr></table>
                </td>
              </tr>

              <!-- What unlocks -->
              <tr>
                <td style="padding-bottom: 32px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="12" style="vertical-align:top; padding-right: 12px;">
                        <span style="color: #6366f1; font-size: 14px;">▸</span>
                      </td>
                      <td style="padding-bottom: 10px;">
                        <span style="color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.5;">
                          <strong style="color: #ffffff;">Competition Registration</strong> — Olympiad, SPC, NEC
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td width="12" style="vertical-align:top; padding-right: 12px;">
                        <span style="color: #6366f1; font-size: 14px;">▸</span>
                      </td>
                      <td style="padding-bottom: 10px;">
                        <span style="color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.5;">
                          <strong style="color: #ffffff;">Submission Portal</strong> — Upload your preliminary abstracts
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td width="12" style="vertical-align:top; padding-right: 12px;">
                        <span style="color: #6366f1; font-size: 14px;">▸</span>
                      </td>
                      <td style="padding-bottom: 10px;">
                        <span style="color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.5;">
                          <strong style="color: #ffffff;">Team Dashboard</strong> — Track progress & manage your team
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td width="12" style="vertical-align:top; padding-right: 12px;">
                        <span style="color: #6366f1; font-size: 14px;">▸</span>
                      </td>
                      <td style="padding-bottom: 0;">
                        <span style="color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.5;">
                          <strong style="color: #ffffff;">Exclusive Updates</strong> — Be first to know key announcements
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- CTA Button -->
              <tr>
                <td align="center" style="padding-bottom: 32px;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="border-radius: 60px;">
                        <a
                          href="${url}"
                          style="${STYLES.ctaButton}"
                        >
                          ⚡ Verify My Account
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Fallback link -->
              <tr>
                <td align="center" style="padding-bottom: 24px;">
                  <p style="color: rgba(255,255,255,0.35); font-size: 12px; line-height: 1.5; margin: 0;">
                    Button not working? Copy and paste this link into your browser:
                  </p>
                  <p style="color: #818cf8; font-size: 12px; word-break: break-all; margin: 6px 0 0 0;">
                    ${url}
                  </p>
                </td>
              </tr>

              <!-- Expiry notice -->
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="${STYLES.accentBorder}"></td></tr></table>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-top: 20px;">
                  <p style="color: rgba(255,255,255,0.3); font-size: 12px; line-height: 1.5; margin: 0;">
                    ⏳ This link expires in <strong style="color: rgba(255,255,255,0.5);">24 hours</strong>.
                    If you didn't create this account, please ignore this email.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="padding-top: 24px;">
                  <p style="color: rgba(255,255,255,0.15); font-size: 11px; line-height: 1.5; margin: 0;">
                    &copy; ${new Date().getFullYear()} International Microorganism Day 2026 &mdash; ITB
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await sendMailSafe(email, '🔬 Unlock your IMD 2026 access — verify your email', html);
}

// ============================================================
// EMAIL 2: You're Verified!
// ============================================================
export async function sendVerifiedEmail(email: string, name?: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0; padding:0; background:#060612;">
      <table width="100%" cellpadding="0" cellspacing="0" style="${STYLES.container}">
        <tr>
          <td align="center">
            <table width="580" cellpadding="0" cellspacing="0" style="${STYLES.card}">

              ${renderHeader()}

              <!-- Success Icon -->
              <tr>
                <td align="center" style="padding-bottom: 8px;">
                  <table cellpadding="0" cellspacing="0" style="
                    width: 80px; height: 80px;
                    background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1));
                    border-radius: 50%;
                    border: 2px solid rgba(99,102,241,0.3);
                  ">
                    <tr>
                      <td align="center" style="font-size: 36px; line-height: 1; color: #a78bfa;">
                        ✓
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Badge -->
              <tr>
                <td align="center" style="padding-bottom: 8px;">
                  <span style="
                    display: inline-block;
                    padding: 6px 18px;
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    border-radius: 40px;
                    color: #34d399;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                  ">
                    ✅ Verified Successfully
                  </span>
                </td>
              </tr>

              <!-- Headline -->
              <tr>
                <td align="center" style="padding-bottom: 16px;">
                  <h1 style="
                    ${STYLES.gradientText}
                    font-size: 34px;
                    font-weight: 800;
                    line-height: 1.2;
                    margin: 0;
                    letter-spacing: -0.5px;
                  ">
                    Welcome to the<br/>Microbial Odyssey
                  </h1>
                </td>
              </tr>

              <!-- Welcome copy -->
              <tr>
                <td align="center" style="padding-bottom: 24px;">
                  <p style="
                    color: rgba(255,255,255,0.65);
                    font-size: 16px;
                    line-height: 1.7;
                    margin: 0;
                    max-width: 460px;
                  ">
                    ${name ? `Hey ${name},` : 'Hey there,'}<br/><br/>
                    You're officially part of <strong style="color: rgba(255,255,255,0.9);">IMD 2026</strong> —
                    Indonesia's premier microbiology competition ecosystem.
                  </p>
                </td>
              </tr>

              <!-- Mascot Placeholder 7.svg -->
              <tr>
                <td align="center" style="padding-bottom: 28px;">
                  <img
                    src="${process.env.NEXT_PUBLIC_APP_URL}/7.svg"
                    alt="IMD 2026 Milestone"
                    width="200"
                    height="auto"
                    style="display:block; margin:0 auto; max-width: 100%; filter: drop-shadow(0 12px 40px rgba(99,102,241,0.25));"
                  />
                </td>
              </tr>

              <!-- Anticipation Section -->
              <tr>
                <td style="padding-bottom: 32px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="
                    background: rgba(99,102,241,0.04);
                    border-radius: 16px;
                    border: 1px solid rgba(99,102,241,0.1);
                    padding: 24px 20px;
                  ">
                    <tr>
                      <td align="center" style="padding-bottom: 16px;">
                        <p style="color: #a78bfa; font-size: 14px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin: 0;">
                          🚀 What's Next?
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td width="8" style="background: linear-gradient(180deg, #6366f1, #8b5cf6); border-radius: 4px; width: 4px;"></td>
                            <td style="padding-left: 16px; padding-bottom: 16px;">
                              <p style="color: rgba(255,255,255,0.85); font-size: 14px; font-weight: 600; margin: 0 0 2px 0;">
                                Register for Competitions
                              </p>
                              <p style="color: rgba(255,255,255,0.4); font-size: 13px; margin: 0;">
                                Olympiad, Scientific Paper Contest, or Nature Essay Contest
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td width="8" style="background: linear-gradient(180deg, #8b5cf6, #a855f7); border-radius: 4px; width: 4px;"></td>
                            <td style="padding-left: 16px; padding-bottom: 16px;">
                              <p style="color: rgba(255,255,255,0.85); font-size: 14px; font-weight: 600; margin: 0 0 2px 0;">
                                Build Your Team
                              </p>
                              <p style="color: rgba(255,255,255,0.4); font-size: 13px; margin: 0;">
                                Invite members & prepare your submissions
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td width="8" style="background: linear-gradient(180deg, #a855f7, #d946ef); border-radius: 4px; width: 4px;"></td>
                            <td style="padding-left: 16px; padding-bottom: 0;">
                              <p style="color: rgba(255,255,255,0.85); font-size: 14px; font-weight: 600; margin: 0 0 2px 0;">
                                Stay Tuned for Roadshows & Workshops
                              </p>
                              <p style="color: rgba(255,255,255,0.4); font-size: 13px; margin: 0;">
                                Exclusive events to sharpen your edge
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- CTA Button -->
              <tr>
                <td align="center" style="padding-bottom: 28px;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="border-radius: 60px;">
                        <a
                          href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
                          style="${STYLES.ctaButton}"
                        >
                          🚀 Enter Your Dashboard
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="padding-bottom: 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="${STYLES.accentBorder}"></td></tr></table>
                </td>
              </tr>

              <!-- Closing -->
              <tr>
                <td align="center">
                  <p style="color: rgba(255,255,255,0.45); font-size: 14px; line-height: 1.6; margin: 0; font-style: italic;">
                    "The microbial world is waiting. Let's decode it together."
                  </p>
                  <p style="color: rgba(255,255,255,0.2); font-size: 12px; margin: 8px 0 0 0;">
                    — IMD 2026 Committee
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="padding-top: 24px;">
                  <p style="color: rgba(255,255,255,0.12); font-size: 11px; line-height: 1.5; margin: 0;">
                    &copy; ${new Date().getFullYear()} International Microorganism Day 2026 &mdash; ITB
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await sendMailSafe(email, '✅ You\'re in. Welcome to IMD 2026', html);
}

// ============================================================
// EMAIL 3: Approval email (for registration or submission approval)
// ============================================================
export async function sendApprovalEmail(
  email: string,
  name: string,
  competition: string,
  phase: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a1a; padding: 40px 24px; border-radius: 16px;">
      <div style="background: linear-gradient(160deg, #13133a, #0e0e2e); border-radius: 16px; padding: 36px 32px; border: 1px solid rgba(99,102,241,0.2);">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${renderHeader()}
        </table>
        <h1 style="background: linear-gradient(135deg, #6366f1, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 28px; margin: 0 0 12px 0;">🎉 Congratulations, ${name}!</h1>
        <p style="color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
          Your <strong style="color: #fff;">${phase}</strong> for <strong style="color: #fff;">${competition}</strong> has been approved by our review team.
        </p>
        <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin: 0 0 24px 0;">Check your dashboard for next steps.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; text-decoration: none; border-radius: 60px; font-weight: 700; font-size: 15px; box-shadow: 0 8px 32px rgba(99,102,241,0.3);">View Dashboard →</a>
      </div>
    </div>
  `;
  await sendMailSafe(email, `🎉 Your ${phase} has been approved!`, html);
}

// ============================================================
// EMAIL 4: Rejection email (for registration or submission rejection)
// ============================================================
export async function sendRejectionEmail(
  email: string,
  name: string,
  competition: string,
  phase: string,
  notes: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a1a; padding: 40px 24px; border-radius: 16px;">
      <div style="background: linear-gradient(160deg, #2a1111, #1a0a0a); border-radius: 16px; padding: 36px 32px; border: 1px solid rgba(239,68,68,0.2);">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${renderHeader()}
        </table>
        <h1 style="color: #ef4444; font-size: 28px; margin: 0 0 12px 0;">📝 Submission Update</h1>
        <p style="color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.6; margin: 0 0 8px 0;">Hi ${name},</p>
        <p style="color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
          Thank you for your submission to <strong style="color: #fff;">${competition}</strong> (${phase}).
        </p>
        <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0 0 16px 0;">After careful review, we regret to inform you that your submission did not meet the requirements.</p>
        <div style="background: rgba(239,68,68,0.08); border-left: 3px solid #ef4444; padding: 16px 20px; margin: 0 0 20px 0; border-radius: 0 8px 8px 0;">
          <strong style="color: #f87171; font-size: 13px;">Reviewer Notes:</strong>
          <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin: 6px 0 0 0;">${notes}</p>
        </div>
        <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin: 0;">If you have questions, please contact our committee.</p>
      </div>
    </div>
  `;
  await sendMailSafe(email, `📝 Update on your ${phase}`, html);
}

// ============================================================
// EMAIL 5: Password reset
// ============================================================
export async function sendPasswordResetEmail(email: string, token: string, name?: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${encodeURIComponent(token)}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a1a; padding: 40px 24px; border-radius: 16px;">
      <div style="background: linear-gradient(160deg, #13133a, #0e0e2e); border-radius: 16px; padding: 36px 32px; border: 1px solid rgba(99,102,241,0.2);">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${renderHeader()}
        </table>
        <h1 style="background: linear-gradient(135deg, #6366f1, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 28px; margin: 0 0 12px 0;">🔐 Reset Your Password</h1>
        <p style="color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.6; margin: 0 0 8px 0;">Hi ${name || 'there'},</p>
        <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0 0 24px 0;">You requested a password reset for your IMD 2026 account. Click the button below to set a new password.</p>
        <a href="${url}" style="display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; text-decoration: none; border-radius: 60px; font-weight: 700; font-size: 15px; box-shadow: 0 8px 32px rgba(99,102,241,0.3);">Reset Password →</a>
        <p style="color: rgba(255,255,255,0.35); font-size: 12px; margin: 16px 0 0 0; word-break: break-all;">${url}</p>
        <p style="color: rgba(255,255,255,0.25); font-size: 11px; margin: 8px 0 0 0;">⏳ This link expires in 30 minutes. If you didn't request this, please ignore this email.</p>
      </div>
    </div>
  `;

  await sendMailSafe(email, '🔐 Reset your IMD 2026 password', html);
}

// ============================================================
// EMAIL 6: Event reminder (optional high-impact touchpoint)
// ============================================================
export async function sendEventReminderEmail(email: string, name?: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0; padding:0; background:#060612;">
      <table width="100%" cellpadding="0" cellspacing="0" style="${STYLES.container}">
        <tr>
          <td align="center">
            <table width="580" cellpadding="0" cellspacing="0" style="${STYLES.card}">

              ${renderHeader()}

              <tr>
                <td align="center" style="padding-bottom: 8px;">
                  <span style="
                    display: inline-block;
                    padding: 6px 18px;
                    background: rgba(245, 158, 11, 0.1);
                    border: 1px solid rgba(245, 158, 11, 0.3);
                    border-radius: 40px;
                    color: #fbbf24;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                  ">
                    🗓️ Event Reminder
                  </span>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding-bottom: 16px;">
                  <h1 style="
                    ${STYLES.gradientText}
                    font-size: 32px;
                    font-weight: 800;
                    line-height: 1.2;
                    margin: 0;
                    letter-spacing: -0.5px;
                  ">
                    The Odyssey<br/>Awaits
                  </h1>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding-bottom: 24px;">
                  <p style="
                    color: rgba(255,255,255,0.65);
                    font-size: 16px;
                    line-height: 1.7;
                    margin: 0;
                    max-width: 460px;
                  ">
                    ${name ? `Hey ${name},` : 'Hey there,'}<br/><br/>
                    IMD 2026 is getting closer. Make sure you're registered, your team is ready, and your abstracts are polished.
                  </p>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding-bottom: 28px;">
                  <table cellpadding="0" cellspacing="0" style="
                    background: rgba(99,102,241,0.05);
                    border-radius: 16px;
                    border: 1px solid rgba(99,102,241,0.15);
                    padding: 20px 24px;
                    width: 100%;
                    max-width: 460px;
                  ">
                    <tr>
                      <td align="center">
                        <p style="color: #a78bfa; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 12px 0;">Countdown</p>
                        <p style="color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: 1px; margin: 0;">T-minus 14 days</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding-bottom: 28px;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="border-radius: 60px;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="${STYLES.ctaButton}">
                          🔍 Check Your Dashboard
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding-bottom: 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="${STYLES.accentBorder}"></td></tr></table>
                </td>
              </tr>

              <tr>
                <td align="center">
                  <p style="color: rgba(255,255,255,0.45); font-size: 14px; line-height: 1.6; margin: 0; font-style: italic;">
                    "The microbial world is waiting. Let's decode it together."
                  </p>
                  <p style="color: rgba(255,255,255,0.2); font-size: 12px; margin: 8px 0 0 0;">
                    — IMD 2026 Committee
                  </p>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding-top: 24px;">
                  <p style="color: rgba(255,255,255,0.12); font-size: 11px; line-height: 1.5; margin: 0;">
                    &copy; ${new Date().getFullYear()} International Microorganism Day 2026 &mdash; ITB
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await sendMailSafe(email, '🗓️ IMD 2026 is almost here — last call', html);
}