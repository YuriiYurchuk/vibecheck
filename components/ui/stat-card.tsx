'use client';

import { Info, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from './tooltip';

type StatCardProps = {
	icon?: React.ReactNode;
	title: string;
	value: number | string;
	suffix?: string;
	description?: string;
	tooltip?: string;
	trend?: {
		value: number;
		isIncrease: boolean;
	};
	className?: string;
};

export const StatCard = ({
	icon,
	title,
	value,
	suffix,
	description,
	tooltip,
	trend,
	className,
}: StatCardProps) => {
	return (
		<Card className={cn('flex flex-col h-full', className)}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						{icon && <div className="bg-primary/10 p-2 rounded-lg">{icon}</div>}
						<CardTitle className="text-sm font-medium text-muted-foreground">
							{title}
						</CardTitle>
					</div>
					{tooltip && (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Info className="size-4.5 text-muted-foreground/50 hover:text-primary transition-colors cursor-help" />
								</TooltipTrigger>
								<TooltipContent side="top">
									<p className="max-w-[200px] text-sm font-normal">{tooltip}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					<p className="text-2xl md:text-3xl font-bold">
						{value}
						{suffix && (
							<span className="text-lg text-muted-foreground ml-1">
								{suffix}
							</span>
						)}
					</p>
					{description && (
						<p className="text-sm text-muted-foreground">{description}</p>
					)}
					{trend && (
						<div className="flex items-center gap-1">
							{trend.isIncrease ? (
								<TrendingUp className="size-4 text-green-500" />
							) : (
								<TrendingDown className="size-4 text-red-500" />
							)}
							<span
								className={cn(
									'text-sm font-medium',
									trend.isIncrease ? 'text-green-500' : 'text-red-500'
								)}
							>
								{trend.isIncrease ? '+' : ''}
								{trend.value}%
							</span>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};
