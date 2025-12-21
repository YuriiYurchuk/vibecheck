import { startOfDay, subDays } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

export const getDateSince = (period: string, timezone: string): Date => {
	const nowInTZ = toZonedTime(new Date(), timezone);
	const todayStartInTZ = startOfDay(nowInTZ);

	switch (period) {
		case 'week': {
			const weekAgoInTZ = subDays(todayStartInTZ, 7);
			return fromZonedTime(weekAgoInTZ, timezone);
		}
		case 'month': {
			const monthAgoInTZ = subDays(todayStartInTZ, 30);
			return fromZonedTime(monthAgoInTZ, timezone);
		}
		default: {
			return fromZonedTime(todayStartInTZ, timezone);
		}
	}
};
