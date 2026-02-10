import { BarChart2, LogIn, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/ui/fade-in';

export const LandingHowItWorks = () => {
	const tWorks = useTranslations('landing.howItWorks');

	const steps = [
		{
			icon: <LogIn className="size-6 text-primary" />,
			title: tWorks('step1.title'),
			description: tWorks('step1.desc'),
		},
		{
			icon: <BarChart2 className="size-6 text-blue-500" />,
			title: tWorks('step2.title'),
			description: tWorks('step2.desc'),
		},
		{
			icon: <Sparkles className="size-6 text-yellow-500" />,
			title: tWorks('step3.title'),
			description: tWorks('step3.desc'),
		},
	];

	return (
		<section className="py-24 sm:py-32 relative">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
				<div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
					<FadeIn>
						<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
							{tWorks('title')}
						</h2>
						<p className="text-muted-foreground text-lg sm:text-xl">
							{tWorks('subtitle')}
						</p>
					</FadeIn>
				</div>
				<div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
					<div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-linear-to-r from-border via-primary/50 to-border -z-10" />
					{steps.map((step, index) => (
						<FadeIn
							key={index}
							delay={200 + index * 100}
							className="relative flex flex-col items-center"
						>
							<div className="flex items-center justify-center size-24 rounded-full bg-background border border-border shadow-lg mb-6 group transition-transform hover:scale-110 duration-300">
								<div className="size-12 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
									{step.icon}
								</div>
							</div>
							<h3 className="text-xl font-bold mb-3">{step.title}</h3>
							<p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
								{step.description}
							</p>
						</FadeIn>
					))}
				</div>
			</div>
		</section>
	);
};
