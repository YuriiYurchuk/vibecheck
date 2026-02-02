'use client';

import { cn } from '@/lib/utils';

type FadeInProps = {
	children: React.ReactNode;
	className?: string;
	delay?: number;
};

export const FadeIn = ({ children, className, delay = 0 }: FadeInProps) => {
	return (
		<div
			className={cn(
				'animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards',
				'motion-reduce:animate-none motion-reduce:opacity-100',
				className
			)}
			style={{ animationDelay: `${delay}ms` }}
		>
			{children}
		</div>
	);
};
