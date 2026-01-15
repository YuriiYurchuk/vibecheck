import { Activity, Guitar, Mic2, Volume2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/ui/fade-in';
import { StatCard } from '@/components/ui/stat-card';
import type { DashboardMoodResponse } from '@/types/dashboard';

type FeaturesStatsProps = {
	data: DashboardMoodResponse['averageFeatures'];
};

export const FeaturesStats = ({ data }: FeaturesStatsProps) => {
	const tMood = useTranslations('dashboard.pages.mood');
	const toPercent = (val: number | null) => Math.round((val ?? 0) * 100);

	const statCards = [
		{
			id: 'tempo',
			title: tMood('stats.avgTempo'),
			value: Math.round(data.avgTempo ?? 0),
			suffix: tMood('stats.bpmSuffix'),
			icon: <Activity className="size-5 text-primary" />,
			tooltip: tMood('tooltips.avgTempo'),
		},
		{
			id: 'loudness',
			title: tMood('stats.avgLoudness'),
			value: (data.avgLoudness ?? 0).toFixed(1),
			suffix: tMood('stats.dbSuffix'),
			icon: <Volume2 className="size-5 text-primary" />,
			tooltip: tMood('tooltips.avgLoudness'),
		},
		{
			id: 'instrumental',
			title: tMood('stats.instrumental'),
			value: toPercent(data.avgInstrumentalness),
			suffix: '%',
			icon: <Guitar className="size-5 text-primary" />,
			tooltip: tMood('tooltips.instrumental'),
		},
		{
			id: 'liveness',
			title: tMood('stats.liveRecordings'),
			value: toPercent(data.avgLiveness),
			suffix: '%',
			icon: <Mic2 className="size-5 text-primary" />,
			tooltip: tMood('tooltips.liveRecordings'),
		},
	];

	return (
		<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
			{statCards.map((stat, index) => (
				<FadeIn key={stat.id} delay={index * 100}>
					<StatCard
						title={stat.title}
						value={stat.value}
						suffix={stat.suffix}
						icon={stat.icon}
						tooltip={stat.tooltip}
					/>
				</FadeIn>
			))}
		</div>
	);
};
