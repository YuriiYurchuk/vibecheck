'use client';

import { ExternalLink, Headphones, Mic2, Music } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { DashboardOverviewResponse } from '@/types/dashboard';
import { Card, CardContent } from './card';

type Track = DashboardOverviewResponse['topTracks'][number];
type Artist = DashboardOverviewResponse['topArtists'][number];

type MediaCardProps = {
	item: Track | Artist;
	type: 'track' | 'artist';
	rank?: number;
	className?: string;
};

export const MediaCard = ({ item, type, rank, className }: MediaCardProps) => {
	const isTrack = type === 'track';
	const subtitle = isTrack
		? (item as Track).artists.map((a) => a.name).join(', ')
		: undefined;

	return (
		<Card className={cn('group hover:shadow-md transition-shadow', className)}>
			<CardContent className="px-3 xl:px-6">
				<div className="flex items-center gap-3">
					{rank && (
						<div className="shrink-0 w-6 text-center">
							<span
								className={cn(
									'text-lg font-bold',
									rank === 1 && 'text-yellow-500',
									rank === 2 && 'text-gray-400',
									rank === 3 && 'text-orange-600',
									rank > 3 && 'text-muted-foreground'
								)}
							>
								{rank}
							</span>
						</div>
					)}
					<div
						className={cn(
							'relative w-12 h-12 shrink-0 overflow-hidden bg-muted',
							isTrack ? 'rounded-md' : 'rounded-full'
						)}
					>
						{item.imageUrl ? (
							<Image
								src={item.imageUrl}
								alt={item.name}
								fill
								className="object-cover"
								sizes="48px"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center">
								{isTrack ? (
									<Music className="size-5 text-muted-foreground" />
								) : (
									<Mic2 className="size-5 text-muted-foreground" />
								)}
							</div>
						)}
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
							{item.name}
						</h3>
						{subtitle && (
							<p className="text-xs text-muted-foreground truncate">
								{subtitle}
							</p>
						)}
					</div>
					<div className="flex items-center gap-1.5 shrink-0">
						<Headphones className="size-3.5 text-muted-foreground" />
						<span className="text-sm font-semibold">{item.playCount}</span>
					</div>
					{item.href && (
						<Link
							href={item.href}
							target="_blank"
							rel="noopener noreferrer"
							className="shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
						>
							<ExternalLink className="size-4 text-muted-foreground hover:text-primary" />
						</Link>
					)}
				</div>
			</CardContent>
		</Card>
	);
};
