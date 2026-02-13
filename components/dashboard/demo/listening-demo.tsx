'use client';

import { Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { YearSelect } from '@/components/dashboard/filters';
import { ListeningCalendar } from '@/components/dashboard/listening/calendar';
import { ListeningChart } from '@/components/dashboard/listening/chart';
import { FadeIn } from '@/components/ui/fade-in';
import { generateMockListening } from '@/lib/mock-data/dashboard';

export const ListeningDemo = () => {
	const tListening = useTranslations('dashboard.pages.listening');
	const timezone = 'UTC';
	const currentYear = new Date().getFullYear();

	const [year, setYear] = useState<string>('last_year');
	const [data, setData] = useState<ReturnType<
		typeof generateMockListening
	> | null>(null);

	useEffect(() => {
		const yearParam = year === 'last_year' ? undefined : year;
		setData(generateMockListening(yearParam, timezone));
	}, [year]);

	if (!data) {
		return null;
	}

	const displayPeriod =
		year === 'last_year'
			? tListening('periodLastYear')
			: tListening('periodYear', { year });

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
						value={year}
						onChange={(val) => setYear(val)}
						fromYear={currentYear - 5}
					/>
				</FadeIn>
			</div>
			<div className="mx-auto w-fit">
				<ListeningCalendar data={data.yearCalendar} />
			</div>
			<ListeningChart data={data.hourlyActivity} />
		</div>
	);
};
