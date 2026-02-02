'use client';

import { Music, Play } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useDateFormatter } from '@/hooks/use-date-formatter';
import type { DashboardRecentResponse } from '@/types/dashboard';

type RecentTracksTableProps = {
	data: DashboardRecentResponse;
	offset: number;
	timezone?: string;
};

type TrackRowProps = {
	item: DashboardRecentResponse['tracks'][number];
	index: number;
	globalIndex: number;
	timezone?: string;
};

export const RecentTracksTable = ({
	data,
	offset,
	timezone,
}: RecentTracksTableProps) => {
	const tTable = useTranslations('dashboard.pages.recent.table');

	return (
		<div className="grid w-full">
			<div className="rounded-md border bg-card/50 overflow-x-auto">
				<Table className="min-w-[800px]">
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className="w-[50px] text-center">
								{tTable('number')}
							</TableHead>
							<TableHead className="w-[60px]">{tTable('cover')}</TableHead>
							<TableHead className="w-[30%] min-w-[200px]">
								{tTable('title')}
							</TableHead>
							<TableHead className="w-[25%] min-w-[150px]">
								{tTable('artist')}
							</TableHead>
							<TableHead className="text-right whitespace-nowrap">
								{tTable('time')}
							</TableHead>
							<TableHead className="w-[140px] text-right whitespace-nowrap">
								{tTable('played')}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.tracks.map((item, index) => (
							<TrackRow
								key={item.id}
								item={item}
								index={index}
								globalIndex={offset + index + 1}
								timezone={timezone}
							/>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

const TrackRow = ({ item, index, globalIndex, timezone }: TrackRowProps) => {
	const { formatRelative } = useDateFormatter(timezone);

	const formatDuration = (ms: number) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	};

	const shouldAnimate = index < 15;
	const animationStyle = shouldAnimate
		? {
				animationDelay: `${index * 0.05}s`,
				animationFillMode: 'both',
			}
		: undefined;

	const trackUrl = item.track.href || '#';

	return (
		<TableRow
			className={`group h-16 ${shouldAnimate ? 'animate-in fade-in slide-in-from-bottom-2 duration-500' : ''}`}
			style={animationStyle}
		>
			<TableCell className="relative text-center font-medium text-muted-foreground">
				<span className="transition-opacity group-hover:opacity-0">
					{globalIndex}
				</span>
				<a
					href={trackUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 hover:scale-110 active:scale-95"
					aria-label={`Play ${item.track.name}`}
					onClick={(e) => e.stopPropagation()}
				>
					<Play size={16} className="fill-primary text-primary" />
				</a>
			</TableCell>
			<TableCell>
				<div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted shadow-sm">
					{item.track.imageUrl ? (
						<Image
							src={item.track.imageUrl}
							alt={item.track.name}
							width={40}
							height={40}
							className="object-cover"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center">
							<Music size={16} className="text-muted-foreground" />
						</div>
					)}
				</div>
			</TableCell>
			<TableCell>
				<a
					href={trackUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="block max-w-[200px] md:max-w-[140px] lg:max-w-[250px] truncate font-medium text-foreground hover:underline"
				>
					{item.track.name}
				</a>
			</TableCell>
			<TableCell className="max-w-[150px] md:max-w-[120px] lg:max-w-[200px] truncate text-muted-foreground">
				{item.track.artists.map((a) => a.name).join(', ')}
			</TableCell>
			<TableCell className="text-right font-tabular-nums text-muted-foreground whitespace-nowrap">
				{formatDuration(item.track.durationMs)}
			</TableCell>
			<TableCell className="whitespace-nowrap text-right text-sm text-muted-foreground">
				{formatRelative(item.playedAt)}
			</TableCell>
		</TableRow>
	);
};
