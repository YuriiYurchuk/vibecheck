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
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Link } from '@/i18n/navigation';

type SidebarRouteKeys = keyof IntlMessages['dashboard']['sidebar']['routes'];

const routeGradients: Record<string, string> = {
	'/dashboard': 'from-chart-3 to-chart-2',
	'/dashboard/listening': 'from-chart-2 to-chart-1',
	'/dashboard/mood': 'from-chart-1 to-chart-5',
	'/dashboard/insights': 'from-chart-5 to-chart-4',
	'/dashboard/recent': 'from-chart-4 to-chart-3',
	'/profile': 'from-accent to-primary',
};

const routeKeys: Record<string, SidebarRouteKeys> = {
	'/dashboard': 'overview',
	'/dashboard/listening': 'listeningHistory',
	'/dashboard/mood': 'moodAnalysis',
	'/dashboard/insights': 'insights',
	'/dashboard/recent': 'recentPlays',
	'/dashboard/profile': 'profile',
};

export const DashboardHeader = () => {
	const { setTheme } = useTheme();
	const pathname = usePathname();
	const locale = useLocale();
	const tHead = useTranslations('common.header');
	const tRoutes = useTranslations('dashboard.sidebar.routes');
	const routePath = pathname.replace(`/${locale}`, '') || '/dashboard';
	const routeKey = routeKeys[routePath] || 'overview';
	const pageTitle = tRoutes(routeKey);
	const gradient = routeGradients[routePath] || 'from-primary to-accent';

	return (
		<header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
			<div className="flex items-center gap-2">
				<SidebarTrigger className="-ml-1 h-9 w-9" />
				<Separator orientation="vertical" className="mr-2 h-4" />
			</div>
			<div className="flex flex-1 items-center justify-between">
				<div>
					<h2
						className={`text-xl lg:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r ${gradient}`}
					>
						{pageTitle}
					</h2>
				</div>
				<div className="flex items-center gap-1">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<Globe className="h-5 w-5" />
								<span className="sr-only">{tHead('changeLanguage')}</span>
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
									<span>{tHead('languages.english')}</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link
									href={routePath}
									locale="uk"
									className="cursor-pointer flex items-center gap-2"
								>
									<span className="text-lg">🇺🇦</span>
									<span>{tHead('languages.ukrainian')}</span>
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
								<Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
								<span className="sr-only">{tHead('toggleTheme')}</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-36">
							<DropdownMenuItem
								onClick={() => setTheme('light')}
								className="cursor-pointer"
							>
								<Sun className="mr-2 h-4 w-4" />
								<span>{tHead('theme.light')}</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setTheme('dark')}
								className="cursor-pointer"
							>
								<Moon className="mr-2 h-4 w-4" />
								<span>{tHead('theme.dark')}</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setTheme('system')}
								className="cursor-pointer"
							>
								<Globe className="mr-2 h-4 w-4" />
								<span>{tHead('theme.system')}</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
};
