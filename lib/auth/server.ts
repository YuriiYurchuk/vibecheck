import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { prisma } from '@/lib/db';

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),

	socialProviders: {
		spotify: {
			clientId: process.env.SPOTIFY_CLIENT_ID as string,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
			scope: ['user-read-recently-played'],
			overrideUserInfoOnSignIn: true,
			mapProfileToUser: (profile) => {
				return {
					id: profile.id,
					email: profile.email,
					name: profile.display_name,
					image: profile.images?.[0]?.url,
				};
			},
		},
	},
	session: {
		expiresIn: 60 * 60 * 24 * 90,
		updateAge: 60 * 60 * 24,
	},
	onAPIError: {
		errorURL: '/',
	},
	plugins: [nextCookies()],
});
