'use client';

import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { signIn, useSession } from '@/lib/auth/client';

type AuthButtonProps = {
	variant?: 'default' | 'ghost' | 'outline';
	size?: 'default' | 'sm' | 'lg';
	showAvatar?: boolean;
};

const SpotifyIcon = () => (
	<svg
		viewBox="0 0 24 24"
		className="mr-2 size-5 fill-current"
		aria-hidden="true"
	>
		<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
	</svg>
);

export const AuthButton = React.forwardRef<HTMLButtonElement, AuthButtonProps>(
	({ variant = 'default', size = 'default', showAvatar = true }, ref) => {
		const t = useTranslations('landing.header');
		const { data: session, isPending } = useSession();
		const [isSigningIn, setIsSigningIn] = React.useState(false);

		const handleSignIn = async () => {
			setIsSigningIn(true);
			try {
				await signIn.social({
					provider: 'spotify',
					callbackURL: '/dashboard',
				});
			} catch (error) {
				console.error('Auth error:', error);
				setIsSigningIn(false);
			}
		};

		if (isPending || isSigningIn) {
			return (
				<Button
					ref={ref}
					disabled
					variant={variant}
					size={size}
					className="gap-2"
				>
					<Loader2 className="size-4 animate-spin text-muted-foreground" />
					<span>{t('loading')}</span>
				</Button>
			);
		}

		if (session?.user) {
			return (
				<Button
					asChild
					variant={variant === 'ghost' ? 'ghost' : 'outline'}
					size={size}
					className="gap-2"
				>
					<Link href="/dashboard">
						{showAvatar && (
							<Avatar className="size-5 border border-border/50">
								<AvatarImage
									src={session.user.image || ''}
									alt={session.user.name || ''}
								/>
								<AvatarFallback className="text-[10px] bg-primary/10">
									{session.user.name?.[0]?.toUpperCase()}
								</AvatarFallback>
							</Avatar>
						)}
						<span>{t('goToDashboard')}</span>
						{variant !== 'ghost' && (
							<ArrowRight className="size-4 opacity-60" />
						)}
					</Link>
				</Button>
			);
		}

		return (
			<Button
				ref={ref}
				onClick={handleSignIn}
				variant={variant}
				size={size}
				className="font-semibold"
			>
				<SpotifyIcon />
				{t('connectSpotify')}
			</Button>
		);
	}
);

AuthButton.displayName = 'AuthButton';
