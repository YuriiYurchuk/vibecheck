type SpotifyImage = { url: string };
type SpotifyUrl = { spotify: string };

export type SpotifyHistoryResponse = {
	items: Array<{
		track: {
			id: string;
			name: string;
			duration_ms: number;
			external_urls: SpotifyUrl;
			album: {
				images: SpotifyImage[];
			};
			artists: Array<{
				id: string;
				name: string;
				external_urls: SpotifyUrl;
			}>;
		};
		played_at: string;
	}>;
	next: string | null;
	cursors?: { after: string };
};

export type SpotifyArtistsResponse = {
	artists: Array<{
		id: string;
		name: string;
		images: SpotifyImage[];
		external_urls: SpotifyUrl;
	}>;
};

export type ArtistBasicInfo = {
	id: string;
	name: string;
	imageUrl: string | null;
	href: string;
};
