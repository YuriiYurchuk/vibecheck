import { Timer } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import {
	ChartGradient,
	commonAxisProps,
	commonGridProps,
	commonTooltipCursor,
	horizontalBarProps,
} from '@/components/chart-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTooltip } from '@/components/ui/chart-tooltip';
import type { DashboardMoodResponse } from '@/types/dashboard';

type TempoChartProps = {
	data: DashboardMoodResponse['tempoDistribution'];
};

type TempoRangeKey = 'slow' | 'moderate' | 'fast' | 'veryFast';

const rangeMap: Record<string, TempoRangeKey> = {
	slow: 'slow',
	moderate: 'moderate',
	fast: 'fast',
	very_fast: 'veryFast',
};

export const TempoChart = ({ data }: TempoChartProps) => {
	const tTempo = useTranslations('dashboard.pages.mood.tempo');

	const chartData = data.map((item) => {
		const translationKey = (rangeMap[item.range] ||
			item.range) as TempoRangeKey;
		return {
			...item,
			label: tTempo(`ranges.${translationKey}`),
		};
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg font-medium">{tTempo('title')}</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={300}>
					<BarChart
						data={chartData}
						margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
						layout="vertical"
					>
						<defs>
							<ChartGradient
								id="tempoBarGradient"
								colorStart="var(--chart-5)"
								colorEnd="var(--chart-4)"
								orientation="horizontal"
							/>
						</defs>
						<CartesianGrid {...commonGridProps} horizontal={false} />
						<XAxis type="number" {...commonAxisProps} />
						<YAxis
							dataKey="label"
							type="category"
							{...commonAxisProps}
							width={100}
						/>
						<Tooltip
							cursor={commonTooltipCursor}
							content={
								<ChartTooltip
									labelKey="label"
									icon={Timer}
									color="var(--color-chart-5)"
								/>
							}
						/>
						<Bar
							dataKey="count"
							fill="url(#tempoBarGradient)"
							{...horizontalBarProps}
						/>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};
