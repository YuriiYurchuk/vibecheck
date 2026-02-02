import { Skeleton } from '@/components/ui/skeleton';

export const HeaderSkeleton = () => (
	<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div className="space-y-2">
			<Skeleton className="h-6 w-64 sm:w-96" />
		</div>
		<div className="flex items-center gap-2">
			<Skeleton className="size-4 rounded-full" />
			<Skeleton className="h-9 w-[180px] rounded-lg" />
		</div>
	</div>
);

export const CalendarSkeleton = () => (
	<div className="grid grid-cols-1 min-w-0 bg-card rounded-xl overflow-y-auto p-6">
		<div className="inline-block min-w-full">
			<div className="space-y-2">
				<div className="flex justify-between gap-3 pl-7">
					{Array.from({ length: 12 }).map((_, i) => (
						<Skeleton key={i} className="h-3 w-10 shrink-0" />
					))}
				</div>
				<div className="space-y-1.5">
					{Array.from({ length: 7 }).map((_, rowIndex) => (
						<div key={rowIndex} className="flex items-center gap-1.5">
							<Skeleton className="h-3 w-5 shrink-0" />
							<div className="flex gap-1.5">
								{Array.from({ length: 53 }).map((_, colIndex) => (
									<Skeleton
										key={colIndex}
										className="shrink-0 rounded"
										style={{ width: '12px', height: '12px' }}
									/>
								))}
							</div>
						</div>
					))}
				</div>
				<div className="flex items-center justify-between pt-2 flex-wrap gap-2">
					<Skeleton className="h-3 w-48" />
					<div className="flex items-center gap-2">
						<Skeleton className="h-3 w-16" />
						<div className="flex gap-1">
							{Array.from({ length: 5 }).map((_, i) => (
								<Skeleton
									key={i}
									className="rounded"
									style={{ width: '12px', height: '12px' }}
								/>
							))}
						</div>
						<Skeleton className="h-3 w-16" />
					</div>
				</div>
			</div>
		</div>
	</div>
);

export const ChartSkeleton = () => (
	<div className="rounded-xl border bg-card">
		<div className="p-6 space-y-1.5">
			<Skeleton className="h-6 w-48" />
			<Skeleton className="h-4 w-64" />
		</div>
		<div className="px-6 pb-6">
			<div className="h-[300px] flex items-end justify-between gap-2">
				{Array.from({ length: 24 }).map((_, i) => {
					const heights = ['20%', '35%', '50%', '65%', '80%', '45%', '30%'];
					const randomHeight = heights[i % heights.length];
					return (
						<Skeleton
							key={i}
							className="w-full rounded-t"
							style={{ height: randomHeight }}
						/>
					);
				})}
			</div>
			<div className="flex justify-between mt-4 gap-2">
				{Array.from({ length: 8 }).map((_, i) => (
					<Skeleton key={i} className="h-3 w-full" />
				))}
			</div>
		</div>
	</div>
);

export const ContentSkeleton = () => (
	<div className="space-y-6">
		<div className="mx-auto w-fit">
			<CalendarSkeleton />
		</div>
		<ChartSkeleton />
	</div>
);
