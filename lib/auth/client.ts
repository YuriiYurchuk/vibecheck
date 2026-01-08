import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
	baseURL: process.env.BETTER_AUTH_URL,
	plugins: [
		inferAdditionalFields({
			user: {
				timezone: {
					type: 'string',
				},
			},
		}),
	],
});

export const { signIn, signOut, useSession } = authClient;
