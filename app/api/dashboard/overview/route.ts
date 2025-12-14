import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { getDateSince, validateLimit, validatePeriod } from '@/lib/helpers';
import {
	getDailyActivity,
	getSummaryStats,
	getTopArtists,
	getTopTracks,
} from '@/lib/services/overview';
import type { DashboardOverviewResponse } from '@/types/dashboard';

export const GET = async (request: Request) => {
	try {
		const session = await requireSession();
		const userId = session.user.id;
		const timezone = session.user.timezone || 'UTC';

		const { searchParams } = new URL(request.url);
		const period = validatePeriod(searchParams.get('period'));
		const topLimit = validateLimit(searchParams.get('limit'));

		const since = getDateSince(period, timezone);
		const weekAgo = getDateSince('week', timezone);

		const [summary, topTracks, topArtists, weeklyActivity] = await Promise.all([
			getSummaryStats(userId, since),
			getTopTracks(userId, since, topLimit),
			getTopArtists(userId, since, topLimit),
			getDailyActivity(userId, weekAgo, timezone),
		]);

		const response: DashboardOverviewResponse = {
			summary,
			topTracks,
			topArtists,
			weeklyActivity,
		};

		return NextResponse.json(response);
	} catch (err) {
		if (err instanceof Error && err.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		console.error('Failed to fetch dashboard data:', err);

		return NextResponse.json(
			{ error: 'Failed to fetch dashboard data' },
			{ status: 500 }
		);
	}
};
