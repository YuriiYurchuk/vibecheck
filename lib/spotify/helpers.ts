import { prisma } from '@/lib/db/prisma';
import { SPOTIFY_ERRORS, SPOTIFY_PROVIDER_ID } from './constants';

export const updateSpotifyAccountError = async (
	userId: string,
	hasError: boolean,
	errorMessage?: string
) => {
	await prisma.account.updateMany({
		where: { userId, providerId: SPOTIFY_PROVIDER_ID },
		data: {
			hasError,
			lastError: errorMessage ?? null,
			lastErrorAt: hasError ? new Date() : null,
		},
	});
};

export const isSpotifyReconnectError = (errorMessage: string): boolean => {
	const reconnectErrors = [
		SPOTIFY_ERRORS.REVOKED,
		SPOTIFY_ERRORS.EXPIRED,
		SPOTIFY_ERRORS.NO_TOKEN,
		SPOTIFY_ERRORS.RECONNECT_NEEDED,
	] as string[];
	return reconnectErrors.includes(errorMessage);
};
