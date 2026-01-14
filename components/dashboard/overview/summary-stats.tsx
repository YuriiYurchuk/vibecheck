'use client';

import { Clock, Disc3, Mic2, Music } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/ui/fade-in';
import { StatCard } from '@/components/ui/stat-card';
import type { DashboardOverviewResponse } from '@/types/dashboard';

type SummaryStatsGridProps = {
	summary: DashboardOverviewResponse['summary'];
};

export const SummaryStatsGrid = ({ summary }: SummaryStatsGridProps) => {
	const tStats = useTranslations('dashboard.pages.overview.stats');

	const statCards = [
		{
			id: 'total-hours',
			icon: <Clock className="w-5 h-5 text-primary" />,
			title: tStats('totalHours'),
			value: summary.totalHours,
			suffix: tStats('hoursSuffix'),
		},
		{
			id: 'total-plays',
			icon: <Music className="w-5 h-5 text-primary" />,
			title: tStats('totalPlays'),
			value: summary.totalPlays,
		},
		{
			id: 'unique-artists',
			icon: <Mic2 className="w-5 h-5 text-primary" />,
			title: tStats('uniqueArtists'),
			value: summary.uniqueArtists,
		},
		{
			id: 'unique-tracks',
			icon: <Disc3 className="w-5 h-5 text-primary" />,
			title: tStats('uniqueTracks'),
			value: summary.uniqueTracks,
		},
	];

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
			{statCards.map((stat, index) => (
				<FadeIn key={stat.id} delay={index * 100}>
					<StatCard {...stat} />
				</FadeIn>
			))}
		</div>
	);
};
