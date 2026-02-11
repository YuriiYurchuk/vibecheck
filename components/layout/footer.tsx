import { Github } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const LandingFooter = () => {
	const t = useTranslations('landing.footer');
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t border-border/40 bg-background/95 backdrop-blur-sm">
			<div className="container mx-auto px-4 py-8 max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4">
				<div className="text-sm text-muted-foreground">
					{/* Використовуємо rich text formatting для "bold" імені */}
					{t.rich('copyright', {
						year: currentYear,
						name: (chunks) => (
							<span className="text-foreground font-medium">{chunks}</span>
						),
					})}
				</div>

				<div className="flex items-center gap-6">
					<a
						href="https://github.com/YuriiYurchuk/vibecheck"
						target="_blank"
						rel="noreferrer"
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						<Github className="size-5" />
						<span className="sr-only">GitHub</span>
					</a>
				</div>
			</div>
		</footer>
	);
};
