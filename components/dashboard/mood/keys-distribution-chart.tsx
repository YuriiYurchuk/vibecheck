import { Music2 } from 'lucide-react';
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

type KeysDistributionChartProps = {
	data: DashboardMoodResponse['keyDistribution'];
};

export const KeysDistributionChart = ({ data }: KeysDistributionChartProps) => {
	const tKeys = useTranslations('dashboard.pages.mood.keys');
	const formatKeyLabel = (key: string) => key.split('/')[0];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg font-medium">{tKeys('title')}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="w-full overflow-x-auto pb-4">
					<div className="h-[300px] min-w-[600px] md:min-w-0 md:w-full">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								data={data}
								margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
							>
								<defs>
									<linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
										<stop
											offset="0%"
											stopColor="var(--color-chart-3)"
											stopOpacity={1}
										/>
										<stop
											offset="100%"
											stopColor="var(--color-chart-1)"
											stopOpacity={0.8}
										/>
									</linearGradient>
								</defs>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="var(--color-muted-foreground)"
									strokeOpacity={0.5}
									vertical={false}
								/>
								<XAxis
									dataKey="key"
									stroke="var(--color-muted-foreground)"
									axisLine={false}
									tickLine={false}
									tickFormatter={formatKeyLabel}
									interval={0}
									dy={10}
								/>
								<YAxis
									axisLine={false}
									tickLine={false}
									allowDecimals={false}
								/>
								<Tooltip
									cursor={{ fill: 'var(--muted)', opacity: 0.3, radius: 4 }}
									content={
										<ChartTooltip
											labelKey="key"
											icon={Music2}
											color="var(--color-chart-3)"
										/>
									}
								/>
								<Bar
									dataKey="count"
									fill="url(#barGradient)"
									radius={[8, 8, 0, 0]}
									maxBarSize={60}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
