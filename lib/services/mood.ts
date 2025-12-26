import { prisma } from '@/lib/db';

export const getAverageAudioFeatures = async (userId: string, since: Date) => {
	const result = await prisma.$queryRaw<
		Array<{
			avg_acousticness: number | null;
			avg_danceability: number | null;
			avg_energy: number | null;
			avg_instrumentalness: number | null;
			avg_liveness: number | null;
			avg_loudness: number | null;
			avg_speechiness: number | null;
			avg_tempo: number | null;
			avg_valence: number | null;
			tracks_with_features: bigint;
			total_tracks: bigint;
		}>
	>`
		SELECT 
			AVG(t.acousticness) as avg_acousticness,
			AVG(t.danceability) as avg_danceability,
			AVG(t.energy) as avg_energy,
			AVG(t.instrumentalness) as avg_instrumentalness,
			AVG(t.liveness) as avg_liveness,
			AVG(t.loudness) as avg_loudness,
			AVG(t.speechiness) as avg_speechiness,
			AVG(t.tempo) as avg_tempo,
			AVG(t.valence) as avg_valence,
			COUNT(CASE WHEN t.energy IS NOT NULL THEN 1 END) as tracks_with_features,
			COUNT(*) as total_tracks
		FROM play_history ph
		JOIN tracks t ON ph."trackId" = t.id
		WHERE ph."userId" = ${userId}
			AND ph."playedAt" >= ${since}
	`;

	const row = result[0];

	return {
		acousticness: row?.avg_acousticness ?? null,
		danceability: row?.avg_danceability ?? null,
		energy: row?.avg_energy ?? null,
		instrumentalness: row?.avg_instrumentalness ?? null,
		liveness: row?.avg_liveness ?? null,
		loudness: row?.avg_loudness ?? null,
		speechiness: row?.avg_speechiness ?? null,
		tempo: row?.avg_tempo ?? null,
		valence: row?.avg_valence ?? null,
		tracksWithFeatures: Number(row?.tracks_with_features || 0),
		totalTracks: Number(row?.total_tracks || 0),
	};
};

export const getKeyDistribution = async (userId: string, since: Date) => {
	const result = await prisma.$queryRaw<
		Array<{
			key: number | null;
			count: bigint;
		}>
	>`
		SELECT 
			t.key,
			COUNT(*) as count
		FROM play_history ph
		JOIN tracks t ON ph."trackId" = t.id
		WHERE ph."userId" = ${userId}
			AND ph."playedAt" >= ${since}
			AND t.key IS NOT NULL
		GROUP BY t.key
		ORDER BY t.key ASC
	`;

	const keyNames = [
		'C',
		'C♯/D♭',
		'D',
		'D♯/E♭',
		'E',
		'F',
		'F♯/G♭',
		'G',
		'G♯/A♭',
		'A',
		'A♯/B♭',
		'B',
	];

	const dataMap = new Map(result.map((r) => [r.key, Number(r.count)]));

	return keyNames.map((name, index) => ({
		key: name,
		count: dataMap.get(index) || 0,
	}));
};

export const getModeDistribution = async (userId: string, since: Date) => {
	const result = await prisma.$queryRaw<
		Array<{
			mode: number | null;
			count: bigint;
		}>
	>`
		SELECT 
			t.mode,
			COUNT(*) as count
		FROM play_history ph
		JOIN tracks t ON ph."trackId" = t.id
		WHERE ph."userId" = ${userId}
			AND ph."playedAt" >= ${since}
			AND t.mode IS NOT NULL
		GROUP BY t.mode
	`;

	const modeMap = new Map(result.map((r) => [r.mode, Number(r.count)]));

	return {
		major: modeMap.get(1) || 0,
		minor: modeMap.get(0) || 0,
	};
};

export const getValenceEnergyScatter = async (userId: string, since: Date) => {
	const result = await prisma.$queryRaw<
		Array<{
			track_id: string;
			track_name: string;
			valence: number;
			energy: number;
			play_count: bigint;
		}>
	>`
		SELECT 
			t.id as track_id,
			t.name as track_name,
			t.valence,
			t.energy,
			COUNT(*) as play_count
		FROM play_history ph
		JOIN tracks t ON ph."trackId" = t.id
		WHERE ph."userId" = ${userId}
			AND ph."playedAt" >= ${since}
			AND t.valence IS NOT NULL
			AND t.energy IS NOT NULL
		GROUP BY t.id, t.name, t.valence, t.energy
		ORDER BY play_count DESC
		LIMIT 100
	`;

	return result.map((r) => ({
		trackId: r.track_id,
		trackName: r.track_name,
		valence: r.valence,
		energy: r.energy,
		playCount: Number(r.play_count),
	}));
};

export const getTempoDistribution = async (userId: string, since: Date) => {
	const result = await prisma.$queryRaw<
		Array<{
			tempo_range: string;
			count: bigint;
		}>
	>`
		SELECT 
			CASE 
				WHEN t.tempo < 90 THEN 'slow'
				WHEN t.tempo >= 90 AND t.tempo < 120 THEN 'moderate'
				WHEN t.tempo >= 120 AND t.tempo < 150 THEN 'fast'
				ELSE 'very_fast'
			END as tempo_range,
			COUNT(*) as count
		FROM play_history ph
		JOIN tracks t ON ph."trackId" = t.id
		WHERE ph."userId" = ${userId}
			AND ph."playedAt" >= ${since}
			AND t.tempo IS NOT NULL
		GROUP BY tempo_range
		ORDER BY tempo_range
	`;

	const dataMap = new Map(result.map((r) => [r.tempo_range, Number(r.count)]));
	const allRanges = ['slow', 'moderate', 'fast', 'very_fast'];

	return allRanges.map((range) => ({
		range,
		count: dataMap.get(range) || 0,
	}));
};
