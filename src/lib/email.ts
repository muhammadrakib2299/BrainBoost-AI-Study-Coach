import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY || '');
  return _resend;
}

export async function sendStudyReminder(email: string, name: string, dueCards: number) {
  await getResend().emails.send({
    from: 'BrainBoost <noreply@brainboost.app>',
    to: email,
    subject: `You have ${dueCards} cards due for review!`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1D9E75;">BrainBoost</h2>
        <p>Hey ${name},</p>
        <p>You have <strong>${dueCards} cards</strong> due for review today. Keep your streak going!</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/review"
          style="display: inline-block; background: #1D9E75; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; margin-top: 12px;">
          Start Review
        </a>
        <p style="color: #888; font-size: 12px; margin-top: 24px;">
          You're receiving this because you have study reminders enabled in BrainBoost.
        </p>
      </div>
    `,
  });
}

export async function sendStreakRiskEmail(email: string, name: string, currentStreak: number) {
  await getResend().emails.send({
    from: 'BrainBoost <noreply@brainboost.app>',
    to: email,
    subject: `Don't lose your ${currentStreak}-day streak!`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1D9E75;">BrainBoost</h2>
        <p>Hey ${name},</p>
        <p>Your <strong>${currentStreak}-day study streak</strong> is at risk! Review at least one card today to keep it alive.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/review"
          style="display: inline-block; background: #1D9E75; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; margin-top: 12px;">
          Quick Review
        </a>
        <p style="color: #888; font-size: 12px; margin-top: 24px;">
          You're receiving this because you have study reminders enabled in BrainBoost.
        </p>
      </div>
    `,
  });
}
