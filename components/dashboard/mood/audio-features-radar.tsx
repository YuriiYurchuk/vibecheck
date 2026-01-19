import {
	Activity,
	Guitar,
	type LucideIcon,
	Mic2,
	Music2,
	Radio,
	Smile,
	Zap,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type SVGProps, useMemo } from 'react';
import {
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart,
	ResponsiveContainer,
	Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTooltip } from '@/components/ui/chart-tooltip';
import type { DashboardMoodResponse } from '@/types/dashboard';

type AudioFeaturesRadarProps = {
	moodData: DashboardMoodResponse['averageFeatures'];
};

interface CustomTickProps extends SVGProps<SVGTextElement> {
	payload: { value: string | number };
	x: number;
	y: number;
	index: number;
	verticalAnchor?: string;
	textAnchor?: 'start' | 'middle' | 'end';
}

const ICONS: LucideIcon[] = [Zap, Music2, Smile, Guitar, Mic2, Radio];

const RadarTick = ({
	payload,
	x,
	y,
	textAnchor,
	index,
	verticalAnchor,
	...props
}: CustomTickProps) => {
	const Icon = ICONS[index];
	const iconSize = 18;
	const iconOffset = -iconSize / 2;

	return (
		<g>
			<foreignObject
				x={x + iconOffset}
				y={y + iconOffset}
				width={iconSize}
				height={iconSize}
				className="sm:hidden"
			>
				<div className="flex items-center justify-center w-full h-full">
					{Icon && <Icon size={iconSize} className="text-muted-foreground" />}
				</div>
			</foreignObject>
			<text
				{...props}
				x={x}
				y={y}
				textAnchor={textAnchor}
				className="hidden sm:block fill-muted-foreground text-xs font-bold uppercase tracking-wider"
			>
				<tspan dy="0.35em">{payload.value}</tspan>
			</text>
		</g>
	);
};

const RadarLegend = ({
	data,
}: {
	data: Array<{ feature: string; value: number }>;
}) => {
	return (
		<div className="mt-4 grid grid-cols-2 gap-3 sm:hidden">
			{data.map((item, index) => {
				const Icon = ICONS[index];
				return (
					<div
						key={item.feature}
						className="flex flex-col p-2.5 rounded-lg bg-secondary/20 border border-border/40"
					>
						<div className="flex items-center gap-2 mb-2">
							{Icon && <Icon size={14} className="text-primary" />}
							<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
								{item.feature}
							</span>
						</div>
						<div className="flex items-end justify-between gap-2">
							<span className="text-xl font-bold tabular-nums leading-none">
								{Math.round(item.value * 100)}%
							</span>
							<div className="h-1.5 w-16 bg-secondary rounded-full overflow-hidden mb-1">
								<div
									className="h-full rounded-full transition-all duration-500"
									style={{
										width: `${item.value * 100}%`,
										backgroundColor: 'var(--chart-3)',
									}}
								/>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export const AudioFeaturesRadar = ({ moodData }: AudioFeaturesRadarProps) => {
	const tRadar = useTranslations('dashboard.pages.mood.radar');

	const chartData = useMemo(() => {
		if (!moodData) return [];

		const format = (val: number | undefined | null) =>
			Number((val ?? 0).toFixed(2));

		return [
			{ feature: tRadar('energy'), value: format(moodData.avgEnergy) },
			{ feature: tRadar('dance'), value: format(moodData.avgDanceability) },
			{ feature: tRadar('valence'), value: format(moodData.avgValence) },
			{ feature: tRadar('acoustic'), value: format(moodData.avgAcousticness) },
			{ feature: tRadar('speech'), value: format(moodData.avgSpeechiness) },
			{ feature: tRadar('live'), value: format(moodData.avgLiveness) },
		];
	}, [moodData, tRadar]);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg font-medium">{tRadar('title')}</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={300}>
					<RadarChart
						cx="50%"
						cy="50%"
						outerRadius="80%"
						data={chartData}
						margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
					>
						<PolarGrid
							gridType="polygon"
							stroke="var(--border)"
							strokeOpacity={0.6}
						/>
						<PolarAngleAxis
							dataKey="feature"
							tick={(props) => <RadarTick {...(props as CustomTickProps)} />}
						/>
						<PolarRadiusAxis
							angle={30}
							domain={[0, 1]}
							tick={false}
							axisLine={false}
						/>
						<Radar
							name={tRadar('tooltipLabel')}
							dataKey="value"
							stroke="var(--chart-3)"
							strokeWidth={3}
							fill="var(--chart-3)"
							fillOpacity={0.5}
							isAnimationActive={true}
							dot={{
								fill: 'var(--chart-3)',
								strokeWidth: 2,
								stroke: 'var(--background)',
								r: 4,
							}}
							activeDot={{
								r: 6,
								strokeWidth: 2,
								stroke: 'var(--background)',
							}}
						/>
						<Tooltip
							cursor={false}
							content={
								<ChartTooltip
									labelKey="feature"
									icon={Activity}
									color="var(--chart-3)"
								/>
							}
						/>
					</RadarChart>
				</ResponsiveContainer>
				<RadarLegend data={chartData} />
			</CardContent>
		</Card>
	);
};
