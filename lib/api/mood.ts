import type { DashboardMoodResponse } from '@/types/dashboard';

export const fetchDashboardMood = async (
	period: string,
	mode: 'rolling' | 'calendar'
): Promise<DashboardMoodResponse> => {
	const params = new URLSearchParams({
		period,
		mode,
	});

	const res = await fetch(`/api/dashboard/mood?${params}`);

	if (!res.ok) {
		throw new Error('Network response was not ok');
	}

	return res.json();
};
