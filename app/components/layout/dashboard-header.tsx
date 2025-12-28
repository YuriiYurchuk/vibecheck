'use client';

import { Globe, Moon, Sun } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from '@/i18n/navigation';

const routeGradients: Record<string, string> = {
	'/dashboard': 'from-chart-3 to-chart-2',
	'/dashboard/listening': 'from-chart-2 to-chart-1',
	'/dashboard/mood': 'from-chart-1 to-chart-5',
	'/dashboard/insights': 'from-chart-5 to-chart-4',
	'/dashboard/recent': 'from-chart-4 to-chart-3',
	'/settings': 'from-primary to-accent',
	'/profile': 'from-accent to-primary',
};

const routeKeys: Record<string, string> = {
	'/dashboard': 'overview',
	'/dashboard/listening': 'listeningHistory',
	'/dashboard/mood': 'moodAnalysis',
	'/dashboard/insights': 'insights',
	'/dashboard/recent': 'recentPlays',
	'/settings': 'settings',
	'/profile': 'profile',
};

export const DashboardHeader = () => {
	const { setTheme } = useTheme();
	const pathname = usePathname();
	const locale = useLocale();
	const t = useTranslations('header');
	const routePath = pathname.replace(`/${locale}`, '') || '/dashboard';
	const routeKey = routeKeys[routePath] || 'overview';
	const pageTitle = t(`routes.${routeKey}`);
	const gradient = routeGradients[routePath] || 'from-primary to-accent';

	return (
		<header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/80">
			<div className="flex h-16 items-center justify-between px-4 lg:px-6">
				<div className="pl-12 lg:pl-0">
					<h2
						className={`text-xl lg:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r ${gradient}`}
					>
						{pageTitle}
					</h2>
				</div>
				<div className="flex items-center gap-1">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="hover:bg-accent hover:text-accent-foreground transition-colors"
							>
								<Globe className="h-5 w-5" />
								<span className="sr-only">{t('changeLanguage')}</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-40">
							<DropdownMenuItem asChild>
								<Link
									href={routePath}
									locale="en"
									className="cursor-pointer flex items-center gap-2"
								>
									<span className="text-lg">🇺🇸</span>
									<span>{t('languages.english')}</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link
									href={routePath}
									locale="uk"
									className="cursor-pointer flex items-center gap-2"
								>
									<span className="text-lg">🇺🇦</span>
									<span>{t('languages.ukrainian')}</span>
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="hover:bg-accent hover:text-accent-foreground transition-colors"
							>
								<Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
								<Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
								<span className="sr-only">{t('toggleTheme')}</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-36">
							<DropdownMenuItem
								onClick={() => setTheme('light')}
								className="cursor-pointer"
							>
								<Sun className="mr-2 h-4 w-4" />
								<span>{t('theme.light')}</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setTheme('dark')}
								className="cursor-pointer"
							>
								<Moon className="mr-2 h-4 w-4" />
								<span>{t('theme.dark')}</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setTheme('system')}
								className="cursor-pointer"
							>
								<Globe className="mr-2 h-4 w-4" />
								<span>{t('theme.system')}</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
};
