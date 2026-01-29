import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type TotalTimeCardProps = {
	title: string;
	hours: number;
	minutes: number;
	hoursLabel: string;
	minutesLabel: string;
	trend: {
		value: number;
		isIncrease: boolean;
		label: string;
	};
};

export const TotalTimeCard = ({
	title,
	hours,
	minutes,
	hoursLabel,
	minutesLabel,
	trend,
}: TotalTimeCardProps) => {
	const isNeutral = trend.value === 0;

	const trendColor = isNeutral
		? 'text-muted-foreground'
		: trend.isIncrease
			? 'text-green-500'
			: 'text-red-500';

	const TrendIcon = isNeutral
		? Minus
		: trend.isIncrease
			? TrendingUp
			: TrendingDown;

	return (
		<Card>
			<CardContent>
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-2 min-w-0">
						<p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
							{title}
						</p>
						<div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
							<div className="flex items-baseline gap-0.5">
								<span className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground tabular-nums">
									{hours}
								</span>
								<span className="text-base sm:text-xl lg:text-2xl font-medium text-muted-foreground">
									{hoursLabel}
								</span>
							</div>
							<div className="flex items-baseline gap-0.5">
								<span className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground tabular-nums">
									{minutes}
								</span>
								<span className="text-base sm:text-xl lg:text-2xl font-medium text-muted-foreground">
									{minutesLabel}
								</span>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-3 sm:flex-col sm:items-end sm:justify-center sm:gap-1 shrink-0">
						<div
							className={cn(
								'flex items-center gap-1 sm:gap-1.5 text-lg sm:text-xl lg:text-2xl font-bold',
								trendColor
							)}
						>
							<TrendIcon
								className="size-4 sm:size-5 lg:size-6"
								strokeWidth={2.5}
							/>
							<span className="tabular-nums">{trend.value}%</span>
						</div>
						<span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
							{trend.label}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
