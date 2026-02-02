import { Skeleton } from '@/components/ui/skeleton';

export const HeaderSkeleton = () => (
	<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div className="space-y-2">
			<Skeleton className="h-6 w-64 sm:w-96" />
			<Skeleton className="h-4 w-full sm:w-3xl" />
		</div>
		<Skeleton className="h-9 w-[180px] rounded-lg" />
	</div>
);

const TotalTimeCardSkeleton = () => (
	<div className="rounded-xl border bg-card p-6">
		<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div className="space-y-2 flex-1">
				<Skeleton className="h-4 w-32" />
				<div className="flex items-baseline gap-2">
					<Skeleton className="h-10 w-12" />
					<Skeleton className="h-6 w-6" />
					<Skeleton className="h-10 w-12" />
					<Skeleton className="h-6 w-6" />
				</div>
			</div>
			<div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
				<Skeleton className="h-7 w-16" />
				<Skeleton className="h-3 w-20" />
			</div>
		</div>
	</div>
);

const MetricCardSkeleton = () => (
	<div className="rounded-xl border bg-card p-6">
		<div className="flex flex-col justify-center space-y-2">
			<Skeleton className="h-4 w-32" />
			<Skeleton className="h-10 w-24" />
			<Skeleton className="h-4 w-20" />
		</div>
	</div>
);

const MoodCardSkeleton = () => (
	<div className="rounded-xl border bg-card p-6">
		<Skeleton className="h-4 w-24 mb-4" />
		<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
			<div className="flex items-center gap-3">
				<Skeleton className="size-12 rounded-full" />
				<Skeleton className="h-7 w-32" />
			</div>
			<div className="flex items-center gap-6 md:gap-10">
				<div className="flex flex-col md:items-end gap-1">
					<Skeleton className="h-3 w-16" />
					<Skeleton className="h-6 w-12" />
				</div>
				<div className="flex flex-col md:items-end gap-1">
					<Skeleton className="h-3 w-16" />
					<Skeleton className="h-6 w-12" />
				</div>
			</div>
		</div>
	</div>
);

const StreakCardSkeleton = () => (
	<div className="rounded-xl border bg-card p-6">
		<div className="flex items-center gap-2 mb-6">
			<Skeleton className="h-4 w-24" />
			<Skeleton className="size-4 rounded-full" />
		</div>
		<div className="grid grid-cols-2 gap-8">
			<div className="text-center space-y-1">
				<Skeleton className="h-12 w-16 mx-auto" />
				<Skeleton className="h-3 w-20 mx-auto" />
				<Skeleton className="h-2 w-12 mx-auto" />
			</div>
			<div className="text-center space-y-1">
				<Skeleton className="h-12 w-16 mx-auto" />
				<Skeleton className="h-3 w-16 mx-auto" />
				<Skeleton className="h-3 w-24 mx-auto" />
			</div>
		</div>
	</div>
);

export const ContentSkeleton = () => (
	<div className="space-y-6">
		<TotalTimeCardSkeleton />
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<MetricCardSkeleton />
			<MetricCardSkeleton />
			<MoodCardSkeleton />
			<StreakCardSkeleton />
		</div>
	</div>
);
