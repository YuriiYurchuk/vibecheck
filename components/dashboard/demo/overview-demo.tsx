'use client';

import { Calendar, ListFilter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { LimitSelect, PeriodToggles } from '@/components/dashboard/filters';
import { OverviewChart } from '@/components/dashboard/overview/chart';
import { MediaList } from '@/components/dashboard/overview/media-list';
import { SummaryStatsGrid } from '@/components/dashboard/overview/summary-stats';
import { FadeIn } from '@/components/ui/fade-in';
import { Separator } from '@/components/ui/separator';
import { generateMockOverview } from '@/lib/mock-data/dashboard';
import type { Limit, Period } from '@/types/dashboard';

type GreetingKey = 'morning' | 'afternoon' | 'evening' | 'default';

type OverviewDemoProps = {
	greetingKey: GreetingKey;
	userName?: string;
};

export const OverviewDemo = ({
	greetingKey,
	userName = 'Demo User',
}: OverviewDemoProps) => {
	const tOverview = useTranslations('dashboard.pages.overview');
	const timezone = 'UTC';

	const [period, setPeriod] = useState<Period>('week');
	const [limit, setLimit] = useState<Limit>(10);
	const [data, setData] = useState<ReturnType<
		typeof generateMockOverview
	> | null>(null);

	useEffect(() => {
		setData(generateMockOverview(period, limit, timezone));
	}, [period, limit]);

	if (!data) return null;

	return (
		<div className="space-y-6">
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<FadeIn delay={100} className="flex-1 space-y-1">
					<h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-chart-3 to-chart-2 sm:text-4xl">
						{tOverview(`greeting.${greetingKey}`, { name: userName })}
					</h1>
					<p className="text-muted-foreground mt-2 text-base max-w-2xl">
						{tOverview('subtitle')}
					</p>
				</FadeIn>
				<FadeIn delay={200}>
					<div className="flex flex-wrap gap-3 items-center w-full lg:w-auto lg:flex-col lg:items-end xl:flex-row xl:items-center">
						<div className="flex items-center gap-2">
							<Calendar className="size-4 text-primary shrink-0" />
							<PeriodToggles
								value={period}
								onChange={(val) => setPeriod(val)}
							/>
						</div>
						<Separator
							orientation="vertical"
							className="h-7! hidden min-[460px]:block lg:hidden xl:block"
						/>
						<div className="flex items-center gap-2">
							<ListFilter className="size-4 text-primary shrink-0" />
							<LimitSelect value={limit} onChange={(val) => setLimit(val)} />
						</div>
					</div>
				</FadeIn>
			</div>
			<SummaryStatsGrid summary={data.summary} />
			<OverviewChart data={data.weeklyActivity} timezone={timezone} />
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="space-y-4">
					<h2 className="text-xl font-semibold">
						{tOverview('mediaList.topTracks')}
					</h2>
					<MediaList items={data.topTracks} type="track" />
				</div>
				<div className="space-y-4">
					<h2 className="text-xl font-semibold">
						{tOverview('mediaList.topArtists')}
					</h2>
					<MediaList items={data.topArtists} type="artist" />
				</div>
			</div>
		</div>
	);
};
