import { Card, CardContent } from '@/components/ui/card';

const MOOD_EMOJIS = {
	energetic: '🤩',
	chill: '😌',
	intense: '😤',
	melancholic: '😔',
	balanced: '😐',
	noData: '😴',
} as const;

type MoodType = keyof typeof MOOD_EMOJIS;

type MoodCardProps = {
	title: string;
	energy: number;
	valence: number;
	labels: {
		energy: string;
		positivity: string;
		moods: Record<MoodType, string>;
	};
};

export const MoodCard = ({ title, energy, valence, labels }: MoodCardProps) => {
	const energyPct = Math.round(energy * 100);
	const valencePct = Math.round(valence * 100);
	const hasData = energy > 0 || valence > 0;

	const getMoodKey = (): MoodType => {
		if (!hasData) return 'noData';

		if (energy > 0.6) {
			return valence > 0.5 ? 'energetic' : 'intense';
		}

		if (energy <= 0.4) {
			return valence > 0.5 ? 'chill' : 'melancholic';
		}
		return 'balanced';
	};

	const currentKey = getMoodKey();

	return (
		<Card className="h-full">
			<CardContent>
				<p className="text-sm font-medium text-muted-foreground mb-4">
					{title}
				</p>
				<div className="flex-1 flex flex-col justify-center">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
						<div className="flex items-center gap-3">
							<div className="text-3xl md:text-4xl animate-in zoom-in duration-300 select-none leading-none">
								{MOOD_EMOJIS[currentKey]}
							</div>
							<div>
								<h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
									{labels.moods[currentKey]}
								</h3>
							</div>
						</div>
						{hasData && (
							<div className="flex items-center gap-6 md:gap-10 opacity-90">
								<div className="flex flex-col md:items-end">
									<p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
										{labels.energy}
									</p>
									<p className="text-xl md:text-2xl font-bold tabular-nums">
										{energyPct}%
									</p>
								</div>
								<div className="flex flex-col md:items-end">
									<p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
										{labels.positivity}
									</p>
									<p className="text-xl md:text-2xl font-bold tabular-nums">
										{valencePct}%
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
