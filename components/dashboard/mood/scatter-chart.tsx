import { Music2 } from 'lucide-react';
import type { useTranslations as UseTranslations } from 'next-intl';
import { useTranslations } from 'next-intl';
import {
	CartesianGrid,
	Cell,
	ReferenceLine,
	ResponsiveContainer,
	Scatter,
	ScatterChart,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import type {
	NameType,
	ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
import { commonAxisProps, commonGridProps } from '@/components/chart-config';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import type { DashboardMoodResponse } from '@/types/dashboard';

type ScatterChartProps = {
	data: DashboardMoodResponse['scatterData'];
};

type CustomTooltipProps = {
	active?: boolean;
	payload?: ReadonlyArray<{
		payload: ScatterDataItem;
		value?: ValueType;
		name?: NameType;
	}>;
	t: ReturnType<typeof UseTranslations<'dashboard.pages.mood.scatter'>>;
};

type ScatterDataItem = DashboardMoodResponse['scatterData'][0];

const getColorForQuadrant = (valence: number, energy: number) => {
	const center = 0.5;
	if (valence >= center && energy >= center) return 'var(--chart-5)';
	if (valence < center && energy >= center) return 'var(--chart-2)';
	if (valence < center && energy < center) return 'var(--chart-3)';
	return 'var(--chart-4)';
};

export const MoodScatterChart = ({ data }: ScatterChartProps) => {
	const tScatter = useTranslations('dashboard.pages.mood.scatter');

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg font-medium">
					{tScatter('title')}
				</CardTitle>
				<CardDescription>{tScatter('description')}</CardDescription>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={350}>
					<ScatterChart margin={{ top: 25, right: 0, bottom: 5, left: -10 }}>
						<CartesianGrid {...commonGridProps} />
						<ReferenceLine
							x={0.5}
							stroke="var(--muted-foreground)"
							opacity={0.5}
						/>
						<ReferenceLine
							y={0.5}
							stroke="var(--muted-foreground)"
							opacity={0.5}
						/>
						<XAxis
							type="number"
							dataKey="valence"
							domain={[0, 1]}
							ticks={[0, 1]}
							tickFormatter={(val) =>
								val === 0 ? tScatter('axes.sad') : tScatter('axes.happy')
							}
							{...commonAxisProps}
							dy={10}
						/>
						<YAxis
							type="number"
							dataKey="energy"
							domain={[0, 1]}
							ticks={[0, 1]}
							tickFormatter={(val) =>
								val === 0 ? tScatter('axes.calm') : tScatter('axes.intense')
							}
							{...commonAxisProps}
							angle={-90}
							dx={-25}
							textAnchor="middle"
						/>
						<Tooltip
							cursor={{
								strokeDasharray: '3 3',
								stroke: 'var(--muted-foreground)',
								opacity: 0.5,
							}}
							content={(props) => <CustomTooltip {...props} t={tScatter} />}
						/>
						<Scatter data={data}>
							{data.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={getColorForQuadrant(entry.valence, entry.energy)}
								/>
							))}
						</Scatter>
					</ScatterChart>
				</ResponsiveContainer>
				<ChartLegend t={tScatter} />
			</CardContent>
		</Card>
	);
};

const CustomTooltip = (props: CustomTooltipProps) => {
	const { active, payload, t } = props;

	if (!active || !payload || !payload.length) return null;

	const item = payload[0].payload as ScatterDataItem;

	return (
		<div className="rounded-lg border bg-card/95 backdrop-blur-sm p-3 shadow-lg min-w-[140px] flex flex-col gap-2">
			<div className="flex items-center gap-2">
				<Music2 className="size-4 text-muted-foreground shrink-0" />
				<p className="text-sm font-medium text-foreground/80 truncate max-w-[180px]">
					{item.trackName}
				</p>
			</div>
			<div className="flex flex-col gap-1.5 border-t border-border/50 pt-2">
				<div className="flex items-center justify-between gap-4">
					<span className="text-xs text-muted-foreground font-medium">
						{t('tooltip.plays', { count: item.playCount })}
					</span>
				</div>
				<div className="flex items-center justify-between gap-4">
					<span className="text-xs text-muted-foreground font-medium">
						{t('tooltip.energy')}
					</span>
					<span className="text-sm font-bold tracking-tight">
						{Math.round(item.energy * 100)}%
					</span>
				</div>
				<div className="flex items-center justify-between gap-4">
					<span className="text-xs text-muted-foreground font-medium">
						{t('tooltip.valence')}
					</span>
					<span className="text-sm font-bold tracking-tight">
						{Math.round(item.valence * 100)}%
					</span>
				</div>
			</div>
		</div>
	);
};

const ChartLegend = ({
	t,
}: {
	t: ReturnType<typeof UseTranslations<'dashboard.pages.mood.scatter'>>;
}) => {
	return (
		<div className="mt-6 grid grid-cols-2 gap-3 text-xs text-muted-foreground sm:flex sm:justify-center sm:gap-6">
			<div className="flex items-center gap-2">
				<span className="size-3 shrink-0 rounded-full bg-chart-5" />
				{t('legend.happyIntense')}
			</div>
			<div className="flex items-center gap-2">
				<span className="size-3 shrink-0 rounded-full bg-chart-2" />
				{t('legend.angryIntense')}
			</div>
			<div className="flex items-center gap-2">
				<span className="size-3 shrink-0 rounded-full bg-chart-4" />
				{t('legend.happyCalm')}
			</div>
			<div className="flex items-center gap-2">
				<span className="size-3 shrink-0 rounded-full bg-chart-3" />
				{t('legend.sadCalm')}
			</div>
		</div>
	);
};
