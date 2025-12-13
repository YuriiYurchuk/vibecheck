export const getDateSince = (period: string, timezone: string): Date => {
	const nowInUserTz = new Date(
		new Date().toLocaleString('en-US', { timeZone: timezone })
	);

	switch (period) {
		case 'week': {
			const weekAgo = new Date(nowInUserTz);
			weekAgo.setDate(weekAgo.getDate() - 7);
			weekAgo.setHours(0, 0, 0, 0);
			return weekAgo;
		}
		case 'month': {
			const monthAgo = new Date(nowInUserTz);
			monthAgo.setDate(monthAgo.getDate() - 30);
			monthAgo.setHours(0, 0, 0, 0);
			return monthAgo;
		}
		default: {
			const startOfDay = new Date(nowInUserTz);
			startOfDay.setHours(0, 0, 0, 0);
			return startOfDay;
		}
	}
};
