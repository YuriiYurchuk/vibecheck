import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { validateLimit, validateOffset } from '@/lib/helpers';
import { getRecentTracks } from '@/lib/services';

export const GET = async (request: Request) => {
	try {
		const session = await requireSession();
		const userId = session.user.id;
		const { searchParams } = new URL(request.url);
		const limit = validateLimit(searchParams.get('limit'));
		const offset = validateOffset(searchParams.get('offset'));
		const search = searchParams.get('search') || undefined;
		const tracks = await getRecentTracks(userId, limit, offset, search);

		return NextResponse.json(tracks);
	} catch (err) {
		if (err instanceof Error && err.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Failed to fetch recent tracks:', err);
		return NextResponse.json(
			{ error: 'Failed to fetch recent tracks' },
			{ status: 500 }
		);
	}
};
