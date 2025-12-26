import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { getDateSince } from '@/lib/helpers';
import {
	compare30DayPeriods,
	getLongestStreak,
	getMostActiveDay,
	getMusicalMood,
	getPeakListeningHour,
	getTotalHours,
} from '@/lib/services/insights';

export const GET = async () => {
	try {
		const session = await requireSession();
		const userId = session.user.id;
		const timezone = session.user.timezone || 'UTC';
		const since = getDateSince('month', timezone);

		const [
			totalHours,
			mostActiveDay,
			peakHour,
			musicalMood,
			streak,
			comparison,
		] = await Promise.all([
			getTotalHours(userId, since),
			getMostActiveDay(userId, since, timezone),
			getPeakListeningHour(userId, since, timezone),
			getMusicalMood(userId, since),
			getLongestStreak(userId, timezone),
			compare30DayPeriods(userId, timezone),
		]);

		return NextResponse.json({
			period: 'Last 30 Days',
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
