import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendStudyReminder } from '@/lib/email';

// This endpoint is designed to be called by a cron job (e.g., Vercel Cron)
export async function POST() {
  try {
    // Get all users with cards due
    const users = await db.user.findMany({
      include: {
        decks: {
          include: {
            flashcards: {
              where: { dueDate: { lte: new Date() } },
              select: { id: true },
            },
          },
        },
      },
    });

    let sent = 0;

    for (const user of users) {
      const dueCards = user.decks.reduce((sum, deck) => sum + deck.flashcards.length, 0);

      if (dueCards > 0) {
        try {
          await sendStudyReminder(user.email, user.name, dueCards);
          sent++;
        } catch (error) {
          console.error(`Failed to send reminder to ${user.email}:`, error);
        }
      }
    }

    return NextResponse.json({ success: true, data: { sent } });
  } catch (error) {
    console.error('Reminder cron error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send reminders' }, { status: 500 });
  }
}
