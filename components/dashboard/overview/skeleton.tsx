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

export const ContentSkeleton = () => (
	<div className="space-y-6">
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Skeleton className="h-[120px] rounded-xl" />
			<Skeleton className="h-[120px] rounded-xl" />
			<Skeleton className="h-[120px] rounded-xl" />
			<Skeleton className="h-[120px] rounded-xl" />
		</div>
		<Skeleton className="h-[300px] w-full rounded-xl" />
	</div>
);
