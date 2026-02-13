import { Github, LayoutDashboard, Zap } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { AuthButton } from '@/components/landing/auth-button';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/fade-in';

export const LandingHero = () => {
	const t = useTranslations('landing.hero');
	const GITHUB_REPO_URL = 'https://github.com/yurchuk-yurii/vibecheck';

	const hideLogin = process.env.NEXT_PUBLIC_HIDE_LOGIN === 'true';

	return (
		<section className="relative pt-20 pb-24 sm:pt-28 sm:pb-32 md:pt-36 md:pb-40 lg:pt-40 lg:pb-48 overflow-hidden">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
				<div className="flex flex-col items-center text-center">
					<FadeIn
						className="group inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-primary backdrop-blur-sm mb-6 sm:mb-8 transition-colors hover:bg-primary/10 cursor-default"
						delay={100}
					>
						<Zap className="mr-1.5 sm:mr-2 size-3 sm:size-3.5 fill-current shrink-0" />
						<span className="whitespace-nowrap">{t('badge')}</span>
					</FadeIn>
					<FadeIn delay={200} className="w-full">
						<h1 className="max-w-[90%] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto font-extrabold tracking-tight text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 sm:mb-8 leading-[1.1] sm:leading-[1.1] drop-shadow-[0_0_25px_rgba(168,85,247,0.2)]">
							<span className="block sm:hidden">
								{t('title.start')}
								<span className="bg-linear-to-r from-primary via-primary/70 to-chart-3 bg-clip-text text-transparent inline-block">
									{t('title.highlight')}
								</span>
								{t('title.end')}
							</span>
							<span className="hidden sm:block">
								{t('title.start')} <br className="hidden md:block" />
								<span className="bg-linear-to-r from-primary via-primary/70 to-chart-3 bg-clip-text text-transparent inline-block px-1 sm:px-2 pb-1 sm:pb-2">
									{t('title.highlight')}
								</span>
								<br className="md:hidden" /> {t('title.end')}
							</span>
						</h1>
					</FadeIn>
					<FadeIn delay={300} className="w-full px-4 sm:px-6 md:px-8 lg:px-0">
						<p className="max-w-xl sm:max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed sm:leading-relaxed mb-8 sm:mb-10 text-balance">
							{t('description')}
						</p>
					</FadeIn>
					<FadeIn delay={400} className="w-full px-4 sm:px-0">
						<div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 justify-center max-w-md sm:max-w-3xl mx-auto">
							{!hideLogin && (
								<AuthButton
									size="lg"
									variant="default"
									className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-bold rounded-full shadow-md transition-all hover:scale-105 active:scale-95 sm:min-w-40"
								/>
							)}
							<Button
								asChild
								variant={hideLogin ? 'default' : 'secondary'}
								size="lg"
								className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-bold rounded-full shadow-md transition-all hover:scale-105 active:scale-95 sm:min-w-40"
							>
								<Link href="/demo">
									<LayoutDashboard className="mr-2 size-4 shrink-0" />
									{t('demoButton')}
								</Link>
							</Button>
							<Button
								asChild
								variant="outline"
								size="lg"
								className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-medium rounded-full gap-2 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-accent/10 hover:text-accent-foreground transition-all sm:min-w-40"
							>
								<a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer">
									<Github className="size-4 shrink-0" />
									<span className="whitespace-nowrap">{t('githubButton')}</span>
								</a>
							</Button>
						</div>
					</FadeIn>
				</div>
			</div>
		</section>
	);
};
