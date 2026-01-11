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
			<CardContent className="px-6 pb-6">
				<ResponsiveContainer width="100%" height={350}>
					<BarChart
						data={chartData}
						margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
					>
						<defs>
							<linearGradient id="hourBarGradient" x1="0" y1="0" x2="0" y2="1">
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
							stroke="var(--color-border)"
							strokeOpacity={0.5}
							vertical={false}
						/>
						<XAxis
							dataKey="hour"
							stroke="var(--color-muted-foreground)"
							fontSize={12}
							tickLine={false}
							axisLine={false}
							dy={10}
							tickFormatter={formatXAxis}
							interval={3}
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
									labelKey="formattedTime"
									color="var(--color-chart-3)"
								/>
							}
							cursor={{ fill: 'var(--color-muted)', opacity: 0.3, radius: 4 }}
						/>
						<Bar
							dataKey="count"
							fill="url(#hourBarGradient)"
							radius={[4, 4, 0, 0]}
							maxBarSize={40}
						/>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};
