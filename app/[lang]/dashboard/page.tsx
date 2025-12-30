import { getHours } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { cookies } from 'next/headers';
import { Overview } from '@/components/dashboard/overview';

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

export default async function DashboardPage() {
	const cookieStore = await cookies();
	const timezone = cookieStore.get('user-timezone')?.value || 'UTC';
	const greetingKey = getGreetingByTimezone(timezone);

	return <Overview greetingKey={greetingKey} />;
}
