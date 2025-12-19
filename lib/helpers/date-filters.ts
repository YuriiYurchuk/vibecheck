import { getTodayInUserTz } from './date';

export const getDateSince = (period: string, timezone: string): Date => {
	const now = new Date();

	switch (period) {
		case 'week': {
			const todayStr = getTodayInUserTz(timezone);
			const targetDate = new Date(todayStr);
			targetDate.setDate(targetDate.getDate() - 7);
			return targetDate;
		}
		case 'month': {
			const todayStr = getTodayInUserTz(timezone);
			const targetDate = new Date(todayStr);
			targetDate.setDate(targetDate.getDate() - 30);
			return targetDate;
		}
		default: {
			const last24Hours = new Date(now);
			last24Hours.setHours(last24Hours.getHours() - 24);
			return last24Hours;
		}
	}
};
