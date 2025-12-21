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
		artists: Array<{ id: string; name: string }>;
		playCount: number;
	}>;
	topArtists: Array<{
		id: string;
		name: string;
		imageUrl: string | null;
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
