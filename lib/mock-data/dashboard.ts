import { format, startOfDay, subDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import type {
	DashboardInsightsResponse,
	DashboardListeningResponse,
	DashboardMoodResponse,
	DashboardOverviewResponse,
	DashboardRecentResponse,
} from '@/types/dashboard';

const MOCK_TRACKS = [
	{
		id: 'track-1',
		name: 'Blinding Lights',
		imageUrl:
			'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
		href: '#',
		artists: [{ id: 'artist-1', name: 'The Weeknd', href: '#' }],
	},
	{
		id: 'track-2',
		name: 'As It Was',
		imageUrl:
			'https://i.scdn.co/image/ab67616d00001e02b46f74097655d7f353caab14',
		href: '#',
		artists: [{ id: 'artist-2', name: 'Harry Styles', href: '#' }],
	},
	{
		id: 'track-3',
		name: 'Levitating',
		imageUrl:
			'https://i.scdn.co/image/ab67616d00001e024bc66095f8a70bc4e6593f4f',
		href: '#',
		artists: [{ id: 'artist-3', name: 'Dua Lipa', href: '#' }],
	},
	{
		id: 'track-4',
		name: 'vampire',
		imageUrl:
			'https://i.scdn.co/image/ab67616d0000b273e85259a1cae29a8d91f2093d',
		href: '#',
		artists: [{ id: 'artist-4', name: 'Olivia Rodrigo', href: '#' }],
	},
	{
		id: 'track-5',
		name: 'Stay',
		imageUrl:
			'https://i.scdn.co/image/ab67616d0000b273aed1660585c1e3c9ffb50b6a',
		href: '#',
		artists: [
			{ id: 'artist-5', name: 'The Kid LAROI', href: '#' },
			{ id: 'artist-6', name: 'Justin Bieber', href: '#' },
		],
	},
	{
		id: 'track-6',
		name: 'Heat Waves',
		imageUrl:
			'https://i.scdn.co/image/ab67616d0000b2739e495fb707973f3390850eea',
		href: '#',
		artists: [{ id: 'artist-7', name: 'Glass Animals', href: '#' }],
	},
	{
		id: 'track-7',
		name: 'Bad Habits',
		imageUrl:
			'https://i.scdn.co/image/ab67616d00001e02ef24c3fdbf856340d55cfeb2',
		href: '#',
		artists: [{ id: 'artist-8', name: 'Ed Sheeran', href: '#' }],
	},
	{
		id: 'track-8',
		name: 'Flowers',
		imageUrl:
			'https://i.scdn.co/image/ab67616d00001e02f429549123dbe8552764ba1d',
		href: '#',
		artists: [{ id: 'artist-9', name: 'Miley Cyrus', href: '#' }],
	},
	{
		id: 'track-9',
		name: 'Cruel Summer',
		imageUrl:
			'https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647',
		href: '#',
		artists: [{ id: 'artist-10', name: 'Taylor Swift', href: '#' }],
	},
	{
		id: 'track-10',
		name: 'Starboy',
		imageUrl:
			'https://i.scdn.co/image/ab67616d00001e024718e2b124f79258be7bc452',
		href: '#',
		artists: [{ id: 'artist-1', name: 'The Weeknd', href: '#' }],
	},
];

const MOCK_ARTISTS = [
	{
		id: 'artist-1',
		name: 'The Weeknd',
		imageUrl:
			'https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb',
		href: '#',
	},
	{
		id: 'artist-2',
		name: 'Harry Styles',
		imageUrl:
			'https://image-cdn-ak.spotifycdn.com/image/ab6761610000f178e309f8c3056a59f20d0968ca',
		href: '#',
	},
	{
		id: 'artist-3',
		name: 'Dua Lipa',
		imageUrl:
			'https://i.scdn.co/image/ab6761610000e5ebc36dd9eb55fb0db4911f25dd',
		href: '#',
	},
	{
		id: 'artist-4',
		name: 'Olivia Rodrigo',
		imageUrl:
			'https://i.scdn.co/image/ab6761610000e5eb9e3acf1eaf3b8846e836f441',
		href: '#',
	},
	{
		id: 'artist-5',
		name: 'The Kid LAROI',
		imageUrl:
			'https://i.scdn.co/image/ab67616d00001e022a182fb516812ea67edde2b8',
		href: '#',
	},
	{
		id: 'artist-6',
		name: 'Justin Bieber',
		imageUrl:
			'https://i.scdn.co/image/ab67616100005174af20f7db5288bce9beede034',
		href: '#',
	},
	{
		id: 'artist-7',
		name: 'Glass Animals',
		imageUrl:
			'https://i.scdn.co/image/ab6761610000101feb2cc96b0ed023c5e3675b6f',
		href: '#',
	},
	{
		id: 'artist-8',
		name: 'Ed Sheeran',
		imageUrl:
			'https://i.scdn.co/image/ab6761610000e5eb12a2ef08d00dd7451a6dbed6',
		href: '#',
	},
	{
		id: 'artist-9',
		name: 'Miley Cyrus',
		imageUrl:
			'https://i.scdn.co/image/ab67616d00001e020ae6f06706ab3a955844e9a0',
		href: '#',
	},
];

const random = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

const randomFloat = (min: number, max: number) =>
	Math.random() * (max - min) + min;

export const generateMockOverview = (
	period: 'day' | 'week' | 'month',
	limit: 10 | 25,
	timezone: string = 'UTC'
): DashboardOverviewResponse => {
	const nowInTZ = toZonedTime(new Date(), timezone);
	const todayStartInTZ = startOfDay(nowInTZ);

	const weeklyActivity = [];
	for (let i = 6; i >= 0; i--) {
		const dayInTZ = subDays(todayStartInTZ, i);
		const dateStr = format(dayInTZ, 'yyyy-MM-dd');
		weeklyActivity.push({
			date: dateStr,
			plays: random(20, 150),
		});
	}

	// 👇 Сортування Топ Треків (від найбільшого до найменшого)
	const topTracks = MOCK_TRACKS.slice(0, limit)
		.map((track) => ({
			...track,
			playCount: random(50, 500), // Генеруємо випадкове число
		}))
		.sort((a, b) => b.playCount - a.playCount); // Сортуємо спаданням

	// 👇 Сортування Топ Артистів (від найбільшого до найменшого)
	const topArtists = MOCK_ARTISTS.slice(0, limit)
		.map((artist) => ({
			...artist,
			playCount: random(100, 800), // Генеруємо випадкове число
		}))
		.sort((a, b) => b.playCount - a.playCount); // Сортуємо спаданням

	const periodMultiplier = period === 'day' ? 1 : period === 'week' ? 7 : 30;
	const totalPlays = random(100 * periodMultiplier, 500 * periodMultiplier);
	const totalHours = Math.floor((totalPlays * 3.5) / 60);

	return {
		summary: {
			totalPlays,
			uniqueTracks: random(50, 200),
			uniqueArtists: random(20, 80),
			totalHours,
		},
		topTracks,
		topArtists,
		weeklyActivity,
	};
};

export const generateMockListening = (
	year: string | undefined,
	timezone: string = 'UTC'
): DashboardListeningResponse => {
	const hourlyActivity = Array.from({ length: 24 }, (_, hour) => ({
		hour,
		count: hour >= 8 && hour <= 22 ? random(5, 50) : random(0, 10),
	}));

	const yearCalendar: Array<{ date: string; count: number }> = [];
	const nowInTZ = toZonedTime(new Date(), timezone);
	const startDate = year
		? new Date(parseInt(year, 10), 0, 1)
		: subDays(startOfDay(nowInTZ), 365);
	const endDate = year
		? new Date(parseInt(year, 10), 11, 31)
		: startOfDay(nowInTZ);

	let currentDate = new Date(startDate);
	while (currentDate <= endDate) {
		const dateStr = format(currentDate, 'yyyy-MM-dd');
		const dayOfWeek = currentDate.getDay();
		const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
		yearCalendar.push({
			date: dateStr,
			count: isWeekend ? random(10, 80) : random(5, 60),
		});
		currentDate = new Date(currentDate);
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return {
		hourlyActivity,
		yearCalendar,
	};
};

export const generateMockMood = (): DashboardMoodResponse => {
	const averageFeatures = {
		avgAcousticness: randomFloat(0.1, 0.6),
		avgDanceability: randomFloat(0.5, 0.9),
		avgEnergy: randomFloat(0.4, 0.8),
		avgInstrumentalness: randomFloat(0.0, 0.3),
		avgLiveness: randomFloat(0.1, 0.4),
		avgLoudness: randomFloat(-12, -6),
		avgSpeechiness: randomFloat(0.05, 0.3),
		avgTempo: randomFloat(100, 140),
		avgValence: randomFloat(0.4, 0.8),
		tracksWithFeatures: random(100, 500),
		totalTracks: random(150, 600),
	};

	const keyNames = [
		'C',
		'C♯/D♭',
		'D',
		'D♯/E♭',
		'E',
		'F',
		'F♯/G♭',
		'G',
		'G♯/A♭',
		'A',
		'A♯/B♭',
		'B',
	];
	const keyDistribution = keyNames.map((key) => ({
		key,
		count: random(5, 50),
	}));

	const modeDistribution = {
		major: random(100, 300),
		minor: random(80, 250),
	};

	const scatterData = MOCK_TRACKS.slice(0, 20).map((track) => ({
		trackId: track.id,
		trackName: track.name,
		valence: randomFloat(0.2, 0.9),
		energy: randomFloat(0.3, 0.95),
		playCount: random(10, 100),
	}));

	const tempoDistribution = [
		{ range: 'slow', count: random(20, 80) },
		{ range: 'moderate', count: random(50, 150) },
		{ range: 'fast', count: random(40, 120) },
		{ range: 'very_fast', count: random(10, 50) },
	];

	return {
		averageFeatures,
		keyDistribution,
		modeDistribution,
		scatterData,
		tempoDistribution,
	};
};

export const generateMockInsights = (
	monthsAgo: number,
	timezone: string = 'UTC'
): DashboardInsightsResponse => {
	const nowInTZ = toZonedTime(new Date(), timezone);
	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];
	const targetMonth = new Date(nowInTZ);
	targetMonth.setMonth(targetMonth.getMonth() - monthsAgo);
	const period =
		monthsAgo === 0
			? 'This Month'
			: `${monthNames[targetMonth.getMonth()]} ${targetMonth.getFullYear()}`;

	const totalHours = {
		hours: random(20, 120),
		minutes: random(0, 59),
	};

	const days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];
	const mostActiveDay = {
		day: days[random(0, 6)],
		count: random(50, 200),
	};

	const peakHour = random(14, 22);
	const peakHourData = {
		hour: peakHour,
		range: `${String(peakHour).padStart(2, '0')}:00-${String(peakHour + 1).padStart(2, '0')}:00`,
		count: random(30, 100),
	};

	const musicalMood = {
		energy: randomFloat(0.5, 0.85),
		valence: randomFloat(0.5, 0.8),
	};

	const streak = {
		longestStreak: random(5, 30),
		currentStreak: random(1, 15),
	};

	const current = random(200, 500);
	const previous = random(150, 450);
	const percentChange = Math.round(((current - previous) / previous) * 100);
	const comparison = {
		current,
		previous,
		percentChange,
		isIncrease: percentChange > 0,
	};

	return {
		period,
		totalHours,
		mostActiveDay,
		peakHour: peakHourData,
		musicalMood,
		streak,
		comparison,
	};
};

export const generateMockRecent = (
	limit: number,
	offset: number,
	search?: string
): DashboardRecentResponse => {
	let filteredTracks = MOCK_TRACKS;
	if (search) {
		const searchLower = search.toLowerCase();
		filteredTracks = MOCK_TRACKS.filter(
			(track) =>
				track.name.toLowerCase().includes(searchLower) ||
				track.artists.some((artist) =>
					artist.name.toLowerCase().includes(searchLower)
				)
		);
	}

	const now = new Date();
	const tracks = Array.from({ length: Math.min(limit, 50) }, (_, index) => {
		const trackIndex = (offset + index) % filteredTracks.length;
		const track = filteredTracks[trackIndex] || MOCK_TRACKS[0];
		const playedAt = new Date(now);
		playedAt.setMinutes(playedAt.getMinutes() - index * 5 - offset * 5);

		return {
			id: `play-${offset + index}`,
			playedAt: playedAt.toISOString(),
			track: {
				...track,
				durationMs: random(180000, 240000),
			},
		};
	});

	const total = search ? filteredTracks.length * 10 : 500;
	const hasMore = offset + tracks.length < total;

	return {
		tracks,
		total,
		hasMore,
	};
};
