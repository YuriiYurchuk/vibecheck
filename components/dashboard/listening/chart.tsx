'use client';

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
	horizontalBarProps,
} from '@/components/chart-config';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { ChartTooltip } from '@/components/ui/chart-tooltip';
import type { DashboardListeningResponse } from '@/types/dashboard';

type ListeningChartProps = {
	data: DashboardListeningResponse['hourlyActivity'];
};

export const ListeningChart = ({ data }: ListeningChartProps) => {
	const tChart = useTranslations('dashboard.pages.listening.charts');

	const chartData = data.map((item) => ({
		...item,
		formattedTime: `${item.hour.toString().padStart(2, '0')}:00`,
	}));

	const formatXAxis = (tick: number) =>
		`${tick.toString().padStart(2, '0')}:00`;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg font-medium">{tChart('title')}</CardTitle>
				<CardDescription>{tChart('description')}</CardDescription>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={300}>
					<BarChart
						data={chartData}
						margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
					>
						<defs>
							<ChartGradient
								id="hourBarGradient"
								colorStart="var(--chart-3)"
								colorEnd="var(--chart-4)"
							/>
						</defs>
						<CartesianGrid {...commonGridProps} vertical={false} />
						<XAxis
							dataKey="hour"
							{...commonAxisProps}
							tickFormatter={formatXAxis}
							interval={3}
						/>
						<YAxis
							{...commonAxisProps}
							tickFormatter={(value) => value.toLocaleString()}
						/>
						<Tooltip
							cursor={commonTooltipCursor}
							content={
								<ChartTooltip
									icon={Headphones}
									labelKey="formattedTime"
									color="var(--chart-3)"
								/>
							}
						/>
						<Bar
							dataKey="count"
							fill="url(#hourBarGradient)"
							{...horizontalBarProps}
						/>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};
