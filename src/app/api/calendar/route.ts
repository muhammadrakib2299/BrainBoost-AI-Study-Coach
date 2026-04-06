import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';

interface DailyPlan {
  date: string;
  topics: string[];
  estimatedMinutes: number;
}

// Generate iCal (.ics) file for study schedule
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
      return NextResponse.json(
        { success: false, error: 'No schedule found' },
        { status: 404 }
      );
    }

    const dailyPlans = schedule.dailyPlans as DailyPlan[];
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    let ical = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//BrainBoost//Study Schedule//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:BrainBoost Study Schedule
`;

    for (const plan of dailyPlans) {
      const date = plan.date.replace(/-/g, '');
      const topics = plan.topics.join(', ');
      const duration = plan.estimatedMinutes;
      const hours = Math.floor(duration / 60);
      const mins = duration % 60;

      ical += `BEGIN:VEVENT
DTSTART:${date}T090000
DURATION:PT${hours}H${mins}M
SUMMARY:BrainBoost Study: ${topics}
DESCRIPTION:Study session - ${topics} (${duration} min)
UID:brainboost-${schedule.id}-${date}@brainboost.app
DTSTAMP:${now}
END:VEVENT
`;
    }

    ical += 'END:VCALENDAR';

    return new NextResponse(ical, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="brainboost-schedule.ics"',
      },
    });
  } catch (error) {
    console.error('Calendar export error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export calendar' },
      { status: 500 }
    );
  }
}
