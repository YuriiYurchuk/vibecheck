import { Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type StreakCardProps = {
	current: number;
	longest: number;
	labels: {
		title: string;
		longest: string;
		current: string;
		days: string;
		keepItUp: string;
	};
};

export const StreakCard = ({ current, longest, labels }: StreakCardProps) => {
	return (
		<Card>
			<CardContent>
				<div className="flex items-center gap-2 mb-6">
					<p className="text-sm font-medium text-muted-foreground">
						{labels.title}
					</p>
					<Flame className="size-4 text-orange-500 fill-orange-500 animate-pulse" />
				</div>
				<div className="flex-1 grid grid-cols-2 gap-8 items-end">
					<div className="text-center space-y-1">
						<p className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
							{longest}
						</p>
						<div className="flex flex-col items-center">
							<p className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wide">
								{labels.longest}
							</p>
							<p className="text-[10px] text-muted-foreground/60">
								{labels.days}
							</p>
						</div>
					</div>
					<div className="text-center space-y-1 relative">
						<p className="text-4xl md:text-5xl font-bold tracking-tight text-orange-500">
							{current}
						</p>
						<div className="flex flex-col items-center">
							<p className="text-xs md:text-sm font-medium text-foreground uppercase tracking-wide">
								{labels.current}
							</p>
							{current > 0 && (
								<div className="flex items-center gap-1 text-[10px] text-orange-500 font-bold mt-0.5">
									{labels.keepItUp} <Flame className="size-3 fill-orange-500" />
								</div>
							)}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
