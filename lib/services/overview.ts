import { format, startOfDay, subDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { prisma } from '@/lib/db';

export const getSummaryStats = async (userId: string, since: Date) => {
	const [basicStats, uniqueArtistsResult] = await Promise.all([
		prisma.$queryRaw<
			Array<{
				total_plays: bigint;
				unique_tracks: bigint;
				total_duration_ms: bigint;
			}>
		>`
      SELECT 
        COUNT(*) as total_plays,
        COUNT(DISTINCT ph."trackId") as unique_tracks,
        SUM(t."durationMs") as total_duration_ms
      FROM play_history ph
      JOIN tracks t ON ph."trackId" = t.id
      WHERE ph."userId" = ${userId}
        AND ph."playedAt" >= ${since}
    `,

		prisma.$queryRaw<
			Array<{
				unique_artists: bigint;
			}>
		>`
      SELECT COUNT(DISTINCT ta."artistId") as unique_artists
      FROM play_history ph
      JOIN track_artists ta ON ph."trackId" = ta."trackId"
      WHERE ph."userId" = ${userId}
        AND ph."playedAt" >= ${since}
    `,
	]);

	const row = basicStats[0];
	const totalMs = Number(row?.total_duration_ms || 0);
	const totalHours = Math.floor(totalMs / (1000 * 60 * 60));

	return {
		totalPlays: Number(row?.total_plays || 0),
		uniqueTracks: Number(row?.unique_tracks || 0),
		uniqueArtists: Number(uniqueArtistsResult[0]?.unique_artists || 0),
		totalHours,
	};
};

export const getTopTracks = async (
	userId: string,
	since: Date,
	limit: number
) => {
	const result = await prisma.$queryRaw<
		Array<{
			id: string;
			name: string;
			imageUrl: string | null;
			play_count: bigint;
			artists: unknown;
		}>
	>`
    WITH track_plays AS (
      SELECT 
        ph."trackId",
        COUNT(*) as play_count
      FROM play_history ph
      WHERE ph."userId" = ${userId}
        AND ph."playedAt" >= ${since}
      GROUP BY ph."trackId"
    )
    SELECT 
      t.id,
      t.name,
      t."imageUrl",
      tp.play_count,
      JSON_AGG(
        JSON_BUILD_OBJECT('id', a.id, 'name', a.name)
      ) as artists
    FROM track_plays tp
    JOIN tracks t ON tp."trackId" = t.id
    LEFT JOIN track_artists ta ON t.id = ta."trackId"
    LEFT JOIN artists a ON ta."artistId" = a.id
    GROUP BY t.id, t.name, t."imageUrl", tp.play_count
    ORDER BY tp.play_count DESC
    LIMIT ${limit}
  `;

	return result.map((r) => ({
		id: r.id,
		name: r.name,
		imageUrl: r.imageUrl,
		artists: (r.artists as Array<{ id: string; name: string }>) || [],
		playCount: Number(r.play_count),
	}));
};

export const getTopArtists = async (
	userId: string,
	since: Date,
	limit: number
) => {
	const result = await prisma.$queryRaw<
		Array<{
			id: string;
			name: string;
			imageUrl: string | null;
			play_count: bigint;
		}>
	>`
    SELECT 
      a.id,
      a.name,
      a."imageUrl",
      COUNT(*) as play_count
    FROM play_history ph
    JOIN track_artists ta ON ph."trackId" = ta."trackId"
    JOIN artists a ON ta."artistId" = a.id
    WHERE ph."userId" = ${userId}
      AND ph."playedAt" >= ${since}
    GROUP BY a.id, a.name, a."imageUrl"
    ORDER BY play_count DESC
    LIMIT ${limit}
  `;

	return result.map((r) => ({
		id: r.id,
		name: r.name,
		imageUrl: r.imageUrl,
		playCount: Number(r.play_count),
	}));
};

export const getDailyActivity = async (
	userId: string,
	since: Date,
	timezone: string
) => {
	const result = await prisma.$queryRaw<
		Array<{
			date: string;
			count: bigint;
		}>
	>`
    SELECT 
      TO_CHAR("playedAt" AT TIME ZONE ${timezone}, 'YYYY-MM-DD') as date,
      COUNT(*)::int as count
    FROM play_history
    WHERE "userId" = ${userId}
      AND "playedAt" >= ${since}
    GROUP BY date
    ORDER BY date ASC
  `;

	const resultMap = new Map(result.map((r) => [r.date, Number(r.count)]));
	const days: Array<{ date: string; plays: number }> = [];
	const nowInTZ = toZonedTime(new Date(), timezone);
	const todayStartInTZ = startOfDay(nowInTZ);

	for (let i = 6; i >= 0; i--) {
		const dayInTZ = subDays(todayStartInTZ, i);
		const dateStr = format(dayInTZ, 'yyyy-MM-dd');

		days.push({
			date: dateStr,
			plays: resultMap.get(dateStr) || 0,
		});
	}

	return days;
};
