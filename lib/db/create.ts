import { type Artist, Prisma, type Track } from '@/app/generated/prisma/client';
import { prisma } from './prisma';

type ArtistInput = Omit<Artist, 'createdAt' | 'updatedAt' | 'tracks'>;

export type TrackInput = Omit<Track, 'createdAt' | 'updatedAt'> & {
	artistIds: string[];
};

type HistoryInputItem = {
	track: { id: string };
	played_at: string;
};

export const createArtists = async (artists: ArtistInput[]) => {
	if (artists.length === 0) return { created: 0, updated: 0 };

	const createResult = await prisma.artist.createMany({
		data: artists,
		skipDuplicates: true,
	});

	if (artists.length > 0) {
		const values = artists.map(
			(a) =>
				Prisma.sql`(${a.id}::text, ${a.name}::text, ${a.imageUrl}::text, ${a.href}::text)`
		);

		await prisma.$executeRaw`
			UPDATE artists AS a
			SET 
				name = data.name,
				"imageUrl" = data."imageUrl",
				href = data.href,
				"updatedAt" = NOW()
			FROM (VALUES ${Prisma.join(values)}) AS data(id, name, "imageUrl", href)
			WHERE a.id = data.id
				AND (
					a.name IS DISTINCT FROM data.name 
					OR a."imageUrl" IS DISTINCT FROM data."imageUrl"
					OR a.href IS DISTINCT FROM data.href
				)
		`;
	}

	return { created: createResult.count, updated: 0 };
};

export const createTracks = async (tracks: TrackInput[]) => {
	if (tracks.length === 0) return 0;

	const tracksToCreate: Prisma.TrackCreateManyInput[] = tracks.map((t) => ({
		id: t.id,
		name: t.name,
		durationMs: t.durationMs,
		imageUrl: t.imageUrl,
		href: t.href,
		acousticness: t.acousticness,
		danceability: t.danceability,
		energy: t.energy,
		instrumentalness: t.instrumentalness,
		key: t.key,
		liveness: t.liveness,
		loudness: t.loudness,
		mode: t.mode,
		speechiness: t.speechiness,
		tempo: t.tempo,
		valence: t.valence,
	}));

	const artistRelations: Prisma.TrackArtistCreateManyInput[] = [];

	tracks.forEach((t) => {
		t.artistIds.forEach((artistId) => {
			artistRelations.push({
				trackId: t.id,
				artistId: artistId,
			});
		});
	});

	const results = await prisma.$transaction([
		prisma.track.createMany({
			data: tracksToCreate,
			skipDuplicates: true,
		}),
		prisma.trackArtist.createMany({
			data: artistRelations,
			skipDuplicates: true,
		}),
	]);

	return results[0].count;
};

export const createPlayHistory = async (
	userId: string,
	items: HistoryInputItem[]
) => {
	if (items.length === 0) return 0;

	const historyEntries = items.map((item) => {
		return {
			userId,
			trackId: item.track.id,
			playedAt: item.played_at,
		};
	});

	const { count } = await prisma.playHistory.createMany({
		data: historyEntries,
		skipDuplicates: true,
	});

	return count;
};
