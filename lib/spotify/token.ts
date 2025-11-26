import { auth } from '@/lib/auth/server';
import { SPOTIFY_ERRORS, SPOTIFY_PROVIDER_ID } from './constants';

type SpotifyTokenResponse = {
	accessToken: string;
};

export const getSpotifyAccessToken = async (
	userId: string
): Promise<string> => {
	try {
		const tokenResponse: SpotifyTokenResponse | null =
			await auth.api.getAccessToken({
				body: { providerId: SPOTIFY_PROVIDER_ID, userId },
			});

		if (!tokenResponse?.accessToken) {
			throw new Error(SPOTIFY_ERRORS.NO_TOKEN);
		}

		return tokenResponse.accessToken;
	} catch (err: unknown) {
		const error = err as {
			cause?: { error?: string };
			response?: { data?: { error?: string } };
			message?: string;
		};

		const errorCode =
			error?.cause?.error ??
			error?.response?.data?.error ??
			error?.message ??
			'UNKNOWN_ERROR';

		if (errorCode === 'invalid_grant') {
			throw new Error(SPOTIFY_ERRORS.REVOKED);
		}

		if (errorCode === 'invalid_token') {
			throw new Error(SPOTIFY_ERRORS.EXPIRED);
		}

		throw new Error(SPOTIFY_ERRORS.ACCESS_ERROR);
	}
};
