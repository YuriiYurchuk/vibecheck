import { Skeleton } from '@/components/ui/skeleton';

export const HeaderSkeleton = () => (
	<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
		<div className="space-y-2">
			<Skeleton className="h-8 w-48 sm:h-10 sm:w-64" />
			<Skeleton className="h-4 w-32 sm:w-48" />
		</div>
		<div className="flex flex-wrap items-center gap-4">
			<div className="flex items-center gap-2">
				<Skeleton className="h-4 w-4 rounded-full" />
				<Skeleton className="h-9 w-[200px] rounded-lg" />
			</div>
			<Skeleton className="hidden h-6 w-px sm:block" />
			<div className="flex items-center gap-2">
				<Skeleton className="h-4 w-4 rounded-full" />
				<Skeleton className="h-9 w-[120px] rounded-lg" />
			</div>
		</div>
	</div>
);

export const StatCardSkeleton = () => (
	<div className="rounded-xl border bg-card py-6">
		<div className="px-6">
			<div className="flex items-center gap-3 mb-6">
				<Skeleton className="h-9 w-9 rounded-lg" />
				<Skeleton className="h-4 w-24" />
			</div>
		</div>
		<div className="px-6">
			<Skeleton className="h-9 w-16 mb-1" />
		</div>
	</div>
);

export const ChartSkeleton = () => (
	<div className="rounded-xl border bg-card py-6">
		<div className="px-6 mb-6">
			<div className="flex items-center justify-between">
				<Skeleton className="h-5 w-40" />
			</div>
		</div>
		<div className="px-6">
			<div className="flex items-end justify-between gap-2 h-[300px]">
				<Skeleton className="w-full rounded-t h-[45%]" />
				<Skeleton className="w-full rounded-t h-[85%]" />
				<Skeleton className="w-full rounded-t h-[60%]" />
				<Skeleton className="w-full rounded-t h-[30%]" />
				<Skeleton className="w-full rounded-t h-[70%]" />
				<Skeleton className="w-full rounded-t h-[50%]" />
				<Skeleton className="w-full rounded-t h-[40%]" />
			</div>
			<div className="flex justify-between mt-4 gap-2">
				{Array.from({ length: 7 }).map((_, i) => (
					<Skeleton className="h-3 w-full" key={i} />
				))}
			</div>
		</div>
	</div>
);

export const TrackCardSkeleton = () => (
	<div className="rounded-xl border bg-card p-4">
		<div className="flex items-center gap-4">
			<Skeleton className="h-8 w-8 shrink-0" />
			<Skeleton className="h-16 w-16 rounded-md shrink-0" />
			<div className="flex-1 space-y-2">
				<Skeleton className="h-4 w-3/4" />
				<Skeleton className="h-3 w-1/2" />
			</div>
			<div className="text-right space-y-1 shrink-0">
				<Skeleton className="h-4 w-12 ml-auto" />
				<Skeleton className="h-3 w-10 ml-auto" />
			</div>
		</div>
	</div>
);

export const ArtistCardSkeleton = () => (
	<div className="rounded-xl border bg-card p-4">
		<div className="flex items-center gap-4">
			<Skeleton className="h-8 w-8 shrink-0" />
			<Skeleton className="h-16 w-16 rounded-full shrink-0" />
			<div className="flex-1">
				<Skeleton className="h-4 w-2/3" />
			</div>
			<div className="text-right space-y-1 shrink-0">
				<Skeleton className="h-4 w-12 ml-auto" />
				<Skeleton className="h-3 w-10 ml-auto" />
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
		<ChartSkeleton />
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<div className="space-y-4">
				<Skeleton className="h-7 w-36" />
				<div className="space-y-3">
					{Array.from({ length: 5 }).map((_, i) => (
						<TrackCardSkeleton key={i} />
					))}
				</div>
			</div>
			<div className="space-y-4">
				<Skeleton className="h-7 w-36" />
				<div className="space-y-3">
					{Array.from({ length: 5 }).map((_, i) => (
						<ArtistCardSkeleton key={i} />
					))}
				</div>
			</div>
		</div>
	</div>
);
