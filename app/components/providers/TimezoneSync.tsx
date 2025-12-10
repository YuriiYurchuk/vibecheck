'use client';
import { useEffect } from 'react';
import { Timezone } from '@/lib/actions/timezone';

export const TimezoneSync = () => {
	useEffect(() => {
		try {
			const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			if (timezone) {
				Timezone(timezone);
			}
		} catch (err) {
			console.error('[TimezoneSync] Error:', err);
		}
	}, []);

	return null;
};
