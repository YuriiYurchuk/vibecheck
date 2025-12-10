'use server';

import { cookies } from 'next/headers';
import { requireSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db';

export const Timezone = async (timezone: string) => {
	try {
		const session = await requireSession().catch(() => null);

		if (!session?.user) {
			return;
		}

		const cookieStore = await cookies();
		const currentCookieZone = cookieStore.get('user-timezone')?.value;

		if (currentCookieZone === timezone) {
			return;
		}

		try {
			Intl.DateTimeFormat(undefined, { timeZone: timezone });
		} catch {
			throw new Error('Invalid timezone');
		}

		await prisma.user.update({
			where: { id: session.user.id },
			data: { timezone },
		});

		cookieStore.set('user-timezone', timezone, {
			maxAge: 60 * 60 * 24 * 365,
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
		});
	} catch (err) {
		console.error('[Timezone] Error:', err);
	}
};
