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
							<linearGradient id="tempoGradient" x1="0" y1="0" x2="1" y2="0">
								<stop
									offset="0%"
									stopColor="var(--color-chart-4)"
									stopOpacity={1}
								/>
								<stop
									offset="100%"
									stopColor="var(--color-chart-3)"
									stopOpacity={0.8}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="var(--color-muted-foreground)"
							strokeOpacity={0.5}
							horizontal={false}
						/>
						<XAxis
							type="number"
							stroke="var(--color-muted-foreground)"
							axisLine={false}
							tickLine={false}
						/>
						<YAxis
							dataKey="label"
							type="category"
							stroke="var(--color-muted-foreground)"
							axisLine={false}
							tickLine={false}
							width={100}
						/>
						<Tooltip
							cursor={{ fill: 'var(--color-muted)', opacity: 1, radius: 4 }}
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
							fill="url(#tempoGradient)"
							radius={[0, 8, 8, 0]}
							maxBarSize={80}
						/>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};
