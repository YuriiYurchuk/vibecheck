'use client';

import type { Day, Month } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { ActivityCalendar } from 'react-activity-calendar';
import { Card, CardContent } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useCalendarSize } from '@/hooks/use-calendar-size';
import { useDateFormatter } from '@/hooks/use-date-formatter';
import { transformDataForCalendar } from '@/lib/helpers';
import type { DashboardListeningResponse } from '@/types/dashboard';
import { CalendarTooltip } from './calendar-tooltip';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

type ListeningCalendarProps = {
	data: DashboardListeningResponse['yearCalendar'];
};

export const ListeningCalendar = ({ data }: ListeningCalendarProps) => {
	const { formatDate, rawLocale } = useDateFormatter();
	const activities = transformDataForCalendar(data);
	const tCalendar = useTranslations('dashboard.pages.listening.calendar');
	const calendarSize = useCalendarSize();

	const totalLabel = useMemo(() => {
		if (!activities.length) return tCalendar.raw('total');

		const startYear = new Date(activities[0].date).getFullYear();
		const endYear = new Date(
			activities[activities.length - 1].date
		).getFullYear();

		if (startYear !== endYear) {
			return tCalendar.raw('totalLastYear');
		}

		return tCalendar.raw('total');
	}, [activities, tCalendar]);

	const labels = useMemo(
		() => ({
			months: Array.from({ length: 12 }, (_, i) => {
				const name =
					rawLocale.localize?.month(i as Month, { width: 'abbreviated' }) ?? '';
				return capitalize(name);
			}),
			weekdays: Array.from({ length: 7 }, (_, i) => {
				const isUk = rawLocale.code === 'uk';
				const dayWidth = isUk ? 'short' : 'abbreviated';
				const name =
					rawLocale.localize?.day(i as Day, { width: dayWidth }) ?? '';
				return capitalize(name);
			}),
			totalCount: totalLabel,
			legend: {
				less: tCalendar('less'),
				more: tCalendar('more'),
			},
		}),
		[rawLocale, tCalendar, totalLabel]
	);

	const themeColors = {
		light: [
			'var(--muted)',
			'color-mix(in oklch, var(--primary) 25%, var(--muted))',
			'color-mix(in oklch, var(--primary) 50%, var(--muted))',
			'color-mix(in oklch, var(--primary) 75%, var(--muted))',
			'var(--primary)',
		],
		dark: [
			'var(--muted)',
			'color-mix(in oklch, var(--primary) 25%, var(--muted))',
			'color-mix(in oklch, var(--primary) 50%, var(--muted))',
			'color-mix(in oklch, var(--primary) 75%, var(--muted))',
			'var(--primary)',
		],
	};

	return (
		<TooltipProvider delayDuration={0}>
			<Card className="py-3 md:py-6">
				<CardContent className="grid grid-cols-1 min-w-0 px-3 md:px-6">
					<ActivityCalendar
						data={activities}
						fontSize={calendarSize.fontSize}
						blockSize={calendarSize.blockSize}
						blockMargin={calendarSize.blockMargin}
						blockRadius={calendarSize.blockRadius}
						theme={themeColors}
						labels={labels}
						weekStart={1}
						showTotalCount={true}
						showWeekdayLabels
						renderBlock={(block, activity) => (
							<CalendarTooltip
								block={
									block as React.ReactElement<React.SVGProps<SVGRectElement>>
								}
								activity={activity}
								formatDate={formatDate}
							/>
						)}
					/>
				</CardContent>
			</Card>
		</TooltipProvider>
	);
};
