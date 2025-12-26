import { startOfDay, subDays } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { prisma } from '@/lib/db';

const getLast30DaysStart = (timezone: string): Date => {
	const nowInTZ = toZonedTime(new Date(), timezone);
	const todayStartInTZ = startOfDay(nowInTZ);
	const last30DaysInTZ = subDays(todayStartInTZ, 30);
	return fromZonedTime(last30DaysInTZ, timezone);
};

const getPrevious30DaysRange = (
	timezone: string
): { start: Date; end: Date } => {
	const nowInTZ = toZonedTime(new Date(), timezone);
	const todayStartInTZ = startOfDay(nowInTZ);
	const last30DaysStartInTZ = subDays(todayStartInTZ, 30);
	const previous30DaysStartInTZ = subDays(todayStartInTZ, 60);

	return {
		start: fromZonedTime(previous30DaysStartInTZ, timezone),
		end: fromZonedTime(last30DaysStartInTZ, timezone),
	};
};

export const getTotalHours = async (userId: string, since: Date) => {
	const result = await prisma.$queryRaw<Array<{ total_ms: bigint }>>`
		SELECT SUM(t."durationMs") as total_ms
		FROM play_history ph
		JOIN tracks t ON ph."trackId" = t.id
		WHERE ph."userId" = ${userId}
			AND ph."playedAt" >= ${since}
	`;

	const totalMs = Number(result[0]?.total_ms || 0);

	return {
		hours: Math.floor(totalMs / (1000 * 60 * 60)),
		minutes: Math.floor((totalMs / (1000 * 60)) % 60),
	};
};

export const getMostActiveDay = async (
	userId: string,
	since: Date,
	timezone: string
) => {
	const result = await prisma.$queryRaw<
		Array<{ day_of_week: number; count: bigint }>
	>`
		SELECT 
			EXTRACT(DOW FROM "playedAt" AT TIME ZONE ${timezone})::int as day_of_week,
			COUNT(*) as count
		FROM play_history
		WHERE "userId" = ${userId}
			AND "playedAt" >= ${since}
		GROUP BY day_of_week
		ORDER BY count DESC
		LIMIT 1
	`;

	if (!result[0]) {
		return { day: 'Unknown', dayIndex: 0, count: 0 };
	}

	const dayNames = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];

	return {
		day: dayNames[result[0].day_of_week],
		dayIndex: result[0].day_of_week,
		count: Number(result[0].count),
	};
};

export const getPeakListeningHour = async (
	userId: string,
	since: Date,
	timezone: string
) => {
	const result = await prisma.$queryRaw<Array<{ hour: number; count: bigint }>>`
		SELECT 
			EXTRACT(HOUR FROM "playedAt" AT TIME ZONE ${timezone})::int as hour,
			COUNT(*) as count
		FROM play_history
		WHERE "userId" = ${userId}
			AND "playedAt" >= ${since}
		GROUP BY hour
		ORDER BY count DESC
		LIMIT 1
	`;

	if (!result[0]) {
		return { hour: 12, range: '12:00-13:00', count: 0 };
	}

	const hour = result[0].hour;

	return {
		hour,
		range: `${String(hour).padStart(2, '0')}:00-${String(hour + 1).padStart(
			2,
			'0'
		)}:00`,
		count: Number(result[0].count),
	};
};

export const getMusicalMood = async (userId: string, since: Date) => {
	const result = await prisma.$queryRaw<
		Array<{ avg_energy: number | null; avg_valence: number | null }>
	>`
		SELECT 
			AVG(t.energy) as avg_energy,
			AVG(t.valence) as avg_valence
		FROM play_history ph
		JOIN tracks t ON ph."trackId" = t.id
		WHERE ph."userId" = ${userId}
			AND ph."playedAt" >= ${since}
			AND t.energy IS NOT NULL
			AND t.valence IS NOT NULL
	`;

	const energy = result[0]?.avg_energy ?? 0.5;
	const valence = result[0]?.avg_valence ?? 0.5;

	let mood = 'Balanced';
	let moodEmoji = '😐';

	if (energy > 0.7 && valence > 0.7) {
		mood = 'Energetic & Happy';
		moodEmoji = '🔥😊';
	} else if (energy > 0.7 && valence < 0.3) {
		mood = 'Intense & Emotional';
		moodEmoji = '⚡😤';
	} else if (energy < 0.3 && valence > 0.7) {
		mood = 'Calm & Positive';
		moodEmoji = '😌✨';
	} else if (energy < 0.3 && valence < 0.3) {
		mood = 'Melancholic & Thoughtful';
		moodEmoji = '🌧️💭';
	}

	return {
		mood,
		moodEmoji,
		energy,
		valence,
	};
};

export const getLongestStreak = async (userId: string, timezone: string) => {
	const sixMonthsAgo = getLast30DaysStart(timezone);
	const sixMonthsAgoAdjusted = subDays(sixMonthsAgo, 150);

	const result = await prisma.$queryRaw<Array<{ date: string }>>`
		SELECT DISTINCT DATE("playedAt" AT TIME ZONE ${timezone}) as date
		FROM play_history
		WHERE "userId" = ${userId}
			AND "playedAt" >= ${sixMonthsAgoAdjusted}
		ORDER BY date ASC
	`;

	if (result.length === 0) {
		return { longestStreak: 0, currentStreak: 0 };
	}

	let currentStreak = 1;
	let longestStreak = 1;
	let tempStreak = 1;

	const todayInTZ = toZonedTime(new Date(), timezone);
	const todayStr = startOfDay(todayInTZ).toISOString().split('T')[0];
	const yesterdayInTZ = subDays(todayInTZ, 1);
	const yesterdayStr = startOfDay(yesterdayInTZ).toISOString().split('T')[0];
	const lastDate = result[result.length - 1].date;

	for (let i = 1; i < result.length; i++) {
		const prevDate = new Date(result[i - 1].date);
		const currDate = new Date(result[i].date);

		const dayDiff = Math.floor(
			(currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
		);

		if (dayDiff === 1) {
			tempStreak++;
			longestStreak = Math.max(longestStreak, tempStreak);
		} else {
			tempStreak = 1;
		}
	}

	if (lastDate === todayStr || lastDate === yesterdayStr) {
		currentStreak = 1;
		for (let i = result.length - 2; i >= 0; i--) {
			const currDate = new Date(result[i + 1].date);
			const prevDate = new Date(result[i].date);
			const dayDiff = Math.floor(
				(currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
			);

			if (dayDiff === 1) {
				currentStreak++;
			} else {
				break;
			}
		}
	} else {
		currentStreak = 0;
	}

	return {
		longestStreak,
		currentStreak,
	};
};

export const compare30DayPeriods = async (userId: string, timezone: string) => {
	const last30DaysStart = getLast30DaysStart(timezone);
	const previousPeriod = getPrevious30DaysRange(timezone);

	const [current, previous] = await Promise.all([
		prisma.$queryRaw<Array<{ count: bigint }>>`
			SELECT COUNT(*) as count
			FROM play_history
			WHERE "userId" = ${userId}
				AND "playedAt" >= ${last30DaysStart}
		`,
		prisma.$queryRaw<Array<{ count: bigint }>>`
			SELECT COUNT(*) as count
			FROM play_history
			WHERE "userId" = ${userId}
				AND "playedAt" >= ${previousPeriod.start}
				AND "playedAt" < ${previousPeriod.end}
		`,
	]);

	const currentCount = Number(current[0]?.count || 0);
	const previousCount = Number(previous[0]?.count || 0);

	const percentChange =
		previousCount > 0
			? Math.round(((currentCount - previousCount) / previousCount) * 100)
			: 0;

	return {
		current: currentCount,
		previous: previousCount,
		percentChange,
		isIncrease: percentChange > 0,
		changeText:
			percentChange === 0
				? 'Same as previous period'
				: percentChange > 0
					? `+${percentChange}% more than previous period`
					: `${Math.abs(percentChange)}% less than previous period`,
	};
};
