import { Activity, BarChart3, History, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // 👇 Імпортуємо картки
import { FadeIn } from '@/components/ui/fade-in';

export const LandingFeatures = () => {
	const tFeatures = useTranslations('landing.features');

	const features = [
		{
			icon: <BarChart3 className="size-6 text-primary" />,
			title: tFeatures('analytics.title'),
			description: tFeatures('analytics.desc'),
			className: 'md:col-span-2',
		},
		{
			icon: <Activity className="size-6 text-blue-500" />,
			title: tFeatures('audio.title'),
			description: tFeatures('audio.desc'),
			className: 'md:col-span-1',
		},
		{
			icon: <Zap className="size-6 text-yellow-500" />,
			title: tFeatures('mood.title'),
			description: tFeatures('mood.desc'),
			className: 'md:col-span-1',
		},
		{
			icon: <History className="size-6 text-orange-500" />,
			title: tFeatures('history.title'),
			description: tFeatures('history.desc'),
			className: 'md:col-span-2',
		},
	];

	return (
		<section className="py-24 sm:py-32 relative overflow-hidden">
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-primary/5 blur-[120px] rounded-full -z-10" />
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
				<div className="text-center max-w-2xl mx-auto mb-16">
					<FadeIn delay={100}>
						<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
							{tFeatures('title')}
						</h2>
					</FadeIn>
					<FadeIn delay={200}>
						<p className="text-muted-foreground text-lg sm:text-xl">
							{tFeatures('subtitle')}
						</p>
					</FadeIn>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{features.map((feature, index) => (
						<FadeIn
							key={index}
							delay={300 + index * 100}
							className={feature.className}
						>
							<Card className="h-full group relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-muted/50 hover:border-primary/20">
								<div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
								<CardHeader>
									<div className="mb-2 inline-flex items-center justify-center size-12 rounded-xl bg-background border border-border shadow-sm group-hover:scale-110 transition-transform duration-300">
										{feature.icon}
									</div>
									<CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
										{feature.title}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground leading-relaxed">
										{feature.description}
									</p>
								</CardContent>
							</Card>
						</FadeIn>
					))}
				</div>
			</div>
		</section>
	);
};
