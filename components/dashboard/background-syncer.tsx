'use client';

import { useQuery } from '@tanstack/react-query';

export const BackgroundSyncer = () => {
	useQuery({
		queryKey: ['background-track-sync'],
		queryFn: async () => {
			const res = await fetch('/api/sync', { method: 'POST' });
			return { success: res.ok };
		},
		refetchInterval: 15 * 60 * 1000,
		refetchIntervalInBackground: false,
		refetchOnMount: true,
		refetchOnWindowFocus: false,
		retry: 0,
		gcTime: 0,
	});

	return null;
};
