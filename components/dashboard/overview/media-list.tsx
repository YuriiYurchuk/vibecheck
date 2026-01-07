'use client';

import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/ui/fade-in';
import { MediaCard } from '@/components/ui/media-card';
import type { DashboardOverviewResponse } from '@/types/dashboard';

type MediaListProps = {
	items:
		| DashboardOverviewResponse['topTracks']
		| DashboardOverviewResponse['topArtists'];
	type: 'track' | 'artist';
};

const ANIMATION_THRESHOLD = 10;

export const MediaList = ({ items, type }: MediaListProps) => {
	const tMedia = useTranslations('dashboard.pages.overview.mediaList');

	if (items.length === 0) {
		return (
			<div className="text-center py-8 text-muted-foreground">
				<p>{type === 'track' ? tMedia('no_tracks') : tMedia('no_artists')}</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{items.map((item, index) => {
				const card = <MediaCard item={item} type={type} rank={index + 1} />;

				if (index < ANIMATION_THRESHOLD) {
					return (
						<FadeIn key={item.id} delay={index * 50}>
							{card}
						</FadeIn>
					);
				}

				return <div key={item.id}>{card}</div>;
			})}
		</div>
	);
};
