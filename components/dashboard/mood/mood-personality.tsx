'use client';

import type { LucideIcon } from 'lucide-react';
import { CloudRain, Moon, Smile, Sparkles, Sun, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { DashboardMoodResponse } from '@/types/dashboard';

type MoodPersonalityProps = {
	features: DashboardMoodResponse['averageFeatures'];
	mode: DashboardMoodResponse['modeDistribution'];
};

type PersonalityKey =
	| 'highEnergy'
	| 'lowEnergy'
	| 'mediumEnergy'
	| 'positive'
	| 'melancholic'
	| 'balanced'
	| 'majorLean'
	| 'minorLean';

type InsightConfig = {
	key: PersonalityKey;
	icon: LucideIcon;
	color: string;
	bg: string;
};

const INSIGHT_CONFIG: Record<PersonalityKey, Omit<InsightConfig, 'key'>> = {
	highEnergy: { icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
	lowEnergy: { icon: Moon, color: 'text-blue-400', bg: 'bg-blue-400/20' },
	mediumEnergy: { icon: Smile, color: 'text-green-400', bg: 'bg-green-400/20' },
	positive: { icon: Sun, color: 'text-orange-400', bg: 'bg-orange-400/20' },
	melancholic: {
		icon: CloudRain,
		color: 'text-indigo-400',
		bg: 'bg-indigo-400/20',
	},
	balanced: { icon: Smile, color: 'text-teal-400', bg: 'bg-teal-400/20' },
	majorLean: { icon: Sun, color: 'text-amber-400', bg: 'bg-amber-400/20' },
	minorLean: { icon: Moon, color: 'text-purple-400', bg: 'bg-purple-400/20' },
};

export const MoodPersonality = ({ features, mode }: MoodPersonalityProps) => {
	const tPersonality = useTranslations('dashboard.pages.mood.personality');
	const hasData = features.tracksWithFeatures > 0;

	const getInsight = (
		value: number,
		thresholds: [number, PersonalityKey, PersonalityKey, PersonalityKey]
	): InsightConfig => {
		const [threshold, high, low, medium] = thresholds;
		const key = value > threshold ? high : value < 1 - threshold ? low : medium;
		return { key, ...INSIGHT_CONFIG[key] };
	};

	const energy = getInsight(features.avgEnergy ?? 0, [
		0.6,
		'highEnergy',
		'lowEnergy',
		'mediumEnergy',
	]);
	const valence = getInsight(features.avgValence ?? 0, [
		0.6,
		'positive',
		'melancholic',
		'balanced',
	]);

	const getKeyInsight = (): InsightConfig | null => {
		const total = mode.major + mode.minor;
		if (total === 0) return null;
		const majorPercent = mode.major / total;
		if (majorPercent > 0.6)
			return { key: 'majorLean', ...INSIGHT_CONFIG.majorLean };
		if (majorPercent < 0.4)
			return { key: 'minorLean', ...INSIGHT_CONFIG.minorLean };
		return null;
	};

	const insights = [energy, valence, getKeyInsight()].filter(
		Boolean
	) as InsightConfig[];

	return (
		<Card className="bg-primary text-primary-foreground border-none shadow-lg overflow-hidden relative">
			<div className="absolute top-0 right-0 p-6 sm:p-10 opacity-10 pointer-events-none">
				<Sparkles className="size-20 sm:size-32" />
			</div>
			<CardHeader className="relative z-10">
				<CardTitle className="text-base sm:text-lg font-bold">
					<span>{tPersonality('title')}</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="relative z-10 pt-0">
				{!hasData ? (
					<div className="flex flex-col items-center justify-center text-center">
						<Smile className="size-10 sm:size-12 text-primary-foreground/30 mb-4" />
						<p className="text-sm sm:text-base text-primary-foreground/70">
							{tPersonality('noData')}
						</p>
						<p className="text-xs sm:text-sm text-primary-foreground/50 mt-2">
							{tPersonality('noDataHint')}
						</p>
					</div>
				) : (
					<div className="grid gap-2.5 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
						{insights.map((insight) => {
							const Icon = insight.icon;
							return (
								<div
									key={insight.key}
									className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/10 transition-transform hover:scale-105"
								>
									<div
										className={cn(
											'p-2 rounded-full shrink-0 flex items-center justify-center',
											insight.bg
										)}
									>
										<Icon className={cn('size-4 sm:size-5', insight.color)} />
									</div>
									<span className="text-xs sm:text-sm font-medium leading-tight text-primary-foreground/90">
										{tPersonality(insight.key)}
									</span>
								</div>
							);
						})}
					</div>
				)}
			</CardContent>
		</Card>
	);
};
