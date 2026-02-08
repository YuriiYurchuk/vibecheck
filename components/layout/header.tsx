'use client';

import Link from 'next/link';
import { AuthButton } from '@/components/landing/auth-button';
import { LangSwitcher } from '@/components/lang-switcher';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Separator } from '@/components/ui/separator';

export const LandingHeader = () => {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
			<div className="container mx-auto px-4 h-16 flex items-center justify-between">
				<Link
					href="/"
					className="flex items-center gap-2 hover:opacity-80 transition-opacity"
				>
					<Logo className="size-6 text-primary dark:text-white" />
					<span className="truncate font-bold text-xl bg-clip-text text-transparent bg-linear-to-r from-primary to-accent hidden sm:inline-block">
						Vibecheck
					</span>
				</Link>
				<nav className="flex items-center gap-1 md:gap-2">
					<ThemeToggle />
					<LangSwitcher />
					<Separator orientation="vertical" className="h-6!" />
					<AuthButton size="sm" variant="ghost" />
				</nav>
			</div>
		</header>
	);
};
