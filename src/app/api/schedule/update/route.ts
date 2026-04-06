import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { scheduleId, dailyPlans } = await request.json();

    const schedule = await db.studySchedule.findFirst({
      where: { id: scheduleId, userId: user.id },
    });

    if (!schedule) {
      return NextResponse.json({ success: false, error: 'Schedule not found' }, { status: 404 });
    }

    await db.studySchedule.update({
      where: { id: scheduleId },
      data: { dailyPlans },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Schedule update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update schedule' },
      { status: 500 }
    );
  }
}
