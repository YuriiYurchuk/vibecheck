import type { DashboardListeningResponse } from '@/types/dashboard';

export const fetchDashboardListening = async (
	year: string
): Promise<DashboardListeningResponse> => {
	const params = new URLSearchParams({
		year,
	});
	const res = await fetch(`/api/dashboard/listening?${params}`);

	if (!res.ok) {
		throw new Error('Network response was not ok');
	}

	return res.json();
};
