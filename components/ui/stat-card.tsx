'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type StatCardProps = {
	icon: React.ReactNode;
	title: string;
	value: number | string;
	suffix?: string;
	description?: string;
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
	trend,
	className,
}: StatCardProps) => {
	return (
		<Card className={className}>
			<CardHeader>
				<div className="flex items-center gap-3">
					<div className="bg-primary/10 p-2 rounded-lg">{icon}</div>
					<CardTitle className="text-sm font-medium text-muted-foreground">
						{title}
					</CardTitle>
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
								<TrendingUp className="w-4 h-4 text-green-500" />
							) : (
								<TrendingDown className="w-4 h-4 text-red-500" />
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
