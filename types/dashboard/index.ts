export type DashboardOverviewResponse = {
	summary: {
		totalPlays: number;
		uniqueTracks: number;
		uniqueArtists: number;
		totalHours: number;
	};
	topTracks: Array<{
		id: string;
		name: string;
		imageUrl: string | null;
		href: string | null;
		artists: Array<{ id: string; name: string; href: string | null }>;
		playCount: number;
	}>;
	topArtists: Array<{
		id: string;
		name: string;
		imageUrl: string | null;
		href: string | null;
		playCount: number;
	}>;
	weeklyActivity: Array<{
		date: string;
		plays: number;
	}>;
};

export type DashboardListeningResponse = {
	hourlyActivity: Array<{
		hour: number;
		count: number;
	}>;
	yearCalendar: Array<{
		date: string;
		count: number;
	}>;
};

export type DashboardMoodResponse = {
	averageFeatures: {
		acousticness: number | null;
		danceability: number | null;
		energy: number | null;
		instrumentalness: number | null;
		liveness: number | null;
		loudness: number | null;
		speechiness: number | null;
		tempo: number | null;
		valence: number | null;
		tracksWithFeatures: number;
		totalTracks: number;
	};
	keyDistribution: Array<{
		key: string;
		count: number;
	}>;
	modeDistribution: {
		major: number;
		minor: number;
	};
	scatterData: Array<{
		trackId: string;
		trackName: string;
		valence: number;
		energy: number;
		playCount: number;
	}>;
	tempoDistribution: Array<{
		range: string;
		count: number;
	}>;
};

export type DashboardRecentResponse = {
	tracks: Array<{
		id: string;
		playedAt: string;
		track: {
			id: string;
			name: string;
			imageUrl: string | null;
			href: string | null;
			durationMs: number;
			artists: Array<{
				id: string;
				name: string;
				href: string | null;
			}>;
		};
	}>;
	total: number;
	hasMore: boolean;
};

export type DashboardInsightsResponse = {
	period: string;
	totalHours: {
		hours: number;
		minutes: number;
	};
	mostActiveDay: {
		day: string;
		count: number;
	};
	peakHour: {
		hour: number;
		range: string;
		count: number;
	};
	musicalMood: {
		energy: number;
		valence: number;
	};
	streak: {
		longestStreak: number;
		currentStreak: number;
	};
	comparison: {
		current: number;
		previous: number;
		percentChange: number;
		isIncrease: boolean;
	};
};

export type Period = 'day' | 'week' | 'month';
export type Limit = 10 | 25;
