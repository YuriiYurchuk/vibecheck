import { Clock, Music } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn } from '@/components/ui/fade-in';
import { useDateFormatter } from '@/hooks/use-date-formatter';
import type { DashboardRecentResponse } from '@/types/dashboard';

type RecentTracksListProps = {
	data: DashboardRecentResponse;
	timezone?: string;
};

type TrackItemProps = {
	item: DashboardRecentResponse['tracks'][number];
	timezone?: string;
};

export const RecentTracksList = ({ data, timezone }: RecentTracksListProps) => {
	return (
		<div className="space-y-4">
			{data.tracks.map((item, index) => {
				const shouldAnimate = index < 6;

				if (shouldAnimate) {
					return (
						<FadeIn key={item.id} delay={index * 0.05}>
							<TrackItem item={item} timezone={timezone} />
						</FadeIn>
					);
				}

				return <TrackItem key={item.id} item={item} timezone={timezone} />;
			})}
		</div>
	);
};

const TrackItem = ({ item, timezone }: TrackItemProps) => {
	const { formatRelative } = useDateFormatter(timezone);

	const formatDuration = (ms: number) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	};

	return (
		<a
			href={item.track.href || '#'}
			target="_blank"
			rel="noopener noreferrer"
			className="block"
		>
			<Card>
				<CardContent className="flex items-center gap-3">
					<div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
						{item.track.imageUrl ? (
							<Image
								src={item.track.imageUrl}
								alt={item.track.name}
								width={48}
								height={48}
								className="object-cover"
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center">
								<Music size={20} className="text-muted-foreground" />
							</div>
						)}
					</div>
					<div className="min-w-0 flex-1">
						<h4 className="truncate text-sm font-medium text-foreground">
							{item.track.name}
						</h4>
						<p className="truncate text-xs text-muted-foreground">
							{item.track.artists.map((a) => a.name).join(', ')}
						</p>
					</div>
					<div className="flex min-w-20 flex-col items-end gap-1 text-right">
						<span className="text-[10px] text-muted-foreground">
							{formatRelative(item.playedAt)}
						</span>
						<div className="flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-[10px] text-secondary-foreground">
							<Clock size={10} />
							<span>{formatDuration(item.track.durationMs)}</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</a>
	);
};
