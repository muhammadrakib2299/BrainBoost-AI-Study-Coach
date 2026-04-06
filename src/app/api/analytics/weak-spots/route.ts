import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const deckId = searchParams.get('deckId');

    const where = deckId ? { userId: user.id, deckId } : { userId: user.id };

    const weakSpots = await db.weakSpot.findMany({
      where,
      orderBy: { mistakeCount: 'desc' },
      take: 20,
      include: { deck: { select: { title: true } } },
    });

    return NextResponse.json({ success: true, data: weakSpots });
  } catch (error) {
    console.error('Weak spots error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch weak spots' },
      { status: 500 }
    );
  }
}
