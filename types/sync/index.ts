export type SyncStats = {
	tracksProcessed: number;
	tracksCreated: number;
	artistsCreated: number;
	artistsUpdated: number;
	playHistoryCreated: number;
};

export type SyncResult = {
	success: boolean;
	stats: SyncStats;
	error?: string;
};
