import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

type RecentPaginationProps = {
	offset: number;
	limit: number;
	total: number;
	hasMore: boolean;
	onUpdateOffset: (newOffset: number) => void;
};

export const RecentPagination = ({
	offset,
	limit,
	total,
	hasMore,
	onUpdateOffset,
}: RecentPaginationProps) => {
	const tPagination = useTranslations('dashboard.pages.recent.pagination');

	const start = offset + 1;
	const end = Math.min(offset + limit, total);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<div className="flex flex-col-reverse justify-between gap-4 py-4 sm:flex-row sm:items-center">
			<div className="text-center text-sm text-muted-foreground sm:text-left">
				{tPagination.rich('info', {
					start: start.toString(),
					end: end.toString(),
					total: total.toString(),
					medium: (chunks) => (
						<span className="font-medium text-foreground">{chunks}</span>
					),
				})}
			</div>
			<div className="flex items-center justify-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => {
						onUpdateOffset(Math.max(0, offset - limit));
						scrollToTop();
					}}
					disabled={offset === 0}
				>
					<ChevronLeft className="mr-1 size-4" />
					{tPagination('previous')}
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => {
						onUpdateOffset(offset + limit);
						scrollToTop();
					}}
					disabled={!hasMore}
				>
					{tPagination('next')}
					<ChevronRight className="ml-1 size-4" />
				</Button>
			</div>
		</div>
	);
};
