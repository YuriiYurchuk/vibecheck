import { Skeleton } from '@/components/ui/skeleton';

const ProfileHeaderSkeleton = () => (
	<div className="flex flex-col md:flex-row items-center md:items-end gap-6 pb-2">
		<Skeleton className="size-32 rounded-full" />
		<div className="space-y-3 text-center md:text-left mb-2">
			<Skeleton className="h-10 w-48 mx-auto md:mx-0" />
			<div className="flex items-center justify-center md:justify-start gap-2">
				<Skeleton className="size-4 rounded" />
				<Skeleton className="h-4 w-56" />
			</div>
		</div>
	</div>
);

const InfoCardSkeleton = () => (
	<div className="rounded-lg border bg-card p-6">
		<Skeleton className="h-3 w-20 mb-3" />
		<div className="flex items-center gap-3">
			<Skeleton className="size-9 rounded-md" />
			<Skeleton className="h-5 w-32" />
		</div>
	</div>
);

const ProfileInfoGridSkeleton = () => (
	<div className="grid gap-6">
		<div className="flex items-center gap-2">
			<Skeleton className="size-5 rounded" />
			<Skeleton className="h-6 w-48" />
		</div>
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
			{Array.from({ length: 3 }).map((_, i) => (
				<InfoCardSkeleton key={i} />
			))}
		</div>
	</div>
);

const DeleteAccountSectionSkeleton = () => (
	<div className="rounded-lg border p-6 md:p-8">
		<div className="flex flex-col md:flex-row items-center justify-between gap-6">
			<div className="flex items-start gap-4 flex-1">
				<Skeleton className="size-12 rounded-full shrink-0 hidden md:block" />
				<div className="space-y-2 text-center md:text-left flex-1">
					<Skeleton className="h-6 w-40 mx-auto md:mx-0" />
					<Skeleton className="h-4 w-full max-w-xl mx-auto md:mx-0" />
					<Skeleton className="h-4 w-3/4 max-w-md mx-auto md:mx-0" />
				</div>
			</div>
			<Skeleton className="h-11 w-full md:w-40 rounded-lg" />
		</div>
	</div>
);

export const ProfileSkeleton = () => (
	<div className="space-y-8 w-full">
		<ProfileHeaderSkeleton />
		<div className="h-px bg-border" />
		<ProfileInfoGridSkeleton />
		<DeleteAccountSectionSkeleton />
	</div>
);
