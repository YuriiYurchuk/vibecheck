import { LandingFeatures } from '@/components/landing/features';
import { LandingHero } from '@/components/landing/hero';
import { LandingHowItWorks } from '@/components/landing/how-it-works';
import { LandingFooter } from '@/components/layout/footer';
import { LandingHeader } from '@/components/layout/header';

export default function LandingPage() {
	return (
		<div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
			<LandingHeader />
			<main className="flex-1">
				<LandingHero />
				<LandingFeatures />
				<LandingHowItWorks />
			</main>
			<LandingFooter />
		</div>
	);
}
