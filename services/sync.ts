import {
	createArtists,
	createPlayHistory,
	createTracks,
	filterMissingIds,
	prisma,
} from '@/lib/db';
import { fetchFeatures } from '@/lib/recco-beats';
import { fetchArtists, fetchRecentTracks } from '@/lib/spotify';
import type { ArtistBasicInfo } from '@/types/spotify';
import type { SyncResult, SyncStats } from '@/types/sync';

export const syncSpotifyHistory = async (
	userId: string
): Promise<SyncResult> => {
	const stats: SyncStats = {
		tracksProcessed: 0,
		tracksCreated: 0,
		artistsCreated: 0,
		artistsUpdated: 0,
		playHistoryCreated: 0,
	};

	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { lastSyncedAt: true },
		});

		await prisma.user.update({
			where: { id: userId },
			data: { isSyncing: true },
		});

		const after = user?.lastSyncedAt
			? user.lastSyncedAt.getTime().toString()
			: undefined;

		const recent = await fetchRecentTracks(userId, after);

		if (!recent.items.length) {
			await prisma.user.update({
				where: { id: userId },
				data: { isSyncing: false },
			});
			return { success: true, stats };
		}

		stats.tracksProcessed = recent.items.length;

		const filtered = await filterMissingIds(recent.trackIds, recent.artistIds);

		let artists: ArtistBasicInfo[] = [];
		if (recent.artistIds.length > 0) {
			artists = await fetchArtists(recent.artistIds, userId);
		}

		let features = new Map();
		if (recent.trackIds.length > 0) {
			features = await fetchFeatures(filtered.missingTrackIds);
		}

		const uniqueNewTracksItems = recent.items
			.filter((item) => filtered.missingTrackIds.includes(item.track.id))
			.filter(
				(item, index, self) =>
					index === self.findIndex((t) => t.track.id === item.track.id)
			);

		const tracksToSave = uniqueNewTracksItems.map((item) => {
			const trackId = item.track.id;
			const feats = features.get(trackId) || features.get(trackId.trim());

			return {
				id: trackId,
				name: item.track.name,
				durationMs: item.track.duration_ms,
				imageUrl: item.track.album.images[0]?.url || null,
				href: item.track.external_urls.spotify,
				artistIds: item.track.artists.map((a) => a.id),
				acousticness: feats?.acousticness ?? null,
				danceability: feats?.danceability ?? null,
				energy: feats?.energy ?? null,
				instrumentalness: feats?.instrumentalness ?? null,
				key: feats?.key ?? null,
				liveness: feats?.liveness ?? null,
				loudness: feats?.loudness ?? null,
				mode: feats?.mode ?? null,
				speechiness: feats?.speechiness ?? null,
				tempo: feats?.tempo ?? null,
				valence: feats?.valence ?? null,
			};
		});

		if (artists.length > 0) {
			const artistResult = await createArtists(artists);
			stats.artistsCreated = artistResult.created;
			stats.artistsUpdated = artistResult.updated;
		}

		if (tracksToSave.length > 0) {
			stats.tracksCreated = await createTracks(tracksToSave);
		}

		stats.playHistoryCreated = await createPlayHistory(userId, recent.items);

		await prisma.user.update({
			where: { id: userId },
			data: {
				isSyncing: false,
				lastSyncedAt: recent.items[0].played_at,
			},
		});

		return { success: true, stats };
	} catch (err) {
		await prisma.user.update({
			where: { id: userId },
			data: { isSyncing: false },
		});

		return {
			success: false,
			stats,
			error: err instanceof Error ? err.message : 'Unknown error',
		};
	}
};
