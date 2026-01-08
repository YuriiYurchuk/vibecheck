import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import {
	compareMonths,
	getLongestStreak,
	getMonthRange,
	getMostActiveDay,
	getMusicalMood,
	getPeakListeningHour,
	getTotalHours,
} from '@/lib/services/insights';

export const GET = async (request: Request) => {
	try {
		const session = await requireSession();
		const userId = session.user.id;
		const timezone = session.user.timezone || 'UTC';
		const { searchParams } = new URL(request.url);
		const monthsAgo = parseInt(searchParams.get('month') || '0', 10);
		const validMonthsAgo = Math.max(0, Math.min(monthsAgo, 12));
		const monthRange = getMonthRange(timezone, validMonthsAgo);
		const { start: since, end: until } = monthRange;

		const [
			totalHours,
			mostActiveDay,
			peakHour,
			musicalMood,
			streak,
			comparison,
		] = await Promise.all([
			getTotalHours(userId, since, until),
			getMostActiveDay(userId, since, timezone, until),
			getPeakListeningHour(userId, since, timezone, until),
			getMusicalMood(userId, since, until),
			getLongestStreak(userId, timezone),
			compareMonths(userId, timezone, validMonthsAgo),
		]);

		const targetMonth = toZonedTime(since, timezone);
		const periodName =
			validMonthsAgo === 0 ? 'This Month' : format(targetMonth, 'MMMM yyyy');

		return NextResponse.json({
			period: periodName,
			totalHours,
			mostActiveDay,
			peakHour,
			musicalMood,
			streak,
			comparison,
		});
	} catch (err) {
		if (err instanceof Error && err.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Failed to fetch insights:', err);
		return NextResponse.json(
			{ error: 'Failed to fetch dashboard data' },
			{ status: 500 }
		);
	}
};
