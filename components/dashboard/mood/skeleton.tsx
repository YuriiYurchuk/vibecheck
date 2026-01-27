import { Skeleton } from '@/components/ui/skeleton';

export const HeaderSkeleton = () => (
	<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
		<div className="space-y-2">
			<Skeleton className="h-8 w-48 sm:h-10 sm:w-96" />
		</div>
		<div className="flex flex-wrap items-center gap-4">
			<div className="flex items-center gap-2">
				<Skeleton className="size-4 rounded-full" />
				<Skeleton className="h-9 w-[200px] rounded-lg" />
			</div>
			<Skeleton className="hidden h-6 w-px sm:block" />
			<div className="flex items-center gap-2">
				<Skeleton className="size-4 rounded-full" />
				<Skeleton className="h-9 w-[200px] rounded-lg" />
			</div>
		</div>
	</div>
);

const StatCardSkeleton = () => (
	<div className="rounded-xl border bg-card py-6">
		<div className="px-6 flex items-center justify-between">
			<div className="flex items-center gap-3 mb-6">
				<Skeleton className="size-9 rounded-lg" />
				<Skeleton className="h-4 w-24" />
			</div>
			<Skeleton className="size-4 mb-4" />
		</div>
		<div className="px-6">
			<Skeleton className="h-9 w-16 mb-1" />
		</div>
	</div>
);

const PersonalitySkeleton = () => (
	<div className="rounded-xl border bg-card py-6">
		<div className="px-6 mb-6">
			<Skeleton className="h-6 w-48" />
		</div>
		<div className="px-6">
			<div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="flex items-center gap-3 p-3 rounded-xl">
						<Skeleton className="size-10 rounded-full shrink-0" />
						<Skeleton className="h-6 w-24" />
					</div>
				))}
			</div>
		</div>
	</div>
);

const RadarChartSkeleton = () => (
	<div className="rounded-xl border bg-card py-6">
		<div className="px-6 mb-6">
			<Skeleton className="h-5 w-48" />
		</div>
		<div className="px-6">
			<div className="flex items-center justify-center h-[300px] relative">
				<Skeleton className="size-60 rounded-full" />
				<div className="absolute inset-0 flex items-center justify-center">
					<Skeleton className="size-[180px] rounded-full" />
				</div>
			</div>
			<div className="mt-4 grid grid-cols-2 gap-3 sm:hidden">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="p-2.5 rounded-lg border">
						<div className="flex items-center gap-2 mb-2">
							<Skeleton className="size-3.5 rounded" />
							<Skeleton className="h-3 w-16" />
						</div>
						<div className="flex items-end justify-between gap-2">
							<Skeleton className="h-6 w-12" />
							<Skeleton className="h-1.5 w-16 rounded-full" />
						</div>
					</div>
				))}
			</div>
		</div>
	</div>
);

const PieChartSkeleton = () => (
	<div className="rounded-xl border bg-card py-6">
		<div className="px-6 mb-6">
			<Skeleton className="h-5 w-40" />
		</div>
		<div className="px-6">
			<div className="flex items-center justify-center h-[300px] relative">
				<Skeleton className="size-60 rounded-full" />
				<div className="absolute inset-0 flex items-center justify-center">
					<Skeleton className="size-36 rounded-full bg-card" />
				</div>
			</div>
			<div className="mt-4 grid w-full grid-cols-2 gap-4">
				{Array.from({ length: 2 }).map((_, i) => (
					<div
						key={i}
						className="flex items-center gap-3 rounded-lg border bg-muted/20 p-2"
					>
						<Skeleton className="h-8 w-1 rounded-full shrink-0" />
						<div className="flex flex-col gap-1 flex-1">
							<Skeleton className="h-3 w-16" />
							<Skeleton className="h-5 w-12" />
						</div>
					</div>
				))}
			</div>
		</div>
	</div>
);

export const ContentSkeleton = () => (
	<div className="space-y-6">
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{Array.from({ length: 4 }).map((_, i) => (
				<StatCardSkeleton key={i} />
			))}
		</div>
		<PersonalitySkeleton />
		<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
			<RadarChartSkeleton />
			<PieChartSkeleton />
		</div>
	</div>
);
