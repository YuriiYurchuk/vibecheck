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

export function isSpotifyReconnectError(errorMessage: string): boolean {
	const reconnectErrors: string[] = [
		SPOTIFY_ERRORS.REVOKED,
		SPOTIFY_ERRORS.EXPIRED,
		SPOTIFY_ERRORS.NO_TOKEN,
	];
	return reconnectErrors.includes(errorMessage);
}
