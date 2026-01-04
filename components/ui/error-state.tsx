'use client';

import { AlertCircle, RefreshCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
	title?: string;
	message?: string;
	retry?: () => void;
	className?: string;
}

export const ErrorState = ({
	title,
	message,
	retry,
	className,
}: ErrorStateProps) => {
	const t = useTranslations('api_errors');
	let translationKey = 'default_message';

	if (message === 'Unauthorized') {
		translationKey = 'unauthorized';
	} else if (message === 'Failed to fetch dashboard data') {
		translationKey = 'server_error';
	}

	const userMessage = t(translationKey);
	const displayTitle = title || t('default_title');

	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center',
				'p-4 md:p-6 text-center',
				'rounded-xl border border-destructive/20 bg-destructive/5',
				className
			)}
		>
			<div className="bg-destructive/10 p-3 rounded-full mb-3 md:mb-4">
				<AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-destructive" />
			</div>
			<h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
				{displayTitle}
			</h3>
			<p className="text-muted-foreground text-sm max-w-sm mb-4 md:mb-6">
				{userMessage}
			</p>
			{retry && (
				<Button onClick={retry} variant="outline" size="sm" className="gap-2">
					<RefreshCcw className="w-4 h-4" />
					{t('retry_button')}
				</Button>
			)}
		</div>
	);
};
