'use client';

import {
	Activity,
	HeartPulse,
	Home,
	LayoutDashboard,
	Lightbulb,
	LogOut,
	Menu,
	Music2,
	User,
	X,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
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
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { Link, usePathname } from '@/i18n/navigation';
import { signOut, useSession } from '@/lib/auth/client';
import { cn } from '@/lib/utils';

const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
	const pathname = usePathname();
	const locale = useLocale();
	const t = useTranslations('sidebar');
	const { data: session } = useSession();
	const currentPath = pathname.replace(`/${locale}`, '');
	const handleLogout = async () => {
		await signOut();
		window.location.href = '/';
	};
	const getUserInitials = (name?: string) => {
		if (!name) return 'U';
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};

	const routes = [
		{
			label: t('routes.overview'),
			icon: LayoutDashboard,
			href: '/dashboard',
			color: 'text-chart-3',
		},
		{
			label: t('routes.listeningHistory'),
			icon: Activity,
			href: '/dashboard/listening',
			color: 'text-chart-2',
		},
		{
			label: t('routes.moodAnalysis'),
			icon: HeartPulse,
			href: '/dashboard/mood',
			color: 'text-chart-1',
		},
		{
			label: t('routes.insights'),
			icon: Lightbulb,
			href: '/dashboard/insights',
			color: 'text-chart-5',
		},
		{
			label: t('routes.recentPlays'),
			icon: Music2,
			href: '/dashboard/recent',
			color: 'text-chart-4',
		},
	];

	return (
		<div className="flex flex-col h-full bg-card text-foreground border-r border-border">
			<div className="p-6 border-b border-border bg-linear-to-br from-card to-muted/30">
				<Link
					href="/dashboard"
					onClick={onClose}
					className="flex items-center gap-3 group"
				>
					<div className="relative w-10 h-10 shrink-0">
						<div className="absolute inset-0 bg-linear-to-tr from-primary to-accent rounded-full opacity-30 blur-md group-hover:opacity-50 transition-opacity" />
						<Logo className="w-full h-full relative z-10 text-primary dark:text-white" />
					</div>
					<h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r 	from-primary to-accent">
						Vibecheck
					</h1>
				</Link>
			</div>
			<nav className="flex-1 overflow-y-auto p-4 space-y-1">
				{routes.map((route) => {
					const isActive = currentPath === route.href;
					return (
						<Link
							key={route.href}
							href={route.href}
							onClick={onClose}
							className={cn(
								'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
								isActive
									? 'bg-accent text-accent-foreground shadow-sm'
									: 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
							)}
						>
							<route.icon
								className={cn(
									'h-5 w-5 shrink-0 transition-transform group-hover:scale-110',
									isActive ? route.color : 'opacity-70',
									route.color
								)}
							/>
							<span className={cn(isActive && 'font-semibold')}>
								{route.label}
							</span>
						</Link>
					);
				})}
			</nav>
			<div className="p-4 border-t border-border bg-muted/20 space-y-2">
				<Link
					href="/"
					onClick={onClose}
					className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground transition-all duration-200"
				>
					<Home className="h-5 w-5 shrink-0 opacity-70" />
					<span>{t('backToHome')}</span>
				</Link>
				{session?.user && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="w-full justify-start gap-3 h-auto p-2.5 hover:bg-accent/50 transition-all duration-200"
							>
								<Avatar className="h-9 w-9 border-2 border-primary/20 ring-2 ring-primary/10">
									<AvatarImage
										src={session.user.image || ''}
										alt={session.user.name || 'User'}
									/>
									<AvatarFallback className="bg-linear-to-br from-primary to-accent text-primary-foreground text-sm font-semibold">
										{getUserInitials(session.user.name)}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1 text-left min-w-0">
									<p className="text-sm font-medium truncate">
										{session.user.name || 'User'}
									</p>
									<p className="text-xs text-muted-foreground truncate">
										{session.user.email}
									</p>
								</div>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel>{t('userMenu.myAccount')}</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link
									href="/profile"
									onClick={onClose}
									className="cursor-pointer flex items-center"
								>
									<User className="mr-2 h-4 w-4" />
									{t('userMenu.profile')}
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={handleLogout}
								className="text-destructive cursor-pointer focus:text-destructive focus:bg-destructive/10"
							>
								<LogOut className="mr-2 h-4 w-4" />
								{t('userMenu.logout')}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</div>
	);
};

export const Sidebar = () => {
	const [open, setOpen] = useState(false);
	const t = useTranslations('sidebar');

	return (
		<>
			<aside className="hidden lg:block w-72 h-screen sticky top-0 left-0">
				<SidebarContent />
			</aside>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild className="lg:hidden">
					<Button
						variant="outline"
						size="icon"
						className="absolute top-4 left-4 z-50 shadow-lg border-primary/20 bg-background hover:bg-accent focus:ring-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none"
					>
						<Menu className="h-5 w-5" />
						<span className="sr-only">{t('toggleMenu')}</span>
					</Button>
				</SheetTrigger>
				<SheetContent
					side="left"
					className="p-0 w-72 border-border [&>button]:hidden"
				>
					<SheetTitle className="sr-only">
						{t('routes.overview') || 'Menu'}
					</SheetTitle>
					<SidebarContent onClose={() => setOpen(false)} />
					<div className="absolute right-4 top-4 z-50">
						<SheetClose asChild>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
							>
								<X className="h-5 w-5 text-muted-foreground" />
								<span className="sr-only">Close</span>
							</Button>
						</SheetClose>
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
};
