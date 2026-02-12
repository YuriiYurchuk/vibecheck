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
	X,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
	useSidebar,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@/i18n/navigation';
import { signOut, useSession } from '@/lib/auth/client';
import { cn } from '@/lib/utils';

export function AppSidebar({
	demoUser,
	basePath = '/dashboard',
}: {
	demoUser?: { name: string; email: string; image?: string };
	basePath?: string;
}) {
	const tSidebar = useTranslations('dashboard.sidebar');
	const pathname = usePathname();
	const locale = useLocale();
	const { data: session, isPending } = useSession();
	const { state, isMobile, setOpenMobile } = useSidebar();

	const normalizedPathname = pathname.startsWith(`/${locale}`)
		? pathname.replace(`/${locale}`, '') || '/'
		: pathname;

	const user = demoUser || session?.user;

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
		if (demoUser) {
			window.location.href = '/';
			return;
		}
		await signOut();
		window.location.href = '/';
	};

	const items = [
		{
			title: tSidebar('routes.overview'),
			url: basePath === '/dashboard' ? '/dashboard' : basePath,
			icon: LayoutDashboard,
			color: 'text-chart-3',
		},
		{
			title: tSidebar('routes.listeningHistory'),
			url: `${basePath}/listening`,
			icon: Activity,
			color: 'text-chart-2',
		},
		{
			title: tSidebar('routes.moodAnalysis'),
			url: `${basePath}/mood`,
			icon: HeartPulse,
			color: 'text-chart-1',
		},
		{
			title: tSidebar('routes.insights'),
			url: `${basePath}/insights`,
			icon: Lightbulb,
			color: 'text-chart-5',
		},
		{
			title: tSidebar('routes.recentPlays'),
			url: `${basePath}/recent`,
			icon: Music2,
			color: 'text-chart-4',
		},
	];

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<div className="flex w-full items-center justify-between pr-2">
					<SidebarMenu className="flex-1">
						<SidebarMenuItem>
							<SidebarMenuButton size="lg" asChild>
								<Link
									href={basePath}
									onClick={() => isMobile && setOpenMobile(false)}
								>
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
					{isMobile && (
						<Button
							variant="ghost"
							size="icon"
							className="ml-2 h-8 w-8 shrink-0 text-muted-foreground"
							onClick={() => setOpenMobile(false)}
						>
							<X className="size-5" />
							<span className="sr-only">Close sidebar</span>
						</Button>
					)}
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => {
								const isActive =
									normalizedPathname === item.url ||
									(normalizedPathname.startsWith(`${item.url}/`) &&
										item.url !== basePath);
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
						<SidebarMenuButton asChild tooltip={tSidebar('backToHome')}>
							<Link href="/">
								<Home className="opacity-70" />
								<span>{tSidebar('backToHome')}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					{isPending && !demoUser ? (
						<SidebarMenuItem>
							<SidebarMenuButton size="lg" className="pointer-events-none">
								<Skeleton className="h-8 w-8 rounded-lg" />
								{state !== 'collapsed' && (
									<>
										<div className="grid flex-1 gap-1 text-left text-sm leading-tight">
											<Skeleton className="h-4 w-24" />
											<Skeleton className="h-3 w-32" />
										</div>
										<Skeleton className="ml-auto size-4" />
									</>
								)}
							</SidebarMenuButton>
						</SidebarMenuItem>
					) : user ? (
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
													src={user.image || ''}
													alt={user.name || ''}
												/>
												<AvatarFallback className="rounded-lg bg-linear-to-r from-primary to-accent text-white">
													{getUserInitials(user.name)}
												</AvatarFallback>
											</Avatar>
											<div className="grid flex-1 text-left text-sm leading-tight">
												<span className="truncate font-semibold">
													{user.name}
												</span>
												<span className="truncate text-xs">{user.email}</span>
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
										{!demoUser && (
											<>
												<DropdownMenuLabel>
													{tSidebar('userMenu.myAccount')}
												</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<DropdownMenuItem asChild>
													<Link
														href="/dashboard/profile"
														className={cn(
															'flex w-full items-center cursor-pointer gap-2',
															normalizedPathname === '/dashboard/profile' &&
																'bg-sidebar-accent text-sidebar-accent-foreground'
														)}
													>
														<User className="size-4 opacity-70" />{' '}
														<span>{tSidebar('userMenu.profile')}</span>
													</Link>
												</DropdownMenuItem>
											</>
										)}
										<DropdownMenuItem
											onClick={handleLogout}
											className="cursor-pointer text-destructive focus:text-destructive focus:bg-sidebar-accent"
										>
											<LogOut className="mr-2 h-4 w-4" />
											{demoUser
												? tSidebar('userMenu.exitDemo')
												: tSidebar('userMenu.logout')}
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
