type ChartGradient = {
	id: string;
	colorStart: string;
	colorEnd: string;
	orientation?: 'vertical' | 'horizontal';
};

export const ChartGradient = ({
	id,
	colorStart,
	colorEnd,
	orientation = 'vertical',
}: ChartGradient) => {
	const isVertical = orientation === 'vertical';
	return (
		<linearGradient
			id={id}
			x1="0"
			y1="0"
			x2={isVertical ? '0' : '1'}
			y2={isVertical ? '1' : '0'}
		>
			<stop offset="0%" stopColor={colorStart} stopOpacity={1} />
			<stop offset="100%" stopColor={colorEnd} stopOpacity={0.8} />
		</linearGradient>
	);
};

export const commonAxisProps = {
	stroke: 'var(--muted-foreground)',
	fontSize: 14,
	tickLine: false,
	axisLine: false,
};

export const commonGridProps = {
	strokeDasharray: '3 3',
	stroke: 'var(--border)',
	strokeOpacity: 0.5,
};

export const verticalBarProps = {
	radius: [6, 6, 0, 0] as [number, number, number, number],
	maxBarSize: 80,
};

export const horizontalBarProps = {
	radius: [0, 6, 6, 0] as [number, number, number, number],
	maxBarSize: 80,
};

export const commonTooltipCursor = {
	fill: 'var(--muted)',
	opacity: 0.3,
};
