'use client';

import { useQuery } from '@tanstack/react-query';
import { Calendar, ListFilter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LimitSelect, PeriodToggles } from '@/components/dashboard/filters';
import { ErrorState } from '@/components/ui/error-state';
import { FadeIn } from '@/components/ui/fade-in';
import { Separator } from '@/components/ui/separator';
import { useUrlFilters } from '@/hooks/use-url-filters';
import { fetchDashboardOverview } from '@/lib/api/overview';
import { useSession } from '@/lib/auth/client';
import type { Limit, Period } from '@/types/dashboard';
import { OverviewChart } from './chart';
import { MediaList } from './media-list';
import { ContentSkeleton, HeaderSkeleton } from './skeleton';
import { SummaryStatsGrid } from './summary-stats';

type GreetingKey =
	keyof IntlMessages['dashboard']['pages']['overview']['greeting'];

type DashboardContentProps = {
	greetingKey: GreetingKey;
};

export const Overview = ({ greetingKey }: DashboardContentProps) => {
	const tOverview = useTranslations('dashboard.pages.overview');
	const session = useSession();
	const userName = session.data?.user?.name || '';
	const timezone = session.data?.user?.timezone || 'UTC';

	const { filters, updateFilter, isReady } = useUrlFilters<{
		period: Period;
		limit: Limit;
	}>({
		storageKey: 'dashboard-overview',
		defaults: { period: 'week', limit: 10 },
		deserializers: { limit: (val) => Number(val) as Limit },
	});

	const { data, isPending, isError, error, refetch } = useQuery({
		queryKey: ['dashboard-overview', filters.period, filters.limit],
		queryFn: () => fetchDashboardOverview(filters.period, filters.limit),
		enabled: isReady,
	});

	const renderContent = () => {
		if (isPending) {
			return <ContentSkeleton />;
		}

		if (isError) {
			return (
				<FadeIn delay={200}>
					<ErrorState message={error?.message} retry={() => refetch()} />
				</FadeIn>
			);
		}

		if (data) {
			return (
				<>
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
				</>
			);
		}

		return null;
	};

	if (!isReady) {
		return (
			<div className="space-y-6">
				<HeaderSkeleton />
				<ContentSkeleton />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
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
								value={filters.period}
								onChange={(val) => updateFilter('period', val)}
							/>
						</div>
						<Separator
							orientation="vertical"
							className="h-7! hidden min-[460px]:block lg:hidden xl:block"
						/>
						<div className="flex items-center gap-2">
							<ListFilter className="size-4 text-primary shrink-0" />
							<LimitSelect
								value={filters.limit}
								onChange={(val) => updateFilter('limit', val)}
							/>
						</div>
					</div>
				</FadeIn>
			</div>
			{renderContent()}
		</div>
	);
};
