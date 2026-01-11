import { format, subDays } from 'date-fns';
import type { Activity } from 'react-activity-calendar';
import type { DashboardListeningResponse } from '@/types/dashboard';

export const transformDataForCalendar = (
	data: DashboardListeningResponse['yearCalendar']
): Activity[] => {
	if (data && data.length > 0) {
		const maxCount = Math.max(...data.map((d) => d.count)) || 1;

		return data.map((item) => {
			const intensity =
				item.count === 0 ? 0 : Math.ceil((item.count / maxCount) * 4);

			return {
				date: item.date,
				count: item.count,
				level: Math.min(intensity, 4) as 0 | 1 | 2 | 3 | 4,
			};
		});
	}

	const today = new Date();
	const emptyData: Activity[] = [];

	for (let i = 364; i >= 0; i--) {
		const date = subDays(today, i);
		emptyData.push({
			date: format(date, 'yyyy-MM-dd'),
			count: 0,
			level: 0,
		});
	}

	return emptyData;
};
