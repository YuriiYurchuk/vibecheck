import { prisma } from '@/lib/db';
import { getTodayInUserTz } from '../helpers/date';

export const getCalendar = async (
	userId: string,
	timezone: string,
	year?: number
) => {
	let result: Array<{ date: string; count: bigint }>;

	if (year) {
		result = await prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
      SELECT 
        TO_CHAR("playedAt" AT TIME ZONE ${timezone}, 'YYYY-MM-DD') as date,
        COUNT(*)::int as count
      FROM play_history
      WHERE "userId" = ${userId}
        AND EXTRACT(YEAR FROM "playedAt" AT TIME ZONE ${timezone})::int = ${year}
      GROUP BY date
      ORDER BY date ASC
    `;
	} else {
		const startDateBuffer = new Date();
		startDateBuffer.setDate(startDateBuffer.getDate() - 366);

		result = await prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
      SELECT 
        TO_CHAR("playedAt" AT TIME ZONE ${timezone}, 'YYYY-MM-DD') as date,
        COUNT(*)::int as count
      FROM play_history
      WHERE "userId" = ${userId}
        AND "playedAt" >= ${startDateBuffer}
      GROUP BY date
      ORDER BY date ASC
    `;
	}

	const dataMap = new Map(result.map((r) => [r.date, Number(r.count)]));
	const calendar: Array<{ date: string; count: number }> = [];
	let startDate: Date;
	let endDate: Date;

	if (year) {
		startDate = new Date(`${year}-01-01`);
		endDate = new Date(`${year}-12-31`);
	} else {
		const todayStr = getTodayInUserTz(timezone);

		endDate = new Date(todayStr);

		startDate = new Date(endDate);
		startDate.setDate(startDate.getDate() - 365);
	}

	const current = new Date(startDate);

	while (current <= endDate) {
		const dateStr = current.toISOString().split('T')[0];
		calendar.push({
			date: dateStr,
			count: dataMap.get(dateStr) || 0,
		});
		current.setDate(current.getDate() + 1);
	}

	return calendar;
};

export const getTodayHourlyActivity = async (
	userId: string,
	timezone: string
) => {
	const result = await prisma.$queryRaw<
		Array<{
			hour: number;
			count: bigint;
		}>
	>`
    SELECT 
      EXTRACT(HOUR FROM "playedAt" AT TIME ZONE ${timezone})::int as hour,
      COUNT(*)::int as count
    FROM play_history
    WHERE "userId" = ${userId}
      AND ("playedAt" AT TIME ZONE ${timezone})::date = (now() AT TIME ZONE ${timezone})::date
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
