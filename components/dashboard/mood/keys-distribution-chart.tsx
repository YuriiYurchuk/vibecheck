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
import {
	ChartGradient,
	commonAxisProps,
	commonGridProps,
	commonTooltipCursor,
	verticalBarProps,
} from '@/components/chart-config';
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
									<ChartGradient
										id="keysBarGradient"
										colorStart="var(--chart-3)"
										colorEnd="var(--chart-1)"
									/>
								</defs>
								<CartesianGrid {...commonGridProps} vertical={false} />
								<XAxis
									dataKey="key"
									{...commonAxisProps}
									tickFormatter={formatKeyLabel}
								/>
								<YAxis {...commonAxisProps} allowDecimals={false} />
								<Tooltip
									cursor={commonTooltipCursor}
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
									fill="url(#keysBarGradient)"
									{...verticalBarProps}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
