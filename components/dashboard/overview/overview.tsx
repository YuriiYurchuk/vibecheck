'use client';

import { useQuery } from '@tanstack/react-query';
import { Calendar, ListFilter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LimitSelect, PeriodToggles } from '@/components/dashboard/filters';
import { FadeIn } from '@/components/ui/fade-in';
import { Separator } from '@/components/ui/separator';
import { useUrlFilters } from '@/hooks/use-url-filters';
import { fetchDashboardOverview } from '@/lib/api/overview';
import { useSession } from '@/lib/auth/client';
import type { Limit, Period } from '@/types/dashboard';
import { ContentSkeleton, HeaderSkeleton } from './skeleton';

type DashboardContentProps = {
	greetingKey: string;
};

export const Overview = ({ greetingKey }: DashboardContentProps) => {
	const t = useTranslations('dashboard');
	const session = useSession();
	const userName = session.data?.user?.name || '';

	const { filters, updateFilter, isReady } = useUrlFilters<{
		period: Period;
		limit: Limit;
	}>({
		storageKey: 'dashboard-preferences',
		defaults: { period: 'week', limit: 10 },
		deserializers: { limit: (val) => Number(val) as Limit },
	});

	const { data, isPending, isError, error } = useQuery({
		queryKey: ['dashboard-overview', filters?.period, filters?.limit],
		queryFn: () =>
			fetchDashboardOverview(filters?.period ?? 'week', filters?.limit ?? 10),
		enabled: isReady,
	});

	if (!isReady || !filters) {
		return (
			<div className="space-y-6">
				<HeaderSkeleton />
				<ContentSkeleton />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
				<FadeIn delay={200}>
					<h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-chart-3 to-chart-2 sm:text-4xl">
						{t(`greeting.${greetingKey}`, { name: userName })}
					</h1>
					<p className="text-muted-foreground mt-2 text-base">
						{t('subtitle')}
					</p>
				</FadeIn>
				<FadeIn delay={200} className="flex flex-wrap items-center gap-4">
					<div className="flex items-center gap-2">
						<Calendar className="w-4 h-4 text-muted-foreground" />
						<PeriodToggles
							value={filters.period}
							onChange={(val) => updateFilter('period', val)}
						/>
					</div>
					<Separator
						orientation="vertical"
						className="h-6! bg-border shrink-0 hidden sm:block"
					/>
					<div className="flex items-center gap-2">
						<ListFilter className="w-4 h-4 text-muted-foreground" />
						<LimitSelect
							value={filters.limit}
							onChange={(val) => updateFilter('limit', val)}
						/>
					</div>
				</FadeIn>
			</div>
			{isPending ? (
				<ContentSkeleton />
			) : isError ? (
				<div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
					<p className="font-semibold">{t('error.title')}</p>
					<p className="text-sm">{error?.message}</p>
				</div>
			) : (
				data && (
					<div>
						<pre className="p-4 bg-muted rounded-lg overflow-auto text-xs">
							{JSON.stringify(data, null, 2)}
						</pre>
					</div>
				)
			)}
		</div>
	);
};
