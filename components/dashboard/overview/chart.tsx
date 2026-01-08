import { Headphones } from 'lucide-react';
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
import { useDateFormatter } from '@/hooks/use-date-formatter';
import type { DashboardOverviewResponse } from '@/types/dashboard';

type OverviewChartProps = {
	data: DashboardOverviewResponse['weeklyActivity'];
	timezone?: string;
};

export const OverviewChart = ({ data, timezone }: OverviewChartProps) => {
	const tChart = useTranslations('dashboard.pages.overview.charts');
	const { formatDate } = useDateFormatter(timezone);

	const chartData = data.map((item) => ({
		date: formatDate(item.date, 'MMM dd'),
		plays: item.plays,
		fullDate: formatDate(item.date, 'MMMM dd, yyyy'),
	}));

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg font-medium">
					{tChart('weekly_activity')}
				</CardTitle>
			</CardHeader>
			<CardContent className="px-6 pb-6">
				<ResponsiveContainer width="100%" height={350}>
					<BarChart
						data={chartData}
						margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
					>
						<defs>
							<linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="0%"
									stopColor="var(--color-chart-1)"
									stopOpacity={1}
								/>
								<stop
									offset="100%"
									stopColor="var(--color-chart-2)"
									stopOpacity={0.8}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="var(--color-border)"
							strokeOpacity={0.5}
							vertical={false}
						/>
						<XAxis
							dataKey="date"
							stroke="var(--color-muted-foreground)"
							fontSize={12}
							tickLine={false}
							axisLine={false}
							dy={10}
						/>
						<YAxis
							stroke="var(--color-muted-foreground)"
							fontSize={12}
							tickLine={false}
							axisLine={false}
							dx={-10}
							tickFormatter={(value) => value.toLocaleString()}
						/>
						<Tooltip
							content={
								<ChartTooltip
									icon={Headphones}
									labelKey="fullDate"
									color="var(--color-chart-1)"
								/>
							}
							cursor={{ fill: 'var(--color-muted)', opacity: 0.3, radius: 4 }}
						/>
						<Bar
							dataKey="plays"
							fill="url(#barGradient)"
							radius={[8, 8, 0, 0]}
							maxBarSize={60}
						/>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};
