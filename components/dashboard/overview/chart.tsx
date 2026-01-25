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
import {
	ChartGradient,
	commonAxisProps,
	commonGridProps,
	commonTooltipCursor,
	verticalBarProps,
} from '@/components/chart-config';
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
					{tChart('weeklyActivity')}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={300}>
					<BarChart
						data={chartData}
						margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
					>
						<defs>
							<ChartGradient
								id="weeklyBarGradient"
								colorStart="var(--chart-1)"
								colorEnd="var(--chart-2)"
							/>
						</defs>
						<CartesianGrid {...commonGridProps} vertical={false} />
						<XAxis dataKey="date" {...commonAxisProps} />
						<YAxis
							{...commonAxisProps}
							tickFormatter={(value) => value.toLocaleString()}
						/>
						<Tooltip
							cursor={commonTooltipCursor}
							content={
								<ChartTooltip
									icon={Headphones}
									labelKey="fullDate"
									color="var(--chart-1)"
								/>
							}
						/>
						<Bar
							dataKey="plays"
							fill="url(#weeklyBarGradient)"
							{...verticalBarProps}
						/>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};
