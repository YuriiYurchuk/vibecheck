import { chunkArray, delay } from '@/lib/utils';
import type { ArtistBasicInfo, SpotifyArtistsResponse } from '@/types/spotify';
import { spotifyFetch } from './fetch';

export const fetchArtists = async (
	artistIds: string[],
	userId: string
): Promise<ArtistBasicInfo[]> => {
	if (artistIds.length === 0) return [];

	const uniqueIds = [...new Set(artistIds)];
	const artists: ArtistBasicInfo[] = [];
	const BATCH_SIZE = 50;
	const chunks = chunkArray(uniqueIds, BATCH_SIZE);

	for (let i = 0; i < chunks.length; i++) {
		try {
			const ids = chunks[i].join(',');
			const res = await spotifyFetch<SpotifyArtistsResponse>(
				userId,
				`/artists?ids=${ids}`
			);

			if (res?.artists) {
				res.artists.forEach((artist) => {
					if (artist) {
						artists.push({
							id: artist.id,
							name: artist.name,
							imageUrl: artist.images?.[0]?.url || null,
							href: artist.external_urls.spotify,
						});
					}
				});
			}

			if (i < chunks.length - 1) {
				await delay(100);
			}
		} catch (err) {
			console.error('[Spotify Artists] Batch error:', err);

			if (err instanceof Error && err.message.includes('RECONNECT_NEEDED')) {
				throw err;
			}
		}
	}

	return artists;
};
