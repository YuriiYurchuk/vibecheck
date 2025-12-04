import { prisma } from './prisma';

export const filterMissingIds = async (
	trackIds: string[],
	artistIds: string[]
) => {
	const uniqueTrackIds = [...new Set(trackIds)];
	const uniqueArtistIds = [...new Set(artistIds)];
	const [existingTracks, existingArtists] = await Promise.all([
		prisma.track.findMany({
			where: { id: { in: uniqueTrackIds } },
			select: { id: true },
		}),
		prisma.artist.findMany({
			where: { id: { in: uniqueArtistIds } },
			select: { id: true },
		}),
	]);
	const existingTrackSet = new Set(existingTracks.map((t) => t.id));
	const existingArtistSet = new Set(existingArtists.map((a) => a.id));
	const missingTrackIds = uniqueTrackIds.filter(
		(id) => !existingTrackSet.has(id)
	);
	const missingArtistIds = uniqueArtistIds.filter(
		(id) => !existingArtistSet.has(id)
	);

	return {
		missingTrackIds,
		missingArtistIds,
	};
};
