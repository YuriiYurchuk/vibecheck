import { addDays, endOfDay, format, startOfDay, subDays } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { prisma } from '@/lib/db';

export const getCalendar = async (
	userId: string,
	timezone: string,
	year?: number
) => {
	let startDateUTC: Date;
	let endDateUTC: Date;

	if (year) {
		const yearStartInTZ = new Date(year, 0, 1, 0, 0, 0);
		const yearEndInTZ = new Date(year, 11, 31, 23, 59, 59, 999);

		startDateUTC = fromZonedTime(yearStartInTZ, timezone);
		endDateUTC = fromZonedTime(yearEndInTZ, timezone);
	} else {
		const nowInTZ = toZonedTime(new Date(), timezone);
		const todayEndInTZ = endOfDay(nowInTZ);
		const start366InTZ = startOfDay(subDays(nowInTZ, 366));

		startDateUTC = fromZonedTime(start366InTZ, timezone);
		endDateUTC = fromZonedTime(todayEndInTZ, timezone);
	}

	const result = await prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
		SELECT 
			TO_CHAR("playedAt" AT TIME ZONE ${timezone}, 'YYYY-MM-DD') as date,
			COUNT(*)::int as count
		FROM play_history
		WHERE "userId" = ${userId}
			AND "playedAt" >= ${startDateUTC}
			AND "playedAt" <= ${endDateUTC}
		GROUP BY date
		ORDER BY date ASC
	`;

	const dataMap = new Map(result.map((r) => [r.date, Number(r.count)]));

	const calendar: Array<{ date: string; count: number }> = [];
	let startDateForCalendar: Date;
	let endDateForCalendar: Date;

	if (year) {
		startDateForCalendar = new Date(year, 0, 1);
		endDateForCalendar = new Date(year, 11, 31);
	} else {
		const nowInTZ = toZonedTime(new Date(), timezone);
		endDateForCalendar = startOfDay(nowInTZ);
		startDateForCalendar = subDays(endDateForCalendar, 365);
	}

	let currentDate = startDateForCalendar;
	while (currentDate <= endDateForCalendar) {
		const dateStr = format(currentDate, 'yyyy-MM-dd');
		calendar.push({
			date: dateStr,
			count: dataMap.get(dateStr) || 0,
		});
		currentDate = addDays(currentDate, 1);
	}

	return calendar;
};

export const getTodayHourlyActivity = async (
	userId: string,
	timezone: string
) => {
	const nowInTZ = toZonedTime(new Date(), timezone);
	const dayStartInTZ = startOfDay(nowInTZ);
	const dayEndInTZ = endOfDay(nowInTZ);

	const dayStartUTC = fromZonedTime(dayStartInTZ, timezone);
	const dayEndUTC = fromZonedTime(dayEndInTZ, timezone);

	const result = await prisma.$queryRaw<
		Array<{
			hour: number;
			count: bigint;
		}>
	>`
		SELECT 
			EXTRACT(HOUR FROM ("playedAt" AT TIME ZONE ${timezone}))::int as hour,
			COUNT(*)::int as count
		FROM play_history
		WHERE "userId" = ${userId}
			AND "playedAt" >= ${dayStartUTC}
			AND "playedAt" <= ${dayEndUTC}
		GROUP BY hour
		ORDER BY hour ASC
	`;

	const hoursMap = new Map(result.map((r) => [r.hour, Number(r.count)]));
	const fullDay: Array<{ hour: number; count: number }> = [];

	for (let i = 0; i < 24; i++) {
		fullDay.push({
			hour: i,
			count: hoursMap.get(i) || 0,
		});
	}

	return fullDay;
};
