import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { getCalendar, getTodayHourlyActivity } from '@/lib/services/listening';

export const GET = async (request: Request) => {
	try {
		const session = await requireSession();
		const userId = session.user.id;
		const timezone = session.user.timezone || 'UTC';

		const { searchParams } = new URL(request.url);
		const yearParam = searchParams.get('year');
		const year = yearParam ? parseInt(yearParam, 10) : undefined;

		const getData = unstable_cache(
			async () => {
				const [hourlyActivity, yearCalendar] = await Promise.all([
					getTodayHourlyActivity(userId, timezone),
					getCalendar(userId, timezone, year),
				]);

				return {
					hourlyActivity,
					yearCalendar,
				};
			},
			[`listening-${userId}-${year || 'last365'}`],
			{
				revalidate: 600,
				tags: [`listening-${userId}`],
			}
		);

		return NextResponse.json(await getData());
	} catch (err) {
		if (err instanceof Error && err.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Failed to fetch listening data:', err);

		return NextResponse.json(
			{ error: 'Failed to fetch dashboard data' },
			{ status: 500 }
		);
	}
};
