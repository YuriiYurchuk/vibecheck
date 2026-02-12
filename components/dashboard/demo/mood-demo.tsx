'use client';

import { Calendar, CalendarClock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { ModeToggle, PeriodToggles } from '@/components/dashboard/filters';
import { AudioFeaturesRadar } from '@/components/dashboard/mood/audio-features-radar';
import { FeaturesStats } from '@/components/dashboard/mood/features-stats';
import { KeysDistributionChart } from '@/components/dashboard/mood/keys-distribution-chart';
import { ModalityPieChart } from '@/components/dashboard/mood/modality-pie-chart';
import { MoodPersonality } from '@/components/dashboard/mood/mood-personality';
import { MoodScatterChart } from '@/components/dashboard/mood/scatter-chart';
import { TempoChart } from '@/components/dashboard/mood/tempo-chart';
import { FadeIn } from '@/components/ui/fade-in';
import { Separator } from '@/components/ui/separator';
import { generateMockMood } from '@/lib/mock-data/dashboard';
import type { Mode, Period } from '@/types/dashboard';

export const MoodDemo = () => {
	const tMood = useTranslations('dashboard.pages.mood');

	const [period, setPeriod] = useState<Period>('month');
	const [mode, setMode] = useState<Mode>('rolling');
	const [data, setData] = useState<ReturnType<typeof generateMockMood> | null>(
		null
	);

	useEffect(() => {
		setData(generateMockMood());
	}, []);

	const handleModeChange = (newMode: Mode) => {
		if (newMode === 'calendar') {
			setMode(newMode);
			setPeriod('month');
		} else {
			setMode(newMode);
		}
	};

	const handlePeriodChange = (newPeriod: Period) => {
		if (mode !== 'calendar') {
			setPeriod(newPeriod);
		}
	};

	if (!data) return null;

	const { tracksWithFeatures, totalTracks } = data.averageFeatures;
	const coveragePercent =
		totalTracks > 0 ? Math.round((tracksWithFeatures / totalTracks) * 100) : 0;

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
							value={period}
							onChange={handlePeriodChange}
							disabled={mode === 'calendar'}
						/>
					</div>
					<Separator
						orientation="vertical"
						className="h-7! hidden min-[598px]:block lg:hidden xl:block"
					/>
					<div className="flex items-center gap-2">
						<CalendarClock className="size-4 text-primary shrink-0" />
						<ModeToggle mode={mode} onChange={handleModeChange} />
					</div>
				</FadeIn>
			</div>
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
		</div>
	);
};
