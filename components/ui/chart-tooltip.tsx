import type { LucideIcon } from 'lucide-react';

type ChartTooltipProps<
	T extends Record<string, unknown> = Record<string, unknown>,
> = {
	active?: boolean;
	payload?: Array<{
		value: number;
		payload: T;
		fill?: string;
	}>;
	labelKey?: keyof T;
	valueLabel?: string;
	valueLabelKey?: keyof T;
	icon?: LucideIcon;
	color?: string;
	showIcon?: boolean;
};

export const ChartTooltip = <
	T extends Record<string, unknown> = Record<string, unknown>,
>({
	active,
	payload,
	labelKey,
	valueLabel,
	valueLabelKey,
	icon: Icon,
	color,
	showIcon = true,
}: ChartTooltipProps<T>) => {
	if (!active || !payload || !payload.length) return null;

	const item = payload[0].payload;
	const iconColor = color || payload[0].fill;

	return (
		<div className="rounded-lg border bg-card/95 backdrop-blur-sm p-3 shadow-lg flex flex-col gap-2 min-w-[120px]">
			{labelKey && item[labelKey] && (
				<p className="text-sm font-medium text-foreground/80">
					{String(item[labelKey])}
				</p>
			)}
			<div className="flex items-center gap-2.5">
				{showIcon && Icon && (
					<Icon className="size-5" style={{ color: iconColor }} />
				)}
				<div className="flex items-baseline gap-1.5">
					{(valueLabel || valueLabelKey) && (
						<span className="text-xs text-muted-foreground">
							{valueLabel || (valueLabelKey && String(item[valueLabelKey]))}
						</span>
					)}
					<span className="text-xl font-bold text-foreground font-mono tracking-tight">
						{payload[0].value?.toLocaleString()}
					</span>
				</div>
			</div>
		</div>
	);
};
