import {
	differenceInDays,
	differenceInHours,
	differenceInMinutes,
	format,
} from 'date-fns';
import { enUS, type Locale, uk } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback } from 'react';

const localeMap: Record<string, Locale> = {
	en: enUS,
	uk: uk,
};

export const useDateFormatter = (timezone?: string) => {
	const tTime = useTranslations('common.time');
	const locale = useLocale();
	const currentLocale = localeMap[locale] || enUS;
	const activeTimezone =
		timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

	const formatDate = useCallback(
		(date: string | number | Date, formatStr: string) => {
			try {
				const zonedDate = toZonedTime(date, activeTimezone);
				return format(zonedDate, formatStr, { locale: currentLocale });
			} catch (err) {
				console.error('Error formatting date:', err);
				return String(date);
			}
		},
		[activeTimezone, currentLocale]
	);

	const formatRelative = useCallback(
		(date: string | number | Date) => {
			try {
				const zonedDate = toZonedTime(date, activeTimezone);
				const now = new Date();

				const mins = differenceInMinutes(now, zonedDate);
				const hours = differenceInHours(now, zonedDate);
				const days = differenceInDays(now, zonedDate);

				if (mins < 1) return tTime('now');
				if (mins < 60) return tTime('minutesAgo', { count: mins });
				if (hours < 24) return tTime('hoursAgo', { count: hours });
				if (days < 7) return tTime('daysAgo', { count: days });

				return format(zonedDate, 'PP', { locale: currentLocale });
			} catch (err) {
				console.error('Error formatting relative date:', err);
				return String(date);
			}
		},
		[activeTimezone, currentLocale, tTime]
	);

	return { formatDate, formatRelative };
};
