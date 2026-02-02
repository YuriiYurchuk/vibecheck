import type { DashboardRecentResponse } from '@/types/dashboard';

export const fetchDashboardRecent = async (
	limit: number,
	offset: number,
	search: string
): Promise<DashboardRecentResponse> => {
	const params = new URLSearchParams({
		limit: limit.toString(),
		offset: offset.toString(),
	});

	if (search) {
		params.set('search', search);
	}

	const res = await fetch(`/api/dashboard/recent?${params}`);

	if (!res.ok) {
		throw new Error('Network response was not ok');
	}

	return res.json();
};
