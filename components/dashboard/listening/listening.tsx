'use client';

import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { YearSelect } from '@/components/dashboard/filters';
import { ErrorState } from '@/components/ui/error-state';
import { FadeIn } from '@/components/ui/fade-in';
import { useUrlFilters } from '@/hooks/use-url-filters';
import { fetchDashboardListening } from '@/lib/api/listening';
import { useSession } from '@/lib/auth/client';
import { ListeningCalendar } from './calendar';
import { ListeningChart } from './chart';
import { ContentSkeleton, HeaderSkeleton } from './skeleton';

type ListeningFilters = {
	year: string;
};

export const Listening = () => {
	const session = useSession();
	const createdAt = session.data?.user?.createdAt;
	const tListening = useTranslations('dashboard.pages.listening');

	const { filters, updateFilter, isReady } = useUrlFilters<ListeningFilters>({
		storageKey: 'dashboard-listening',
		defaults: { year: 'last_year' },
		deserializers: { year: (val) => val },
	});
	const currentYear = new Date().getFullYear();
	const startYear = createdAt ? new Date(createdAt).getFullYear() : currentYear;

	const { data, isPending, isError, error, refetch } = useQuery({
		queryKey: ['dashboard-listening', filters.year],
		queryFn: () => fetchDashboardListening(filters.year),
		enabled: isReady,
	});

	const displayPeriod =
		filters.year === 'last_year'
			? tListening('periodLastYear')
			: tListening('periodYear', { year: filters.year });

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
					<div className="mx-auto w-fit">
						<ListeningCalendar data={data.yearCalendar} />
					</div>
					<ListeningChart data={data.hourlyActivity} />
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
		<div className="space-y-6 w-full overflow-hidden">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<FadeIn delay={100}>
					<h2 className="text-muted-foreground text-xl font-semibold">
						{tListening.rich('title', {
							period: displayPeriod,
							highlight: (chunks) => (
								<span className="text-primary font-medium">{chunks}</span>
							),
						})}
					</h2>
				</FadeIn>
				<FadeIn delay={200} className="flex items-center gap-2">
					<Calendar className="size-4 text-primary shrink-0" />
					<YearSelect
						value={filters.year}
						onChange={(val) => updateFilter('year', val)}
						fromYear={startYear}
					/>
				</FadeIn>
			</div>
			{renderContent()}
		</div>
	);
};
