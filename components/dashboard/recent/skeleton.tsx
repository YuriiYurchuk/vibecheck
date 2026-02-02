import { Skeleton } from '@/components/ui/skeleton';

export const HeaderSkeleton = () => (
	<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
		<Skeleton className="h-7 w-48" />
		<Skeleton className="h-10 w-full md:w-80 rounded-lg" />
	</div>
);

const TableRowSkeleton = () => (
	<div className="flex items-center gap-4 h-16 px-4 border-b border-border">
		<Skeleton className="h-4 w-8 shrink-0" />
		<Skeleton className="size-10 rounded-md shrink-0" />
		<Skeleton className="h-4 w-[200px]" />
		<Skeleton className="h-4 w-[150px]" />
		<Skeleton className="h-4 w-12 ml-auto" />
		<Skeleton className="h-4 w-20" />
	</div>
);

const RecentTracksTableSkeleton = () => (
	<div className="grid w-full">
		<div className="rounded-md border bg-card/50 overflow-hidden">
			<div className="flex items-center gap-4 h-12 px-4 border-b border-border bg-muted/50">
				<Skeleton className="h-3 w-8 shrink-0" />
				<Skeleton className="h-3 w-12 shrink-0" />
				<Skeleton className="h-3 w-24" />
				<Skeleton className="h-3 w-20" />
				<Skeleton className="h-3 w-12 ml-auto" />
				<Skeleton className="h-3 w-16" />
			</div>
			{Array.from({ length: 10 }).map((_, i) => (
				<TableRowSkeleton key={i} />
			))}
		</div>
	</div>
);

const MobileCardSkeleton = () => (
	<div className="rounded-lg border bg-card p-4">
		<div className="flex items-center gap-3">
			<Skeleton className="size-12 rounded-md shrink-0" />
			<div className="flex-1 space-y-2">
				<Skeleton className="h-4 w-3/4" />
				<Skeleton className="h-3 w-1/2" />
			</div>
			<div className="flex flex-col items-end gap-1.5">
				<Skeleton className="h-3 w-16" />
				<Skeleton className="h-5 w-12 rounded" />
			</div>
		</div>
	</div>
);

const RecentTracksListSkeleton = () => (
	<div className="space-y-4">
		{Array.from({ length: 8 }).map((_, i) => (
			<MobileCardSkeleton key={i} />
		))}
	</div>
);

const RecentPaginationSkeleton = () => (
	<div className="flex flex-col-reverse justify-between gap-4 py-4 sm:flex-row sm:items-center">
		<Skeleton className="h-5 w-48" />
		<div className="flex items-center justify-center gap-2">
			<Skeleton className="h-9 w-24 rounded-lg" />
			<Skeleton className="h-9 w-20 rounded-lg" />
		</div>
	</div>
);

export const ContentSkeleton = ({ isMobile }: { isMobile?: boolean }) => (
	<div className="space-y-4">
		{isMobile ? <RecentTracksListSkeleton /> : <RecentTracksTableSkeleton />}
		<RecentPaginationSkeleton />
	</div>
);
