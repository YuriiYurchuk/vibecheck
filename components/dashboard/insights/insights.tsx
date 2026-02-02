'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { MonthNavigator } from '@/components/dashboard/filters';
import { ErrorState } from '@/components/ui/error-state';
import { FadeIn } from '@/components/ui/fade-in';
import { useUrlFilters } from '@/hooks/use-url-filters';
import { fetchDashboardInsights } from '@/lib/api/insights';
import { MetricCard } from './metric-card';
import { MoodCard } from './mood-card';
import { ContentSkeleton, HeaderSkeleton } from './skeleton';
import { StreakCard } from './streak-card';
import { TotalTimeCard } from './total-time-card';

type DayKey =
	| 'monday'
	| 'tuesday'
	| 'wednesday'
	| 'thursday'
	| 'friday'
	| 'saturday'
	| 'sunday';

export const Insights = () => {
	const tInsights = useTranslations('dashboard.pages.insights');
	const tShared = useTranslations('dashboard.shared');
	const { filters, updateFilter, isReady } = useUrlFilters<{
		month: number;
	}>({
		storageKey: 'dashboard-insights',
		defaults: {
			month: 0,
		},
		deserializers: {
			month: (value) => parseInt(value, 10),
		},
	});

	const { data, isPending, isError, error, refetch } = useQuery({
		queryKey: ['dashboard-insights', filters.month],
		queryFn: () => fetchDashboardInsights(filters.month),
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
			const dayName = data.mostActiveDay.day;

			const localizedDay =
				data.mostActiveDay.count > 0
					? tShared(`days.${dayName.toLowerCase() as DayKey}`)
					: '-';

			return (
				<>
					<FadeIn delay={100}>
						<TotalTimeCard
							title={tInsights('stats.totalTime')}
							hours={data.totalHours.hours}
							minutes={data.totalHours.minutes}
							hoursLabel={tInsights('stats.h')}
							minutesLabel={tInsights('stats.m')}
							trend={{
								value: data.comparison.percentChange,
								isIncrease: data.comparison.isIncrease,
								label: tInsights('stats.vsLastMonth'),
							}}
						/>
					</FadeIn>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
						<FadeIn delay={200} className="h-full">
							<MetricCard
								label={tInsights('stats.mostActiveDay')}
								value={localizedDay}
								subtext={
									data.mostActiveDay.count > 0
										? tInsights('stats.plays', {
												count: data.mostActiveDay.count,
											})
										: tInsights('stats.noData')
								}
							/>
						</FadeIn>
						<FadeIn delay={300} className="h-full">
							<MetricCard
								label={tInsights('stats.peakTime')}
								value={data.peakHour.count > 0 ? data.peakHour.range : '-'}
								subtext={
									data.peakHour.count > 0
										? tInsights('stats.plays', {
												count: data.peakHour.count,
											})
										: tInsights('stats.noData')
								}
							/>
						</FadeIn>
						<FadeIn delay={400} className="h-full">
							<MoodCard
								title={tInsights('stats.mood.title')}
								energy={data.musicalMood.energy}
								valence={data.musicalMood.valence}
								labels={{
									energy: tInsights('stats.mood.energy'),
									positivity: tInsights('stats.mood.positivity'),
									moods: {
										energetic: tInsights('stats.mood.types.energetic'),
										chill: tInsights('stats.mood.types.chill'),
										intense: tInsights('stats.mood.types.intense'),
										melancholic: tInsights('stats.mood.types.melancholic'),
										balanced: tInsights('stats.mood.types.balanced'),
										noData: tInsights('stats.mood.types.noData'),
									},
								}}
							/>
						</FadeIn>
						<FadeIn delay={500} className="h-full">
							<StreakCard
								current={data.streak.currentStreak}
								longest={data.streak.longestStreak}
								labels={{
									title: tInsights('stats.streaks.title'),
									longest: tInsights('stats.streaks.longest'),
									current: tInsights('stats.streaks.current'),
									days: tInsights('stats.streaks.days'),
									keepItUp: tInsights('stats.streaks.keepItUp'),
								}}
							/>
						</FadeIn>
					</div>
				</>
			);
		}

		return null;
	};

	if (!isReady)
		return (
			<div className="space-y-6">
				<HeaderSkeleton />
				<ContentSkeleton />
			</div>
		);

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<FadeIn delay={200}>
					<h2 className="text-muted-foreground text-xl font-semibold">
						{tInsights('title')}
					</h2>
					<p className="text-muted-foreground mt-2 text-base max-w-2xl">
						{tInsights('subtitle')}
					</p>
				</FadeIn>
				<FadeIn delay={200}>
					<MonthNavigator
						value={filters.month}
						onChange={(val) => updateFilter('month', val)}
					/>
				</FadeIn>
			</div>
			{renderContent()}
		</div>
	);
};
