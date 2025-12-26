import { prisma } from '@/lib/db';

export const getRecentTracks = async (
	userId: string,
	limit: number = 50,
	offset: number = 0,
	search?: string
) => {
	const whereClause = search
		? {
				userId,
				OR: [
					{
						track: {
							name: {
								contains: search,
								mode: 'insensitive' as const,
							},
						},
					},
					{
						track: {
							artists: {
								some: {
									artist: {
										name: {
											contains: search,
											mode: 'insensitive' as const,
										},
									},
								},
							},
						},
					},
				],
			}
		: { userId };

	const [tracks, total] = await Promise.all([
		prisma.playHistory.findMany({
			where: whereClause,
			orderBy: {
				playedAt: 'desc',
			},
			skip: offset,
			take: limit,
			include: {
				track: {
					include: {
						artists: {
							include: {
								artist: true,
							},
						},
					},
				},
			},
		}),
		prisma.playHistory.count({
			where: whereClause,
		}),
	]);

	return {
		tracks: tracks.map((ph) => ({
			id: ph.id,
			playedAt: ph.playedAt,
			track: {
				id: ph.track.id,
				name: ph.track.name,
				imageUrl: ph.track.imageUrl,
				href: ph.track.href,
				durationMs: ph.track.durationMs,
				artists: ph.track.artists.map((ta) => ({
					id: ta.artist.id,
					name: ta.artist.name,
					href: ta.artist.href,
				})),
			},
		})),
		total,
		hasMore: offset + tracks.length < total,
	};
};
