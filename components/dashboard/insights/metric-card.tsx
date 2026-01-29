import { Card, CardContent } from '@/components/ui/card';

type MetricCardProps = {
	label: string;
	value: string;
	subtext: string | number;
};

export const MetricCard = ({ label, value, subtext }: MetricCardProps) => {
	return (
		<Card>
			<CardContent className="flex flex-col justify-center space-y-2">
				<p className="text-sm font-medium text-muted-foreground">{label}</p>
				<p className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
					{value}
				</p>
				<p className="text-sm text-muted-foreground font-medium">{subtext}</p>
			</CardContent>
		</Card>
	);
};
