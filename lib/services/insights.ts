import {
	endOfMonth,
	startOfDay,
	startOfMonth,
	subDays,
	subMonths,
} from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { Prisma, prisma } from '@/lib/db';

export const getMonthRange = (
	timezone: string,
	monthsAgo: number = 0
): { start: Date; end: Date } => {
	const nowInTZ = toZonedTime(new Date(), timezone);
	const targetMonthInTZ = subMonths(nowInTZ, monthsAgo);
	const monthStartInTZ = startOfMonth(targetMonthInTZ);
	const monthEndInTZ = endOfMonth(targetMonthInTZ);

	return {
		start: fromZonedTime(monthStartInTZ, timezone),
		end: fromZonedTime(monthEndInTZ, timezone),
	};
};

export const getTotalHours = async (
	userId: string,
	since: Date,
	until?: Date
) => {
	const result = await prisma.$queryRaw<Array<{ total_ms: bigint }>>`
		SELECT SUM(t."durationMs") as total_ms
		FROM play_history ph
		JOIN tracks t ON ph."trackId" = t.id
		WHERE ph."userId" = ${userId}
			AND ph."playedAt" >= ${since}
			${until ? Prisma.sql`AND ph."playedAt" <= ${until}` : Prisma.empty}
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
	timezone: string,
	until?: Date
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
			${until ? Prisma.sql`AND "playedAt" <= ${until}` : Prisma.empty}
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
	timezone: string,
	until?: Date
) => {
	const result = await prisma.$queryRaw<Array<{ hour: number; count: bigint }>>`
		SELECT 
			EXTRACT(HOUR FROM "playedAt" AT TIME ZONE ${timezone})::int as hour,
			COUNT(*) as count
		FROM play_history
		WHERE "userId" = ${userId}
			AND "playedAt" >= ${since}
			${until ? Prisma.sql`AND "playedAt" <= ${until}` : Prisma.empty}
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
		range: `${String(hour).padStart(2, '0')}:00-${String(hour + 1).padStart(2, '0')}:00`,
		count: Number(result[0].count),
	};
};

export const getMusicalMood = async (
	userId: string,
	since: Date,
	until?: Date
) => {
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
			${until ? Prisma.sql`AND ph."playedAt" <= ${until}` : Prisma.empty}
			AND t.energy IS NOT NULL
			AND t.valence IS NOT NULL
	`;

	const energy = result[0]?.avg_energy ?? 0.5;
	const valence = result[0]?.avg_valence ?? 0.5;

	return {
		energy,
		valence,
	};
};

export const getLongestStreak = async (userId: string, timezone: string) => {
	const nowInTZ = toZonedTime(new Date(), timezone);
	const sixMonthsAgoInTZ = subDays(startOfDay(nowInTZ), 180);
	const sixMonthsAgo = fromZonedTime(sixMonthsAgoInTZ, timezone);

	const result = await prisma.$queryRaw<Array<{ date: string }>>`
		SELECT DISTINCT DATE("playedAt" AT TIME ZONE ${timezone}) as date
		FROM play_history
		WHERE "userId" = ${userId}
			AND "playedAt" >= ${sixMonthsAgo}
		ORDER BY date ASC
	`;

	if (result.length === 0) {
		return { longestStreak: 0, currentStreak: 0 };
	}

	let longestStreak = 1;
	let tempStreak = 1;
	let currentStreak = 0;

	const todayInTZ = toZonedTime(new Date(), timezone);
	const todayStr = startOfDay(todayInTZ).toISOString().split('T')[0];
	const yesterdayInTZ = subDays(todayInTZ, 1);
	const yesterdayStr = startOfDay(yesterdayInTZ).toISOString().split('T')[0];
	const tomorrowInTZ = subDays(todayInTZ, -1);
	const tomorrowStr = startOfDay(tomorrowInTZ).toISOString().split('T')[0];

	const lastDate = new Date(result[result.length - 1].date)
		.toISOString()
		.split('T')[0];

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

	if (
		lastDate === todayStr ||
		lastDate === yesterdayStr ||
		lastDate === tomorrowStr
	) {
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
	}

	return {
		longestStreak,
		currentStreak,
	};
};

export const compareMonths = async (
	userId: string,
	timezone: string,
	currentMonthsAgo: number = 0
) => {
	const currentMonth = getMonthRange(timezone, currentMonthsAgo);
	const previousMonth = getMonthRange(timezone, currentMonthsAgo + 1);

	const [current, previous] = await Promise.all([
		prisma.$queryRaw<Array<{ count: bigint }>>`
			SELECT COUNT(*) as count
			FROM play_history
			WHERE "userId" = ${userId}
				AND "playedAt" >= ${currentMonth.start}
				AND "playedAt" <= ${currentMonth.end}
		`,
		prisma.$queryRaw<Array<{ count: bigint }>>`
			SELECT COUNT(*) as count
			FROM play_history
			WHERE "userId" = ${userId}
				AND "playedAt" >= ${previousMonth.start}
				AND "playedAt" <= ${previousMonth.end}
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
	};
};
