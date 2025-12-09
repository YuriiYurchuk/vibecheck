import type { SpotifyHistoryResponse } from '@/types/spotify';
import { spotifyFetch } from './fetch';

export const fetchRecentTracks = async (userId: string, after?: string) => {
	try {
		const params = new URLSearchParams({ limit: '50' });

		if (after) {
			params.append('after', after);
		}

		const url = `/me/player/recently-played?${params.toString()}`;
		const res = await spotifyFetch<SpotifyHistoryResponse>(userId, url);

		if (!res?.items?.length) {
			return {
				items: [],
				trackIds: [],
				artistIds: [],
				cursor: undefined,
				hasMore: false,
			};
		}

		const trackIds = res.items.map((item) => item.track.id);
		const artistIds = Array.from(
			new Set(res.items.flatMap((item) => item.track.artists.map((a) => a.id)))
		);

		return {
			items: res.items,
			trackIds,
			artistIds,
			cursor: res.cursors?.after,
			hasMore: !!res.next,
		};
	} catch (err) {
		if (err instanceof Error && err.message.includes('RECONNECT_NEEDED')) {
			throw err;
		}

		return {
			items: [],
			trackIds: [],
			artistIds: [],
			cursor: undefined,
			hasMore: false,
		};
	}
};
