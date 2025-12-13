import { requireSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { syncSpotifyHistory } from '@/lib/services';

export const POST = async () => {
	try {
		const session = await requireSession();

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: { isSyncing: true },
		});

		if (user?.isSyncing) {
			return Response.json(
				{ error: 'Sync already in progress' },
				{ status: 409 }
			);
		}

		await prisma.user.update({
			where: { id: session.user.id },
			data: { lastActiveAt: new Date() },
		});

		const result = await syncSpotifyHistory(session.user.id);

		if (!result.success) {
			if (result.error?.includes('SPOTIFY')) {
				return Response.json(
					{
						error: 'Please reconnect your Spotify account',
						needsReconnect: true,
					},
					{ status: 401 }
				);
			}

			return Response.json(
				{ error: 'Something went wrong. Please try again later.' },
				{ status: 500 }
			);
		}

		return Response.json({ success: true });
	} catch (err) {
		console.error('[API Sync] Error:', err);

		if (err instanceof Error && err.message === 'Unauthorized') {
			return Response.json({ error: 'Please log in' }, { status: 401 });
		}

		return Response.json(
			{ error: 'Something went wrong. Please try again.' },
			{ status: 500 }
		);
	}
};
