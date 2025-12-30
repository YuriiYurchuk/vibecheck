'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import {
	type Limit,
	LimitSelect,
	type Period,
	PeriodToggles,
} from '@/components/dashboard/filters';
import { Separator } from '@/components/ui/separator';
import { useSession } from '@/lib/auth/client';

type DashboardContentProps = {
	greetingKey: string;
};

export const Overview = ({ greetingKey }: DashboardContentProps) => {
	const t = useTranslations('dashboard');
	const session = useSession();
	const userName = session.data?.user?.name || '';

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const period = (searchParams.get('period') as Period) || 'week';
	const limit = (Number(searchParams.get('limit')) as Limit) || 10;

	const createQueryString = useCallback(
		(name: string, value: string | number) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, String(value));

			return params.toString();
		},
		[searchParams]
	);

	const handlePeriodChange = (newPeriod: Period) => {
		router.push(`${pathname}?${createQueryString('period', newPeriod)}`, {
			scroll: false,
		});
	};

	const handleLimitChange = (newLimit: Limit) => {
		router.push(`${pathname}?${createQueryString('limit', newLimit)}`, {
			scroll: false,
		});
	};

	return (
		<div>
			<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-chart-3 to-chart-2 sm:text-4xl">
						{t(`greeting.${greetingKey}`, { name: userName })}
					</h1>
					<p className="text-muted-foreground mt-2 text-base">
						{t('subtitle')}
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-4">
					<PeriodToggles value={period} onChange={handlePeriodChange} />
					<Separator
						orientation="vertical"
						className="h-8! bg-border shrink-0 hidden sm:block"
					/>
					<LimitSelect value={limit} onChange={handleLimitChange} />
				</div>
			</div>
		</div>
	);
};
