import { SPOTIFY_API_BASE, SPOTIFY_ERRORS } from './constants';
import { isSpotifyReconnectError, updateSpotifyAccountError } from './helpers';
import { getSpotifyAccessToken } from './token';

export const spotifyFetch = async <T = unknown>(
	userId: string,
	endpoint: string,
	options?: RequestInit
): Promise<T> => {
	try {
		const token = await getSpotifyAccessToken(userId);

		const res = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
			...options,
			headers: { Authorization: `Bearer ${token}`, ...options?.headers },
		});

		if (res.status === 401) {
			await updateSpotifyAccountError(
				userId,
				true,
				SPOTIFY_ERRORS.RECONNECT_NEEDED
			);
			throw new Error(SPOTIFY_ERRORS.RECONNECT_NEEDED);
		}

		if (!res.ok) {
			throw new Error(`Spotify error: ${res.status}`);
		}

		await updateSpotifyAccountError(userId, false);

		return res.json() as Promise<T>;
	} catch (err) {
		if (err instanceof Error && isSpotifyReconnectError(err.message)) {
			await updateSpotifyAccountError(userId, true, err.message);
			throw new Error(SPOTIFY_ERRORS.RECONNECT_NEEDED);
		}

		throw err;
	}
};
