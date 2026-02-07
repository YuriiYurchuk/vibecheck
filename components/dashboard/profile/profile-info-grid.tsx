import { Calendar, Globe, Mail, User } from 'lucide-react';
import { useTranslations } from 'next-intl'; // 1. Імпорт
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useDateFormatter } from '@/hooks/use-date-formatter';
import { cn } from '@/lib/utils';

type ProfileInfoGridProps = {
	createdAt?: string | number | Date;
	timezone?: string | null;
	email?: string | null;
};

type InfoCardProps = {
	label: string;
	icon: React.ReactNode;
	value?: string | null;
	capitalize?: boolean;
	truncate?: boolean;
};

export const ProfileInfoGrid = ({
	createdAt,
	timezone,
	email,
}: ProfileInfoGridProps) => {
	const tInfo = useTranslations('dashboard.pages.profile.info');
	const { formatDate } = useDateFormatter(timezone || undefined);
	const displayTimezone =
		timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

	return (
		<div className="grid gap-6">
			<h3 className="text-lg font-semibold flex items-center gap-2">
				<User className="size-5 text-primary" />
				{tInfo('title')}
			</h3>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<InfoCard
					label={tInfo('registered')}
					icon={<Calendar className="size-5" />}
					value={createdAt ? formatDate(createdAt, 'd MMMM yyyy') : null}
					capitalize
				/>
				<InfoCard
					label={tInfo('timezone')}
					icon={<Globe className="size-5" />}
					value={displayTimezone}
				/>
				<InfoCard
					label={tInfo('email')}
					icon={<Mail className="size-5" />}
					value={email}
					truncate
				/>
			</div>
		</div>
	);
};

const InfoCard = ({
	label,
	icon,
	value,
	capitalize,
	truncate,
}: InfoCardProps) => {
	return (
		<Card className="bg-muted/10 border-border/60 shadow-sm">
			<CardContent className="p-6 flex flex-col gap-2">
				<Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
					{label}
				</Label>
				<div className="flex items-center gap-3">
					<div className="p-2 bg-primary/10 rounded-md text-primary">
						{icon}
					</div>
					<span
						className={cn(
							'text-lg font-medium',
							capitalize && 'capitalize',
							truncate && 'truncate'
						)}
						title={truncate && value ? value : undefined}
					>
						{value || '—'}
					</span>
				</div>
			</CardContent>
		</Card>
	);
};
