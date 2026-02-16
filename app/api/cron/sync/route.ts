import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { syncSpotifyHistory } from '@/lib/services/sync';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
	const authHeader = request.headers.get('authorization');
	const cronSecret = process.env.CRON_SECRET;

	if (authHeader !== `Bearer ${cronSecret}`) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		console.log('[CRON] Starting background synchronization');

		const now = new Date();
		const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
		const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

		const usersToSync = await prisma.user.findMany({
			where: {
				isSyncing: false,
				lastActiveAt: {
					gte: thirtyDaysAgo,
				},
				OR: [{ lastSyncedAt: null }, { lastSyncedAt: { lte: fiveMinutesAgo } }],
				accounts: {
					some: {
						hasError: false,
					},
				},
			},
			select: {
				id: true,
				name: true,
			},
		});

		if (usersToSync.length === 0) {
			console.log('[CRON] No eligible users to sync right now.');
			return NextResponse.json({
				message: 'No eligible users to sync right now',
			});
		}

		console.log(`[CRON] Found eligible users to sync: ${usersToSync.length}`);

		const summary = [];

		for (const user of usersToSync) {
			const displayName = user.name || user.id;
			console.log(`[CRON] Syncing data for user: ${displayName}`);

			const result = await syncSpotifyHistory(user.id);

			summary.push({
				userId: user.id,
				name: displayName,
				success: result.success,
				stats: result.stats,
				error: result.error || null,
			});

			await new Promise((resolve) => setTimeout(resolve, 500));
		}

		console.log('\n--- SYNC REPORT ---');
		summary.forEach((log) => {
			if (log.success) {
				console.log(
					`[SUCCESS] User: ${log.name} | Processed: ${log.stats?.tracksProcessed} | History: ${log.stats?.playHistoryCreated} | New Tracks/Artists: ${log.stats?.tracksCreated}/${log.stats?.artistsCreated}`
				);
			} else {
				console.error(`[ERROR] User: ${log.name} | Details: ${log.error}`);
			}
		});
		console.log('-------------------\n');

		return NextResponse.json({
			success: true,
			processed: usersToSync.length,
			results: summary,
		});
	} catch (err) {
		console.error('[CRON] Critical error during execution:', err);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
