'use client';

import { useQuery } from '@tanstack/react-query';
import { Calendar, CalendarClock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ModeToggle, PeriodToggles } from '@/components/dashboard/filters';
import { ErrorState } from '@/components/ui/error-state';
import { FadeIn } from '@/components/ui/fade-in';
import { Separator } from '@/components/ui/separator';
import { useUrlFilters } from '@/hooks/use-url-filters';
import { fetchDashboardMood } from '@/lib/api/mood';
import type { Mode, Period } from '@/types/dashboard';
import { AudioFeaturesRadar } from './audio-features-radar';
import { FeaturesStats } from './features-stats';
import { KeysDistributionChart } from './keys-distribution-chart';
import { ModalityPieChart } from './modality-pie-chart';
import { MoodPersonality } from './mood-personality';
import { MoodScatterChart } from './scatter-chart';
import { ContentSkeleton, HeaderSkeleton } from './skeleton';
import { TempoChart } from './tempo-chart';

export const Mood = () => {
	const tMood = useTranslations('dashboard.pages.mood');

	const { filters, updateFilter, updateMultipleFilters, isReady } =
		useUrlFilters<{
			period: Period;
			mode: Mode;
		}>({
			storageKey: 'dashboard-mood',
			defaults: {
				period: 'month',
				mode: 'rolling',
			},
		});

	const { data, isPending, isError, error, refetch } = useQuery({
		queryKey: ['dashboard-mood', filters.period, filters.mode],
		queryFn: () => fetchDashboardMood(filters.period, filters.mode),
		enabled: isReady,
	});

	const handleModeChange = (newMode: Mode) => {
		if (newMode === 'calendar') {
			updateMultipleFilters({ mode: newMode, period: 'month' });
		} else {
			updateFilter('mode', newMode);
		}
	};

	const handlePeriodChange = (newPeriod: Period) => {
		if (filters.mode !== 'calendar') {
			updateFilter('period', newPeriod);
		}
	};

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
			const { tracksWithFeatures, totalTracks } = data.averageFeatures;
			const coveragePercent =
				totalTracks > 0
					? Math.round((tracksWithFeatures / totalTracks) * 100)
					: 0;

			return (
				<>
					<FeaturesStats data={data.averageFeatures} />
					<FadeIn delay={200}>
						<MoodPersonality
							features={data.averageFeatures}
							mode={data.modeDistribution}
						/>
					</FadeIn>
					<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
						<AudioFeaturesRadar moodData={data.averageFeatures} />
						<ModalityPieChart data={data.modeDistribution} />
					</div>
					<KeysDistributionChart data={data.keyDistribution} />
					<MoodScatterChart data={data.scatterData} />
					<TempoChart data={data.tempoDistribution} />
					<div className="mt-8 flex flex-col items-center gap-3">
						<Separator />
						<p className="text-sm text-muted-foreground text-center">
							{tMood('footer', {
								count: tracksWithFeatures.toString(),
								total: totalTracks.toString(),
								percent: coveragePercent.toString(),
							})}
						</p>
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
					<h2 className="text-muted-foreground text-xl font-semibold">
						{tMood('title')}
					</h2>
				</FadeIn>
				<FadeIn
					delay={200}
					className="flex flex-wrap gap-3 items-center w-full lg:w-auto lg:flex-col lg:items-end xl:flex-row xl:items-center"
				>
					<div className="flex items-center gap-2">
						<Calendar className="size-4 text-primary shrink-0" />
						<PeriodToggles
							value={filters.period}
							onChange={handlePeriodChange}
							disabled={filters.mode === 'calendar'}
						/>
					</div>
					<Separator
						orientation="vertical"
						className="h-7! hidden min-[598px]:block lg:hidden xl:block"
					/>
					<div className="flex items-center gap-2">
						<CalendarClock className="size-4 text-primary shrink-0" />
						<ModeToggle mode={filters.mode} onChange={handleModeChange} />
					</div>
				</FadeIn>
			</div>
			{renderContent()}
		</div>
	);
};
