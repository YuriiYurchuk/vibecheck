import { chunkArray, delay } from '@/lib/helpers';
import type { AudioFeatures, FeaturesResponse } from '@/types/recco-beats';
import { RECCO_BEATS_API_BASE } from './constants';

export const fetchFeatures = async (
	trackIds: string[]
): Promise<Map<string, AudioFeatures>> => {
	if (!trackIds.length) return new Map();

	const uniqueIds = [...new Set(trackIds)];
	const features = new Map<string, AudioFeatures>();
	const BATCH_SIZE = 40;
	const chunks = chunkArray(uniqueIds, BATCH_SIZE);

	for (let i = 0; i < chunks.length; i++) {
		try {
			const ids = chunks[i].join(',');
			const res = await fetch(
				`${RECCO_BEATS_API_BASE}/audio-features?ids=${ids}`,
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				}
			);

			if (!res.ok) {
				console.error(`[ReccoBeats] HTTP ${res.status} for batch ${i + 1}`);
				continue;
			}

			const data = (await res.json()) as FeaturesResponse;

			if (data.content && Array.isArray(data.content)) {
				data.content.forEach((feature) => {
					if (feature?.href) {
						const match = feature.href.match(/track\/([a-zA-Z0-9]+)/);
						const spotifyId = match ? match[1] : null;

						if (spotifyId) {
							features.set(spotifyId, feature);
						}
					}
				});
			}

			if (i < chunks.length - 1) {
				await delay(100);
			}
		} catch (err) {
			console.error(`[ReccoBeats] Batch ${i + 1} error:`, err);
		}
	}

	return features;
};
