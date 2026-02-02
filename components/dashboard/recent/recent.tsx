'use client';

import { useQuery } from '@tanstack/react-query';
import { Music, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { RecentPagination } from '@/components/dashboard/recent/recent-pagination';
import { RecentTracksList } from '@/components/dashboard/recent/recent-tracks-list';
import { RecentTracksTable } from '@/components/dashboard/recent/recent-tracks-table';
import { ErrorState } from '@/components/ui/error-state';
import { FadeIn } from '@/components/ui/fade-in';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUrlFilters } from '@/hooks/use-url-filters';
import { fetchDashboardRecent } from '@/lib/api/recent';
import { useSession } from '@/lib/auth/client';
import { ContentSkeleton, HeaderSkeleton } from './skeleton';

const LIMIT = 50;

export const Recent = () => {
	const tRecent = useTranslations('dashboard.pages.recent');
	const session = useSession();
	const timezone = session?.data?.user?.timezone || 'UTC';
	const isMobile = useIsMobile();

	const { filters, updateMultipleFilters, isReady } = useUrlFilters({
		storageKey: 'dashboard-recent',
		defaults: {
			search: '',
			offset: 0,
		},
		deserializers: {
			offset: (val) => parseInt(val, 10),
		},
	});

	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		if (isReady) {
			setSearchTerm(String(filters.search));
		}
	}, [isReady, filters.search]);

	const debouncedSearch = useDebounce(searchTerm, 500);

	useEffect(() => {
		if (!isReady) return;
		if (debouncedSearch !== filters.search) {
			updateMultipleFilters({
				search: debouncedSearch,
				offset: 0,
			});
		}
	}, [debouncedSearch, isReady, filters.search, updateMultipleFilters]);

	const { data, isPending, isError, error, refetch } = useQuery({
		queryKey: ['dashboard-recent', filters.search, filters.offset],
		queryFn: () =>
			fetchDashboardRecent(
				LIMIT,
				Number(filters.offset),
				String(filters.search)
			),
		enabled: isReady,
		placeholderData: (prev) => prev,
	});

	const renderContent = () => {
		if (isPending) {
			return <ContentSkeleton isMobile={isMobile} />;
		}

		if (isError) {
			return (
				<FadeIn delay={200}>
					<ErrorState message={error?.message} retry={() => refetch()} />
				</FadeIn>
			);
		}

		if (!data || data.tracks.length === 0) {
			return (
				<FadeIn delay={200}>
					<div className="flex flex-col items-center justify-center rounded-md border border-dashed bg-muted/20 py-24">
						<div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
							<Music className="size-8 text-muted-foreground" />
						</div>
						<h3 className="text-lg font-medium">{tRecent('empty.title')}</h3>
						<p className="mt-1 max-w-sm text-center text-sm text-muted-foreground">
							{tRecent('empty.description')}
						</p>
					</div>
				</FadeIn>
			);
		}

		return (
			<div className="space-y-4">
				{isMobile ? (
					<RecentTracksList data={data} timezone={timezone} />
				) : (
					<RecentTracksTable
						data={data}
						offset={Number(filters.offset)}
						timezone={timezone}
					/>
				)}
				<RecentPagination
					offset={Number(filters.offset)}
					limit={LIMIT}
					total={data.total}
					hasMore={data.hasMore}
					onUpdateOffset={(newOffset) =>
						updateMultipleFilters({ offset: newOffset })
					}
				/>
			</div>
		);
	};

	if (!isReady) {
		return (
			<div className="space-y-6">
				<HeaderSkeleton />
				<ContentSkeleton isMobile={isMobile} />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
				<FadeIn delay={200}>
					<h2 className="text-xl font-semibold text-muted-foreground">
						{tRecent('title')}
					</h2>
				</FadeIn>
				<FadeIn delay={200} className="relative w-full md:w-80">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<Input
						placeholder={tRecent('searchPlaceholder')}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-9"
					/>
				</FadeIn>
			</div>
			{renderContent()}
		</div>
	);
};
