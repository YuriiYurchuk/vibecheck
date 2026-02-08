'use client';

import { Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, usePathname } from '@/i18n/navigation';

export function LangSwitcher() {
	const t = useTranslations('common.header');
	const pathname = usePathname();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="size-9">
					<Globe className="size-4" />
					<span className="sr-only">{t('changeLanguage')}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem asChild>
					<Link
						href={pathname}
						locale="en"
						className="cursor-pointer flex items-center gap-2"
					>
						<span className="text-lg">🇺🇸</span>
						<span>{t('languages.english')}</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link
						href={pathname}
						locale="uk"
						className="cursor-pointer flex items-center gap-2"
					>
						<span className="text-lg">🇺🇦</span>
						<span>{t('languages.ukrainian')}</span>
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
