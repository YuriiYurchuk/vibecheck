import { getHours } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { OverviewDemo } from '@/components/dashboard/demo';

type GreetingKey = 'morning' | 'afternoon' | 'evening' | 'default';

const getGreetingByTimezone = (timezone: string): GreetingKey => {
	try {
		const now = new Date();
		const zonedDate = toZonedTime(now, timezone);
		const hour = getHours(zonedDate);

		if (hour >= 5 && hour < 12) return 'morning';
		if (hour >= 12 && hour < 18) return 'afternoon';
		return 'evening';
	} catch {
		return 'default';
	}
};

export default function DemoDashboardPage() {
	const timezone = 'UTC';
	const greetingKey = getGreetingByTimezone(timezone);

	return <OverviewDemo greetingKey={greetingKey} userName="Demo User" />;
}
