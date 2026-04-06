import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';

interface DailyPlan {
  date: string;
  topics: string[];
  estimatedMinutes: number;
}

// Generate a Google Calendar URL that auto-creates events
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const schedule = await db.studySchedule.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    if (!schedule) {
      return NextResponse.json({ success: false, error: 'No schedule found' }, { status: 404 });
    }

    const dailyPlans = schedule.dailyPlans as DailyPlan[];

    // Generate Google Calendar links for each event
    const events = dailyPlans.map((plan) => {
      const date = plan.date.replace(/-/g, '');
      const topics = plan.topics.join(', ');
      const duration = plan.estimatedMinutes;

      // Calculate end time (start at 9am)
      const endHour = 9 + Math.floor(duration / 60);
      const endMin = duration % 60;

      const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: `BrainBoost: ${topics}`,
        dates: `${date}T090000/${date}T${String(endHour).padStart(2, '0')}${String(endMin).padStart(2, '0')}00`,
        details: `Study session - ${topics} (${duration} min)\n\nPowered by BrainBoost AI Study Coach`,
      });

      return {
        date: plan.date,
        topics,
        url: `https://calendar.google.com/calendar/render?${params.toString()}`,
      };
    });

    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error('Google Calendar error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate Google Calendar links' },
      { status: 500 }
    );
  }
}
