import { headers } from 'next/headers';
import { auth } from './server';

export async function requireSession() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error('Unauthorized');
	}

	return session;
}
