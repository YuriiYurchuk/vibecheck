'use client';

import { Music, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { RecentPagination } from '@/components/dashboard/recent/recent-pagination';
import { RecentTracksList } from '@/components/dashboard/recent/recent-tracks-list';
import { RecentTracksTable } from '@/components/dashboard/recent/recent-tracks-table';
import { FadeIn } from '@/components/ui/fade-in';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { useIsMobile } from '@/hooks/use-mobile';
import { generateMockRecent } from '@/lib/mock-data/dashboard';

const LIMIT = 50;

export const RecentDemo = () => {
	const tRecent = useTranslations('dashboard.pages.recent');
	const timezone = 'UTC';
	const isMobile = useIsMobile();

	const [searchTerm, setSearchTerm] = useState('');
	const [offset, setOffset] = useState(0);

	const debouncedSearch = useDebounce(searchTerm, 500);

	const data = useMemo(() => {
		return generateMockRecent(LIMIT, offset, debouncedSearch || undefined);
	}, [offset, debouncedSearch]);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		setOffset(0);
	};

	const renderContent = () => {
		if (!data) return null;

		if (data.tracks.length === 0) {
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
					<RecentTracksTable data={data} offset={offset} timezone={timezone} />
				)}
				<RecentPagination
					offset={offset}
					limit={LIMIT}
					total={data.total}
					hasMore={data.hasMore}
					onUpdateOffset={(newOffset) => setOffset(newOffset)}
				/>
			</div>
		);
	};

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
						onChange={handleSearchChange}
						className="pl-9"
					/>
				</FadeIn>
			</div>
			{renderContent()}
		</div>
	);
};
