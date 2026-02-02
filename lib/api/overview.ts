import type {
	DashboardOverviewResponse,
	Limit,
	Period,
} from '@/types/dashboard';

export const fetchDashboardOverview = async (
	period: Period,
	limit: Limit
): Promise<DashboardOverviewResponse> => {
	const params = new URLSearchParams({
		period,
		limit: limit.toString(),
	});

	const res = await fetch(`/api/dashboard/overview?${params}`);

	if (!res.ok) {
		throw new Error('Network response was not ok');
	}

	return res.json();
};
