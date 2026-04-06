import { db } from './db';
import { FREE_TIER_LIMITS } from './constants';

export async function checkDeckLimit(userId: string): Promise<{ allowed: boolean; message?: string }> {
  const user = await db.user.findUnique({ where: { id: userId } });

  if (!user) return { allowed: false, message: 'User not found' };
  if (user.plan !== 'FREE') return { allowed: true };

  const deckCount = await db.deck.count({ where: { userId } });

  if (deckCount >= FREE_TIER_LIMITS.maxDecks) {
    return {
      allowed: false,
      message: `Free plan is limited to ${FREE_TIER_LIMITS.maxDecks} decks. Upgrade to Pro for unlimited decks.`,
    };
  }

  return { allowed: true };
}

export async function checkAiLimit(userId: string): Promise<{ allowed: boolean; remaining: number; message?: string }> {
  const user = await db.user.findUnique({ where: { id: userId } });

  if (!user) return { allowed: false, remaining: 0, message: 'User not found' };
  if (user.plan !== 'FREE') return { allowed: true, remaining: Infinity };

  // Count AI calls today (chat messages from assistant)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const aiCallsToday = await db.chatMessage.count({
    where: {
      userId,
      role: 'ASSISTANT',
      createdAt: { gte: todayStart },
    },
  });

  const remaining = Math.max(0, FREE_TIER_LIMITS.maxAiExplanationsPerDay - aiCallsToday);

  if (remaining <= 0) {
    return {
      allowed: false,
      remaining: 0,
      message: `You've used all ${FREE_TIER_LIMITS.maxAiExplanationsPerDay} AI explanations for today. Upgrade to Pro for unlimited.`,
    };
  }

  return { allowed: true, remaining };
}

export async function getUserPlan(userId: string): Promise<'FREE' | 'PRO' | 'TEAMS'> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });
  return user?.plan ?? 'FREE';
}
