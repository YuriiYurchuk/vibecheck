import { Music2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTooltip } from '@/components/ui/chart-tooltip';
import type { DashboardMoodResponse } from '@/types/dashboard';

type ChartItem = {
	name: string;
	value: number;
	fill: string;
};

type ModalityPieChartProps = {
	data: DashboardMoodResponse['modeDistribution'];
};

export const ModalityPieChart = ({ data }: ModalityPieChartProps) => {
	const tModality = useTranslations('dashboard.pages.mood.modality');
	const chartData: ChartItem[] = [
		{ name: tModality('major'), value: data.major, fill: 'var(--chart-2)' },
		{ name: tModality('minor'), value: data.minor, fill: 'var(--chart-5)' },
	];
	const hasData = chartData.some((i) => i.value > 0);
	const displayData = hasData
		? chartData
		: [{ name: 'Empty', value: 1, fill: 'var(--secondary)' }];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg font-medium">
					{tModality('title')}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="relative">
					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Pie
								data={displayData}
								dataKey="value"
								cx="50%"
								cy="50%"
								innerRadius="60%"
								outerRadius="80%"
								startAngle={90}
								endAngle={-270}
								paddingAngle={hasData ? 4 : 0}
								stroke="none"
								cornerRadius={hasData ? 6 : 0}
							>
								{displayData.map((entry, i) => (
									<Cell
										key={i}
										fill={entry.fill}
										className={!hasData ? 'opacity-20' : ''}
									/>
								))}
							</Pie>
							{hasData && (
								<Tooltip
									cursor={false}
									content={({ active, payload }) => {
										if (!active || !payload?.[0]) return null;
										return (
											<ChartTooltip
												active={active}
												payload={[...payload]}
												labelKey="name"
												icon={Music2}
												color={(payload[0].payload as ChartItem).fill}
											/>
										);
									}}
								/>
							)}
						</PieChart>
					</ResponsiveContainer>
					{!hasData && (
						<div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-medium text-muted-foreground">
							{tModality('noData')}
						</div>
					)}
				</div>
				<ChartLegend data={chartData} hasData={hasData} />
			</CardContent>
		</Card>
	);
};

const ChartLegend = ({
	data,
	hasData,
}: {
	data: ChartItem[];
	hasData: boolean;
}) => (
	<div className="mt-4 grid w-full grid-cols-2 gap-4">
		{data.map((item) => (
			<div
				key={item.name}
				className="flex items-center gap-3 rounded-lg border bg-muted/20 p-2"
			>
				<div
					className="h-8 w-1 shrink-0 rounded-full"
					style={{ backgroundColor: hasData ? item.fill : 'var(--muted)' }}
				/>
				<div className="flex flex-col">
					<span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
						{item.name}
					</span>
					<span className="text-xl font-bold tabular-nums leading-none">
						{item.value}
					</span>
				</div>
			</div>
		))}
	</div>
);
