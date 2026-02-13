'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { MonthNavigator } from '@/components/dashboard/filters';
import { MetricCard } from '@/components/dashboard/insights/metric-card';
import { MoodCard } from '@/components/dashboard/insights/mood-card';
import { StreakCard } from '@/components/dashboard/insights/streak-card';
import { TotalTimeCard } from '@/components/dashboard/insights/total-time-card';
import { FadeIn } from '@/components/ui/fade-in';
import { generateMockInsights } from '@/lib/mock-data/dashboard';

type DayKey =
	| 'monday'
	| 'tuesday'
	| 'wednesday'
	| 'thursday'
	| 'friday'
	| 'saturday'
	| 'sunday';

export const InsightsDemo = () => {
	const tInsights = useTranslations('dashboard.pages.insights');
	const tShared = useTranslations('dashboard.shared');
	const timezone = 'UTC';

	const [month, setMonth] = useState(0);
	const [data, setData] = useState<ReturnType<
		typeof generateMockInsights
	> | null>(null);

	useEffect(() => {
		setData(generateMockInsights(month, timezone));
	}, [month]);

	if (!data) return null;

	const dayName = data.mostActiveDay.day;
	const localizedDay =
		data.mostActiveDay.count > 0
			? tShared(`days.${dayName.toLowerCase() as DayKey}`)
			: '-';

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
					<MonthNavigator value={month} onChange={(val) => setMonth(val)} />
				</FadeIn>
			</div>
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
		</div>
	);
};
