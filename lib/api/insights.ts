import type { DashboardInsightsResponse } from '@/types/dashboard';

export const fetchDashboardInsights = async (
	month: number
): Promise<DashboardInsightsResponse> => {
	const params = new URLSearchParams({
		month: month.toString(),
	});
	const res = await fetch(`/api/dashboard/insights?${params}`);

	if (!res.ok) {
		throw new Error('Network response was not ok');
	}

	return res.json();
};
