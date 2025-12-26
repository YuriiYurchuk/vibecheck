import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { getDateSince, validatePeriod } from '@/lib/helpers';
import {
	getAverageAudioFeatures,
	getKeyDistribution,
	getModeDistribution,
	getTempoDistribution,
	getValenceEnergyScatter,
} from '@/lib/services';

export const GET = async (req: Request) => {
	try {
		const session = await requireSession();
		const userId = session?.user.id;
		const timezone = session.user.timezone || 'UTC';

		const { searchParams } = new URL(req.url);
		const period = validatePeriod(searchParams.get('period'));
		const since = getDateSince(period, timezone);

		const [
			averageFeatures,
			keyDistribution,
			modeDistribution,
			scatterData,
			tempoDistribution,
		] = await Promise.all([
			getAverageAudioFeatures(userId, since),
			getKeyDistribution(userId, since),
			getModeDistribution(userId, since),
			getValenceEnergyScatter(userId, since),
			getTempoDistribution(userId, since),
		]);

		return NextResponse.json({
			averageFeatures,
			keyDistribution,
			modeDistribution,
			scatterData,
			tempoDistribution,
		});
	} catch (err) {
		if (err instanceof Error && err.message === 'Unauthorized') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Failed to fetch mood data:', err);
		return NextResponse.json(
			{ error: 'Failed to fetch mood data' },
			{ status: 500 }
		);
	}
};
