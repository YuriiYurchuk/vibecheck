'use client';

import {
	Activity,
	ChevronUp,
	HeartPulse,
	Home,
	LayoutDashboard,
	Lightbulb,
	LogOut,
	Music2,
	User,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FadeIn } from '@/components/ui/fade-in';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@/i18n/navigation';
import { signOut, useSession } from '@/lib/auth/client';
import { cn } from '@/lib/utils';

export function AppSidebar() {
	const t = useTranslations('sidebar');
	const pathname = usePathname();
	const locale = useLocale();
	const { data: session, isPending } = useSession();

	const currentPath = pathname.replace(`/${locale}`, '') || '/';

	const getUserInitials = (name?: string) => {
		if (!name) return 'U';
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};

	const handleLogout = async () => {
		await signOut();
		window.location.href = '/';
	};

	const items = [
		{
			title: t('routes.overview'),
			url: '/dashboard',
			icon: LayoutDashboard,
			color: 'text-chart-3',
		},
		{
			title: t('routes.listeningHistory'),
			url: '/dashboard/listening',
			icon: Activity,
			color: 'text-chart-2',
		},
		{
			title: t('routes.moodAnalysis'),
			url: '/dashboard/mood',
			icon: HeartPulse,
			color: 'text-chart-1',
		},
		{
			title: t('routes.insights'),
			url: '/dashboard/insights',
			icon: Lightbulb,
			color: 'text-chart-5',
		},
		{
			title: t('routes.recentPlays'),
			url: '/dashboard/recent',
			icon: Music2,
			color: 'text-chart-4',
		},
	];

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="/dashboard">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg">
									<Logo className="size-6 text-primary dark:text-white" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-bold text-xl bg-clip-text text-transparent bg-linear-to-r from-primary to-accent">
										Vibecheck
									</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => {
								const isActive =
									item.url === '/dashboard'
										? currentPath === '/dashboard'
										: currentPath.startsWith(item.url);
								return (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											isActive={isActive}
											tooltip={item.title}
											className={cn(
												'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
												isActive
													? 'bg-accent text-accent-foreground shadow-sm font-semibold'
													: 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
											)}
										>
											<Link href={item.url} className="flex items-center gap-3">
												<item.icon
													className={cn(
														'h-5 w-5 shrink-0 transition-transform group-hover:scale-110',
														isActive ? item.color : 'opacity-70'
													)}
													style={{
														color: isActive ? item.color : undefined,
													}}
												/>
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild tooltip={t('backToHome')}>
							<Link href="/">
								<Home className="opacity-70" />
								<span>{t('backToHome')}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					{isPending ? (
						<SidebarMenuItem>
							<SidebarMenuButton size="lg" className="pointer-events-none">
								<Skeleton className="h-8 w-8 rounded-lg" />
								<div className="grid flex-1 gap-1 text-left text-sm leading-tight">
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-3 w-32" />
								</div>
								<Skeleton className="ml-auto size-4" />
							</SidebarMenuButton>
						</SidebarMenuItem>
					) : session?.user ? (
						<FadeIn delay={200}>
							<SidebarMenuItem>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<SidebarMenuButton
											size="lg"
											className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
										>
											<Avatar className="h-8 w-8 rounded-lg">
												<AvatarImage
													src={session.user.image || ''}
													alt={session.user.name || ''}
												/>
												<AvatarFallback className="rounded-lg bg-linear-to-r from-primary to-accent text-white">
													{getUserInitials(session.user.name)}
												</AvatarFallback>
											</Avatar>
											<div className="grid flex-1 text-left text-sm leading-tight">
												<span className="truncate font-semibold">
													{session.user.name}
												</span>
												<span className="truncate text-xs">
													{session.user.email}
												</span>
											</div>
											<ChevronUp className="ml-auto size-4" />
										</SidebarMenuButton>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
										side="bottom"
										align="end"
										sideOffset={4}
									>
										<DropdownMenuLabel>
											{t('userMenu.myAccount')}
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											asChild
											className="cursor-pointer focus:bg-sidebar-accent focus:text-sidebar-accent-foreground"
										>
											<Link href="/profile" className="cursor-pointer">
												<User className="mr-2 h-4 w-4" />
												{t('userMenu.profile')}
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={handleLogout}
											className="cursor-pointer text-destructive focus:text-destructive focus:bg-sidebar-accent"
										>
											<LogOut className="mr-2 h-4 w-4" />
											{t('userMenu.logout')}
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</SidebarMenuItem>
						</FadeIn>
					) : null}
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
